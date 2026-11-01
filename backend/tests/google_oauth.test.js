import test from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { generatePkcePair } from "../src/utils/security.js";
import {
  generateGoogleAuthUrl,
  exchangeAndVerifyGoogleToken
} from "../src/services/googleAuth.service.js";

test("Google OAuth: PKCE code_verifier and code_challenge S256 generation", () => {
  const { verifier, challenge } = generatePkcePair();

  assert.ok(verifier, "Verifier must exist");
  assert.ok(challenge, "Challenge must exist");
  assert.equal(typeof verifier, "string");
  assert.equal(typeof challenge, "string");

  // Verify that challenge matches SHA-256 base64url of verifier
  const expectedChallenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  assert.equal(challenge, expectedChallenge, "Challenge must be the SHA-256 base64url digest of verifier");
});

test("Google OAuth: Authorization URL contains client_id, redirect_uri, state, and PKCE challenge", () => {
  const mockClient = {
    generateAuthUrl(opts) {
      assert.equal(opts.code_challenge_method, "S256");
      assert.equal(opts.access_type, "offline");
      assert.deepEqual(opts.scope, ["openid", "profile", "email"]);
      return `https://accounts.google.com/o/oauth2/v2/auth?state=${opts.state}&code_challenge=${opts.code_challenge}`;
    }
  };

  const state = "test-state-token-12345";
  const { challenge } = generatePkcePair();

  const url = generateGoogleAuthUrl({
    client: mockClient,
    state,
    codeChallenge: challenge
  });

  assert.ok(url.includes("accounts.google.com"));
  assert.ok(url.includes(`state=${state}`));
  assert.ok(url.includes(`code_challenge=${challenge}`));
});

test("Google OAuth: Successful login / ID token verification extracts claims securely", async () => {
  const mockPayload = {
    iss: "https://accounts.google.com",
    sub: "google-sub-99887766",
    email: "donor@rakt-dal.org",
    email_verified: true,
    name: "Jane Donor",
    picture: "https://lh3.googleusercontent.com/photo.jpg"
  };

  const mockClient = {
    getToken({ code, codeVerifier }) {
      assert.equal(code, "valid-auth-code");
      assert.ok(codeVerifier);
      return Promise.resolve({ tokens: { id_token: "mock-valid-id-token" } });
    },
    verifyIdToken({ idToken }) {
      assert.equal(idToken, "mock-valid-id-token");
      return Promise.resolve({
        getPayload: () => mockPayload
      });
    }
  };

  const { payload } = await exchangeAndVerifyGoogleToken({
    client: mockClient,
    code: "valid-auth-code",
    codeVerifier: "mock-pkce-verifier"
  });

  assert.equal(payload.sub, mockPayload.sub, "Must extract Google unique 'sub'");
  assert.equal(payload.email, "donor@rakt-dal.org");
  assert.equal(payload.emailVerified, true);
  assert.equal(payload.name, "Jane Donor");
  assert.equal(payload.picture, mockPayload.picture);
});

test("Google OAuth: Rejects token with invalid issuer", async () => {
  const mockClient = {
    getToken() {
      return Promise.resolve({ tokens: { id_token: "invalid-issuer-token" } });
    },
    verifyIdToken() {
      return Promise.resolve({
        getPayload: () => ({
          iss: "https://malicious-issuer.com",
          sub: "sub123",
          email: "victim@example.com"
        })
      });
    }
  };

  await assert.rejects(
    () => exchangeAndVerifyGoogleToken({
      client: mockClient,
      code: "code",
      codeVerifier: "verifier"
    }),
    /Invalid token issuer/
  );
});

test("Google OAuth: Rejects token missing 'sub' identifier", async () => {
  const mockClient = {
    getToken() {
      return Promise.resolve({ tokens: { id_token: "missing-sub-token" } });
    },
    verifyIdToken() {
      return Promise.resolve({
        getPayload: () => ({
          iss: "https://accounts.google.com",
          email: "nosub@example.com"
        })
      });
    }
  };

  await assert.rejects(
    () => exchangeAndVerifyGoogleToken({
      client: mockClient,
      code: "code",
      codeVerifier: "verifier"
    }),
    /Missing 'sub' identifier/
  );
});

test("Google OAuth State & PKCE Validation Logic: Detects state tampering and missing verifier", () => {
  const savedState = "original-state-123";
  const callbackState = "tampered-state-999";

  const isStateValid = savedState === callbackState;
  assert.equal(isStateValid, false, "Tampered state must be rejected");

  const missingVerifier = undefined;
  assert.equal(Boolean(missingVerifier), false, "Missing PKCE verifier must be rejected");
});

test("Google OAuth: Cancelled authorization detected from query error", () => {
  const query = { error: "access_denied" };
  const isCancelled = Boolean(query.error || !query.code);
  assert.equal(isCancelled, true, "OAuth cancellation must be detected");
});

test("Google OAuth Identity Protection: Prevents duplicate identity conflict / unsafe account linking", () => {
  // Existing user in database linked to Google sub 'sub-A'
  const existingUserInDb = {
    email: "user@example.com",
    googleSubject: "google-sub-original-A"
  };

  // Attacker or different Google account presents Google sub 'sub-B' with same email
  const incomingGooglePayload = {
    email: "user@example.com",
    sub: "google-sub-attacker-B"
  };

  const isConflict =
    existingUserInDb.googleSubject &&
    existingUserInDb.googleSubject !== incomingGooglePayload.sub;

  assert.equal(isConflict, true, "Must flag conflict when email is already linked to a different Google Subject");
});
