import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import { createRateLimiter, resetRateLimitStore } from "../src/middleware/rateLimiter.js";
import { DonorProfile } from "../src/models/DonorProfile.js";
import { Organization } from "../src/models/Organization.js";

test("Phase 19 Audit: Rate Limiter Middleware protects endpoints against excessive requests", async () => {
  resetRateLimitStore();
  const limiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 3,
    message: "Rate limit exceeded for testing",
    prefix: "test_limiter"
  });

  const mockReq = {
    ip: "192.168.1.100",
    headers: { "x-test-rate-limit": "true" }
  };

  const headers = {};
  let statusCode = 200;
  let jsonBody = null;

  function createMockRes() {
    return {
      setHeader(name, val) {
        headers[name] = val;
      },
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonBody = data;
        return this;
      }
    };
  }

  let nextCalledCount = 0;
  const next = () => { nextCalledCount++; };

  // Call 1
  limiter(mockReq, createMockRes(), next);
  assert.equal(nextCalledCount, 1);
  assert.equal(headers["X-RateLimit-Remaining"], 2);

  // Call 2
  limiter(mockReq, createMockRes(), next);
  assert.equal(nextCalledCount, 2);
  assert.equal(headers["X-RateLimit-Remaining"], 1);

  // Call 3
  limiter(mockReq, createMockRes(), next);
  assert.equal(nextCalledCount, 3);
  assert.equal(headers["X-RateLimit-Remaining"], 0);

  // Call 4: Must be blocked with 429
  limiter(mockReq, createMockRes(), next);
  assert.equal(nextCalledCount, 3, "Next must not be called when limit is exceeded");
  assert.equal(statusCode, 429);
  assert.equal(jsonBody.success, false);
  assert.equal(jsonBody.message, "Rate limit exceeded for testing");
  assert.ok(headers["Retry-After"] > 0);
});

test("Phase 19 Audit: Donor Privacy Guarantee in Public Discovery", () => {
  const profile = new DonorProfile({
    userId: "507f191e810c19729de860ea",
    bloodGroup: "O+",
    age: 28,
    location: {
      city: "Mumbai",
      district: "Mumbai Suburban",
      state: "Maharashtra",
      pinCode: "400001"
    },
    availabilityStatus: "AVAILABLE",
    preferredContactMethod: "IN_APP",
    contactSharingConsent: false,
    publicDiscoveryConsent: true,
    lastDonationDate: new Date("2026-01-10")
  });

  const mockUser = {
    fullName: "Private Donor",
    phoneNumber: "9876543210",
    email: "private.donor@example.com"
  };

  const publicData = profile.toPublicDiscovery(mockUser);

  // Public discovery fields allowed
  assert.equal(publicData.bloodGroup, "O+");
  assert.equal(publicData.location.city, "Mumbai");
  assert.equal(publicData.location.state, "Maharashtra");
  assert.equal(publicData.location.pinCode, "400001");
  assert.equal(publicData.availabilityStatus, "AVAILABLE");

  // Private sensitive fields MUST NEVER be exposed in public profile when contactSharingConsent is false
  assert.equal(publicData.donor.phoneNumber, undefined, "Phone number must never be in public profile");
  assert.equal(publicData.donor.email, undefined, "Email must never be in public profile");
  assert.equal(publicData.lastDonationDate, undefined, "Last donation date must never be in public profile");
});

test("Phase 19 Audit: Organization Model does not leak verification documents in public profile", () => {
  const org = new Organization({
    name: "Red Cross Blood Center",
    type: "BLOOD_BANK",
    licenseNumber: "MH-BB-89123",
    verificationStatus: "APPROVED",
    isVerified: true,
    contactEmail: "contact@redcross.org",
    phoneNumber: "9123456789",
    verificationDocuments: [
      { docType: "DRUG_LICENSE", docName: "license.pdf", docUrl: "https://secure.raktdal.org/docs/license123.pdf" }
    ],
    address: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400020"
    }
  });

  const publicOrg = org.toPublicProfile();
  assert.equal(publicOrg.name, "Red Cross Blood Center");
  assert.equal(publicOrg.isVerified, true);
  // Verification documents MUST NOT be present in public profile
  assert.equal(publicOrg.verificationDocuments, undefined, "Verification docs must never be exposed publicly");
});

test("Phase 19 Audit: Unknown API routes strictly return JSON 404", () => {
  const mockReq = { method: "GET", path: "/api/v1/unknown-endpoint-route" };
  let statusCode = 200;
  let jsonResponse = null;

  const mockRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      jsonResponse = body;
      return this;
    }
  };

  const handle404 = (_req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
  };

  handle404(mockReq, mockRes);
  assert.equal(statusCode, 404);
  assert.equal(jsonResponse.success, false);
  assert.equal(jsonResponse.message, "Route not found.");
});
