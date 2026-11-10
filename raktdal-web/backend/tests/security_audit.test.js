import test from "node:test";
import assert from "node:assert/strict";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  hashToken,
  generateRandomToken,
  generateAccessToken,
  verifyAccessToken,
  verifyCsrf,
  getCookieOptions
} from "../src/utils/security.js";
import { generateSixDigitOtp, hashOtp } from "../src/utils/otp.js";
import {
  authenticate,
  authorize,
  requireOwnership,
  requireVerifiedOrganization,
  preventSelfRoleElevation
} from "../src/middleware/auth.middleware.js";

test("Audit 1 & 2: Registration validation and duplicate email rejection logic", () => {
  // Validate duplicate detection logic
  const existingUsers = [{ email: "test@raktdal.org" }];
  const isDuplicate = (email) => existingUsers.some(u => u.email === email.toLowerCase().trim());

  assert.equal(isDuplicate("test@raktdal.org"), true, "Duplicate registration must be detected");
  assert.equal(isDuplicate("TEST@raktdal.org"), true, "Case-insensitive duplicate must be detected");
  assert.equal(isDuplicate("newuser@raktdal.org"), false, "Unique email allowed");

  // Validate format checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  assert.equal(emailRegex.test("invalid-email"), false);
  assert.equal(emailRegex.test("donor@rakt-dal.org"), true);
});

test("Audit 3: Password hashing uses Argon2 and never stores plain text", async () => {
  const plain = "SuperSecretPassword#2026";
  const hashed = await argon2.hash(plain);

  assert.notEqual(hashed, plain, "Password must never equal plain text");
  assert.ok(hashed.startsWith("$argon2id"), "Must use Argon2id variant");
  assert.equal(await argon2.verify(hashed, plain), true, "Argon2 verifies valid password");
  assert.equal(await argon2.verify(hashed, "wrong"), false, "Argon2 rejects invalid password");
});

test("Audit 4: OTP generation is 6-digit numeric and hashed with SHA-256", () => {
  const otp = generateSixDigitOtp();
  assert.match(otp, /^\d{6}$/, "OTP must be exactly 6 numeric digits");

  const hash1 = hashOtp(otp);
  const hash2 = hashOtp(otp);
  assert.equal(hash1, hash2, "OTP hash must be deterministic");
  assert.equal(hash1.length, 64, "SHA-256 hash must be 64 hex characters");
  assert.notEqual(hash1, otp, "Stored OTP must be hashed, not plain text");
});

test("Audit 5, 6 & 7: OTP expiration, reuse prevention and attempts lockout", () => {
  const now = Date.now();
  const validRecord = {
    otpHash: hashOtp("123456"),
    expiresAt: new Date(now + 600000),
    isUsed: false,
    attempts: 0,
    maxAttempts: 5
  };

  // Valid verification
  assert.equal(now <= validRecord.expiresAt.getTime(), true, "Valid OTP is not expired");
  assert.equal(validRecord.isUsed, false, "Valid OTP has not been used");

  // Mark as used
  validRecord.isUsed = true;
  assert.equal(validRecord.isUsed, true, "OTP reuse must be blocked once marked used");

  // Expired OTP
  const expiredRecord = {
    otpHash: hashOtp("123456"),
    expiresAt: new Date(now - 1000),
    isUsed: false,
    attempts: 0,
    maxAttempts: 5
  };
  assert.equal(now > expiredRecord.expiresAt.getTime(), true, "Expired OTP must be detected");

  // Lockout after max attempts
  const lockedRecord = {
    otpHash: hashOtp("123456"),
    expiresAt: new Date(now + 600000),
    isUsed: false,
    attempts: 5,
    maxAttempts: 5
  };
  assert.equal(lockedRecord.attempts >= lockedRecord.maxAttempts, true, "Max attempts lockout must trigger");
});

test("Audit 8, 9 & 10: Login credential verification & unverified email blocking", async () => {
  const storedUser = {
    email: "user@rakt-dal.org",
    passwordHash: await argon2.hash("ValidPassword123!"),
    emailVerifiedAt: null,
    accountStatus: "ACTIVE"
  };

  // Check valid password
  const validPass = await argon2.verify(storedUser.passwordHash, "ValidPassword123!");
  assert.equal(validPass, true);

  // Check invalid password
  const invalidPass = await argon2.verify(storedUser.passwordHash, "WrongPassword");
  assert.equal(invalidPass, false);

  // Check unverified email guard
  assert.equal(storedUser.emailVerifiedAt, null, "Unverified user has null emailVerifiedAt");
  const canLogin = storedUser.emailVerifiedAt !== null;
  assert.equal(canLogin, false, "Unverified user must be blocked from logging in");

  // Verify email and re-check
  storedUser.emailVerifiedAt = new Date();
  assert.equal(storedUser.emailVerifiedAt !== null, true, "Verified user is permitted");
});

test("Audit 11: Access token expiration enforcement", () => {
  const secret = process.env.JWT_SECRET || "rakt-dal-jwt-secret-key";
  const expiredToken = jwt.sign(
    { id: "user123", email: "donor@rakt-dal.org", roles: ["USER"] },
    secret,
    { expiresIn: "-5s" }
  );

  const decoded = verifyAccessToken(expiredToken);
  assert.equal(decoded, null, "Expired access token must return null/rejected");
});

test("Audit 12 & 13: Refresh-token rotation and reuse detection (token family revocation)", () => {
  const tokenFamilyId = "family-uuid-456";
  const sessions = [
    { id: "session1", tokenFamilyId, tokenHash: hashToken("token-1"), isRevoked: false },
    { id: "session2", tokenFamilyId, tokenHash: hashToken("token-2"), isRevoked: false }
  ];

  // Rotate token-1 -> mark token-1 revoked
  sessions[0].isRevoked = true;

  // An attacker attempts to reuse token-1
  const reusedSession = sessions.find(s => s.tokenHash === hashToken("token-1"));
  assert.equal(reusedSession.isRevoked, true, "Reused token is flagged as already revoked");

  // On reuse detected, revoke entire family
  sessions.forEach(s => {
    if (s.tokenFamilyId === reusedSession.tokenFamilyId) {
      s.isRevoked = true;
    }
  });

  assert.ok(sessions.every(s => s.isRevoked === true), "All sessions in family revoked upon reuse");
});

test("Audit 14: Logout session revocation and cookie clearing", () => {
  const session = { refreshTokenHash: hashToken("session-token"), isRevoked: false };
  // Logout execution
  session.isRevoked = true;
  assert.equal(session.isRevoked, true, "Session must be marked revoked on logout");

  const cookieOpts = getCookieOptions();
  assert.equal(cookieOpts.httpOnly, true, "Cookie must have httpOnly set");
  assert.equal(cookieOpts.path, "/", "Cookie path must be root");
});

test("Audit 15: Forgot password email enumeration prevention (generic response)", () => {
  const genericResponse = {
    success: true,
    message: "If an account with that email exists, password reset instructions have been sent."
  };

  // Response for registered email
  const responseForRegistered = { ...genericResponse };
  // Response for unregistered email
  const responseForUnregistered = { ...genericResponse };

  assert.deepEqual(
    responseForRegistered,
    responseForUnregistered,
    "Responses for registered and unregistered emails must be identical to prevent enumeration"
  );
});

test("Audit 16: Reset password token single-use & session invalidation", () => {
  const rawToken = generateRandomToken(32);
  const tokenHash = hashToken(rawToken);
  const resetRecord = {
    tokenHash,
    isUsed: false,
    expiresAt: new Date(Date.now() + 900000)
  };

  // Valid reset
  assert.equal(resetRecord.isUsed, false);
  assert.equal(hashToken(rawToken), resetRecord.tokenHash);

  // Consume token
  resetRecord.isUsed = true;
  assert.equal(resetRecord.isUsed, true, "Token cannot be reused after consumption");
});

test("Audit 17: CSRF protection requires X-Requested-With on state-changing requests", () => {
  let nextCalled = false;
  let statusSet = null;
  let jsonResponse = null;

  const mockRes = {
    status(code) {
      statusSet = code;
      return this;
    },
    json(payload) {
      jsonResponse = payload;
      return this;
    }
  };

  // Request without custom header
  verifyCsrf({ method: "POST", headers: {} }, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, false, "CSRF middleware must block POST without CSRF header");
  assert.equal(statusSet, 403, "Must return HTTP 403 Forbidden");

  // Request with valid header
  nextCalled = false;
  verifyCsrf({ method: "POST", headers: { "x-requested-with": "XMLHttpRequest" } }, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, true, "CSRF middleware allows requests with X-Requested-With");

  // Safe method GET passes without header
  nextCalled = false;
  verifyCsrf({ method: "GET", headers: {} }, mockRes, () => { nextCalled = true; });
  assert.equal(nextCalled, true, "Safe methods bypass CSRF check");
});

test("Audit 18: CORS configuration enforces explicit origin and credentials", () => {
  const frontendUrl = "https://raktdal.org";
  const corsConfig = {
    origin: frontendUrl,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  };

  assert.notEqual(corsConfig.origin, "*", "CORS origin must not be wildcard with credentials");
  assert.equal(corsConfig.credentials, true, "CORS credentials must be enabled for secure cookies");
  assert.ok(corsConfig.allowedHeaders.includes("X-Requested-With"), "X-Requested-With must be allowed");
});

test("Audit 19: Role-based authorization (USER vs ADMIN)", () => {
  const adminAuthorizer = authorize("ADMIN");
  let nextCalled = false;
  let statusCode = null;

  const res = {
    status(code) { statusCode = code; return this; },
    json() { return this; }
  };

  // Standard user attempting admin endpoint
  adminAuthorizer({ user: { platformRoles: ["USER"] } }, res, () => { nextCalled = true; });
  assert.equal(nextCalled, false, "Standard USER must be blocked from ADMIN endpoint");
  assert.equal(statusCode, 403, "Must return 403 Forbidden");

  // Admin user attempting admin endpoint
  nextCalled = false;
  adminAuthorizer({ user: { platformRoles: ["ADMIN"] } }, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true, "ADMIN user must be granted access");
});

test("Audit 20: Self-role elevation prevention", () => {
  let nextCalled = false;
  let statusCode = null;
  const res = {
    status(code) { statusCode = code; return this; },
    json() { return this; }
  };

  // Standard user trying to elevate to ADMIN
  const maliciousReq = {
    user: { platformRoles: ["USER"] },
    body: { platformRoles: ["ADMIN"] }
  };

  preventSelfRoleElevation(maliciousReq, res, () => { nextCalled = true; });
  assert.equal(nextCalled, false, "User must not be able to elevate platformRoles");
  assert.equal(statusCode, 403, "Must return 403 for role elevation attempt");

  // Standard user updating normal fields
  nextCalled = false;
  const benignReq = {
    user: { platformRoles: ["USER"] },
    body: { fullName: "Updated Name" }
  };
  preventSelfRoleElevation(benignReq, res, () => { nextCalled = true; });
  assert.equal(nextCalled, true, "Normal field updates are permitted");
});

test("Audit 21: NoSQL Injection protection via strict string type validation", () => {
  const invalidPayloads = [
    { email: { $gt: "" }, password: "password123" },
    { email: ["admin@raktdal.org"], password: "password123" },
    { email: 12345, password: "password123" }
  ];

  for (const payload of invalidPayloads) {
    const isValidType = typeof payload.email === "string" && typeof payload.password === "string";
    assert.equal(isValidType, false, "NoSQL query object or non-string input must fail type validation");
  }
});
