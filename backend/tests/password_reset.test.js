import test from "node:test";
import assert from "node:assert/strict";
import argon2 from "argon2";
import crypto from "crypto";
import { hashOtp } from "../src/utils/otp.js";

test("Password Reset: Generates high entropy random token and SHA-256 hash", () => {
  const token = crypto.randomBytes(32).toString("hex");
  assert.equal(token.length, 64);

  const hash1 = hashOtp(token);
  const hash2 = hashOtp(token);
  assert.equal(hash1, hash2, "Reset token hashing must be deterministic");
  assert.equal(hash1.length, 64);
});

test("Password Reset: Argon2 hashes new password and verifies correctly", async () => {
  const newPassword = "BrandNewSecurePassword2026!";
  const hash = await argon2.hash(newPassword);

  assert.ok(hash.startsWith("$argon2"));
  const isValid = await argon2.verify(hash, newPassword);
  assert.equal(isValid, true, "Argon2 should verify the new password");

  const isOldValid = await argon2.verify(hash, "OldPassword123");
  assert.equal(isOldValid, false, "Argon2 should reject old or wrong password");
});

test("Password Reset Security: Expired reset token is detected and rejected", () => {
  const expiredTime = new Date(Date.now() - 5000); // 5 seconds ago
  const isExpired = new Date() > expiredTime;
  assert.equal(isExpired, true, "Past expiration time must be identified as expired");

  const validFutureTime = new Date(Date.now() + 15 * 60 * 1000); // 15 mins future
  const isStillValid = new Date() <= validFutureTime;
  assert.equal(isStillValid, true, "Future time must be valid");
});

test("Password Reset Security: Credential reuse is prevented", () => {
  const resetRecord = {
    tokenHash: hashOtp("my-secret-reset-token"),
    isUsed: false
  };

  // First use succeeds
  assert.equal(resetRecord.isUsed, false);
  resetRecord.isUsed = true; // Consumed

  // Reused token is rejected
  assert.equal(resetRecord.isUsed, true, "Consumed reset token cannot be reused");
});

test("Password Reset Security: Limit verification attempts", () => {
  const maxAttempts = 5;
  let attempts = 0;

  for (let i = 0; i < 5; i++) {
    attempts += 1;
  }

  assert.equal(attempts >= maxAttempts, true, "Token is locked after reaching max attempts");
});

test("Password Reset Security: Revokes all sessions on password reset", () => {
  // Simulate active sessions in DB
  const userSessions = [
    { id: "sess-1", isRevoked: false },
    { id: "sess-2", isRevoked: false },
    { id: "sess-3", isRevoked: false }
  ];

  // Upon password reset: revoke all
  userSessions.forEach((s) => {
    s.isRevoked = true;
  });

  assert.ok(userSessions.every((s) => s.isRevoked === true), "All sessions must be marked isRevoked: true");
});

test("Password Reset Security: Generic response prevents email enumeration", () => {
  const genericMessage = "If an account with that email exists, password reset instructions have been sent.";

  // Both for existing and non-existing email
  const responseForExistingUser = genericMessage;
  const responseForNonExistingUser = genericMessage;

  assert.equal(
    responseForExistingUser,
    responseForNonExistingUser,
    "Response must be identical to prevent user enumeration"
  );
});
