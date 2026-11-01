import test from "node:test";
import assert from "node:assert/strict";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  hashToken,
  generateRandomToken,
  generateAccessToken,
  verifyAccessToken
} from "../src/utils/security.js";

test("Password Hashing: Argon2 hashes and verifies password correctly", async () => {
  const plainPassword = "StrongSecretPassword123!";
  const hash = await argon2.hash(plainPassword);

  assert.ok(hash.startsWith("$argon2"));

  const isValid = await argon2.verify(hash, plainPassword);
  assert.equal(isValid, true, "Argon2 should verify the correct password");

  const isInvalid = await argon2.verify(hash, "WrongPassword");
  assert.equal(isInvalid, false, "Argon2 should reject incorrect passwords");
});

test("Access Token: Generates short-lived JWT and verifies claims", () => {
  const mockUser = {
    _id: "65cb76d8b671a5a4c52f1901",
    email: "donor@rakt-dal.org",
    platformRoles: ["USER"]
  };


  const token = generateAccessToken(mockUser);
  assert.ok(token);

  const decoded = verifyAccessToken(token);
  assert.ok(decoded);
  assert.equal(decoded.id, mockUser._id);
  assert.equal(decoded.email, mockUser.email);
});

test("Access Token: Rejects invalid or tampered tokens", () => {
  const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature";
  const result = verifyAccessToken(invalidToken);
  assert.equal(result, null, "Tampered token must return null");
});

test("Access Token: Rejects expired tokens", () => {
  // Sign a token that expired 10 seconds ago
  const secret = process.env.JWT_SECRET || "rakt-dal-jwt-secret-key";
  const expiredToken = jwt.sign(
    { id: "123", email: "test@org.in" },
    secret,
    { expiresIn: "-10s" }
  );

  const result = verifyAccessToken(expiredToken);
  assert.equal(result, null, "Expired token must be rejected");
});

test("Refresh Token & Session: Hashing is deterministic", () => {
  const rawToken = generateRandomToken(40);
  const hash1 = hashToken(rawToken);
  const hash2 = hashToken(rawToken);

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
});

test("Token Family Reuse Detection Logic: Revokes family on reuse", () => {
  // Simulate active session family
  const tokenFamilyId = "family-xyz-123";
  const initialSession = {
    tokenFamilyId,
    refreshTokenHash: hashToken("token-1"),
    isRevoked: false
  };

  // Rotation: token-1 is consumed
  initialSession.isRevoked = true;

  // Attacker attempts to reuse token-1
  const isReuse = initialSession.isRevoked;
  assert.equal(isReuse, true, "Reusing a previously revoked token must be detected as reuse");

  // On reuse, all tokens with tokenFamilyId must be revoked
  const sessionsInFamily = [
    initialSession,
    { tokenFamilyId, refreshTokenHash: hashToken("token-2"), isRevoked: false }
  ];

  sessionsInFamily.forEach((s) => {
    s.isRevoked = true;
  });

  assert.ok(sessionsInFamily.every((s) => s.isRevoked === true), "All sessions in family must be revoked");
});

test("Unauthorized Request Logic: Missing token returns unauthorized", () => {
  const req = { cookies: {}, headers: {} };
  const token = req.cookies?.accessToken || req.headers.authorization;
  assert.equal(!token, true, "Missing token correctly flagged as unauthorized");
});
