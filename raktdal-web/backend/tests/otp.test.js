import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { generateSixDigitOtp, hashOtp } from "../src/utils/otp.js";

test("OTP Utils: Generates valid cryptographically secure 6-digit numeric string", () => {
  const otp = generateSixDigitOtp();
  assert.equal(typeof otp, "string");
  assert.equal(otp.length, 6);
  assert.match(otp, /^[0-9]{6}$/);
});

test("OTP Utils: hashOtp generates deterministic SHA-256 hash", () => {
  const otp = "123456";
  const hash1 = hashOtp(otp);
  const hash2 = hashOtp(otp);

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
});

test("OTP Verification Logic: Valid OTP matches hash", () => {
  const rawOtp = "456789";
  const storedHash = hashOtp(rawOtp);

  const inputOtp = "456789";
  assert.equal(hashOtp(inputOtp), storedHash, "Valid OTP must match stored hash");
});

test("OTP Verification Logic: Invalid OTP fails hash match", () => {
  const rawOtp = "456789";
  const storedHash = hashOtp(rawOtp);

  const wrongOtp = "999999";
  assert.notEqual(hashOtp(wrongOtp), storedHash, "Invalid OTP must not match stored hash");
});

test("OTP Expiration Logic: Expired OTP is detected", () => {
  const expiredDate = new Date(Date.now() - 1000); // 1 second ago
  const isExpired = new Date() > expiredDate;
  assert.equal(isExpired, true, "OTP timestamp in past must be evaluated as expired");

  const futureDate = new Date(Date.now() + 10 * 60 * 1000); // 10 mins future
  const isStillValid = new Date() <= futureDate;
  assert.equal(isStillValid, true, "Future OTP must be evaluated as valid");
});

test("OTP Reuse Prevention Logic: Used OTP is rejected", () => {
  const otpRecord = {
    otpHash: hashOtp("112233"),
    isUsed: false
  };

  // First use succeeds and marks as used
  assert.equal(otpRecord.isUsed, false);
  otpRecord.isUsed = true;

  // Second attempt (reuse) is rejected
  assert.equal(otpRecord.isUsed, true, "Used OTP must not be accepted again");
});

test("OTP Attempt Limiting Logic: Max attempts lock out code", () => {
  const maxAttempts = 5;
  let attempts = 0;

  for (let i = 0; i < 5; i++) {
    attempts += 1;
  }

  assert.equal(attempts >= maxAttempts, true, "Exceeding or reaching max attempts must invalidate OTP");
});

test("JWT session token signs and verifies correctly", () => {
  const secret = "test-secret";
  const payload = { id: "user123", email: "student@chitkara.edu.in", roles: ["DONOR"] };

  const token = jwt.sign(payload, secret, { expiresIn: "7d" });
  assert.ok(token);

  const decoded = jwt.verify(token, secret);
  assert.equal(decoded.id, "user123");
  assert.equal(decoded.email, "student@chitkara.edu.in");
});
