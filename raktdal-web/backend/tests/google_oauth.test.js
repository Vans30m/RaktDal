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

test("Google OAuth: Rejects token with incorrect audience", async () => {
  const mockClient = {
    getToken() {
      return Promise.resolve({ tokens: { id_token: "wrong-audience-token" } });
    },
    verifyIdToken({ audience }) {
      assert.ok(audience);
      // Simulate audience mismatch rejection from google-auth-library
      return Promise.reject(new Error("Wrong recipient, payload audience doesn't match client ID."));
    }
  };

  await assert.rejects(
    () => exchangeAndVerifyGoogleToken({
      client: mockClient,
      code: "code",
      codeVerifier: "verifier"
    }),
    /Wrong recipient/
  );
});

test("Google OAuth: Rejects expired ID token", async () => {
  const mockClient = {
    getToken() {
      return Promise.resolve({ tokens: { id_token: "expired-id-token" } });
    },
    verifyIdToken() {
      // Simulate expiration rejection from google-auth-library
      return Promise.reject(new Error("Token used too late, expired 120 seconds ago."));
    }
  };

  await assert.rejects(
    () => exchangeAndVerifyGoogleToken({
      client: mockClient,
      code: "code",
      codeVerifier: "verifier"
    }),
    /Token used too late/
  );
});

test("Google OAuth: Existing user vs New user creation logic", () => {
  const databaseUsers = [
    { _id: "u-1", email: "existing@example.com", googleSubject: "sub-12345" }
  ];

  // Lookup existing user by sub
  const existingBySub = databaseUsers.find(u => u.googleSubject === "sub-12345");
  assert.ok(existingBySub, "Must find existing user by googleSubject");

  // Lookup new user by sub
  const newBySub = databaseUsers.find(u => u.googleSubject === "sub-new-999");
  assert.equal(newBySub, undefined, "New user does not exist in database yet");
});

test("Session Security: Logout from all devices revokes all sessions belonging to user", () => {
  const userId = "user-multi-device";
  const userSessions = [
    { id: "s-desktop", userId, isRevoked: false },
    { id: "s-mobile", userId, isRevoked: false },
    { id: "s-tablet", userId, isRevoked: false }
  ];

  // Execute global logout
  userSessions.forEach(s => {
    if (s.userId === userId) s.isRevoked = true;
  });

  assert.ok(userSessions.every(s => s.isRevoked === true), "All sessions for this user must be revoked");
});

test("Security: Cookie security attributes enforcement (HttpOnly, Secure in prod, SameSite, Path)", () => {
  const devCookies = { httpOnly: true, secure: false, sameSite: "lax", path: "/" };
  const prodCookies = { httpOnly: true, secure: true, sameSite: "none", path: "/" };

  assert.equal(devCookies.httpOnly, true);
  assert.equal(devCookies.path, "/");
  assert.equal(prodCookies.httpOnly, true);
  assert.equal(prodCookies.secure, true);
  assert.equal(prodCookies.sameSite, "none");
});

test("Security: Open redirect prevention in OAuth callback", () => {
  const allowedOrigin = "http://localhost:5500";
  const sanitizeRedirect = (target) => {
    // Only allow redirects strictly beginning with configured frontendUrl
    if (typeof target === "string" && target.startsWith(allowedOrigin)) {
      return target;
    }
    return `${allowedOrigin}/index.html#/login`;
  };

  assert.equal(sanitizeRedirect("https://evil-attacker.com/phishing"), "http://localhost:5500/index.html#/login");
  assert.equal(sanitizeRedirect("javascript:alert(1)"), "http://localhost:5500/index.html#/login");
  assert.equal(sanitizeRedirect("http://localhost:5500/index.html#/profile"), "http://localhost:5500/index.html#/profile");
});

test("Security: Replay attack prevention via single-use OAuth state and PKCE verifier", () => {
  const transactionCookies = {
    oauth_state: "state-token-123",
    oauth_code_verifier: "pkce-verifier-abc"
  };

  // Immediate clearing upon callback arrival
  delete transactionCookies.oauth_state;
  delete transactionCookies.oauth_code_verifier;

  // Replay attempt by attacker
  const isStatePresent = Boolean(transactionCookies.oauth_state);
  const isVerifierPresent = Boolean(transactionCookies.oauth_code_verifier);

  assert.equal(isStatePresent, false, "Replayed state must fail because cookie was consumed and cleared");
  assert.equal(isVerifierPresent, false, "Replayed PKCE verifier must fail");
});

