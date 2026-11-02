import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import {
  DonorProfile,
  BLOOD_GROUPS,
  AVAILABILITY_STATUSES,
  PREFERRED_CONTACT_METHODS,
  PROFILE_STATUSES
} from "../src/models/DonorProfile.js";
import {
  createDonorProfile,
  getMyDonorProfile,
  updateMyDonorProfile,
  updateMyAvailability,
  updateMyConsent,
  searchDonors
} from "../src/controllers/donor.controller.js";

// Helper for mocking Express Response
function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };
  return res;
}

test("Phase 10: Donor Model Constants & Validation Constraints", () => {
  assert.equal(BLOOD_GROUPS.length, 8);
  assert.ok(BLOOD_GROUPS.includes("O+"));
  assert.ok(BLOOD_GROUPS.includes("AB-"));
  assert.deepEqual(AVAILABILITY_STATUSES, ["AVAILABLE", "UNAVAILABLE"]);
  assert.deepEqual(PREFERRED_CONTACT_METHODS, ["IN_APP", "EMAIL", "PHONE"]);
  assert.deepEqual(PROFILE_STATUSES, ["ACTIVE", "INACTIVE"]);
});

test("Phase 10: PIN Code Validation Logic", () => {
  const pinRegex = /^[1-9][0-9]{5}$/;
  assert.ok(pinRegex.test("411001"));
  assert.ok(pinRegex.test("110001"));
  assert.ok(!pinRegex.test("011001")); // Cannot start with 0
  assert.ok(!pinRegex.test("12345"));  // Too short
  assert.ok(!pinRegex.test("1234567")); // Too long
  assert.ok(!pinRegex.test("ABCDEF")); // Non-numeric
});

test("Phase 10: Donor Profile Creation Input Validation", async () => {
  const userId = new mongoose.Types.ObjectId();

  // Test 1: Invalid Blood Group
  const reqInvalidBg = {
    user: { _id: userId },
    body: {
      bloodGroup: "Z+",
      age: 25,
      location: { city: "Delhi", district: "New Delhi", state: "Delhi", pinCode: "110001" }
    }
  };
  const resInvalidBg = createMockRes();
  await createDonorProfile(reqInvalidBg, resInvalidBg);
  assert.equal(resInvalidBg.statusCode, 400);
  assert.ok(resInvalidBg.jsonData.message.includes("Invalid blood group"));

  // Test 2: Underage donor (< 18)
  const reqUnderage = {
    user: { _id: userId },
    body: {
      bloodGroup: "O+",
      age: 17,
      location: { city: "Delhi", district: "New Delhi", state: "Delhi", pinCode: "110001" }
    }
  };
  const resUnderage = createMockRes();
  await createDonorProfile(reqUnderage, resUnderage);
  assert.equal(resUnderage.statusCode, 400);
  assert.ok(resUnderage.jsonData.message.includes("between 18 and 65"));

  // Test 3: Overage donor (> 65)
  const reqOverage = {
    user: { _id: userId },
    body: {
      bloodGroup: "O+",
      age: 66,
      location: { city: "Delhi", district: "New Delhi", state: "Delhi", pinCode: "110001" }
    }
  };
  const resOverage = createMockRes();
  await createDonorProfile(reqOverage, resOverage);
  assert.equal(resOverage.statusCode, 400);
  assert.ok(resOverage.jsonData.message.includes("between 18 and 65"));

  // Test 4: Invalid PIN code format
  const reqInvalidPin = {
    user: { _id: userId },
    body: {
      bloodGroup: "A+",
      age: 28,
      location: { city: "Mumbai", district: "Mumbai", state: "Maharashtra", pinCode: "000123" }
    }
  };
  const resInvalidPin = createMockRes();
  await createDonorProfile(reqInvalidPin, resInvalidPin);
  assert.equal(resInvalidPin.statusCode, 400);
  assert.ok(resInvalidPin.jsonData.message.includes("PIN code"));
});

test("Phase 10: Availability Status Modification Validation", async () => {
  const userId = new mongoose.Types.ObjectId();
  const req = {
    user: { _id: userId },
    body: { availabilityStatus: "MAYBE" } // Invalid status
  };
  const res = createMockRes();
  await updateMyAvailability(req, res);
  assert.equal(res.statusCode, 400);
  assert.ok(res.jsonData.message.includes("availabilityStatus is required and must be either 'AVAILABLE' or 'UNAVAILABLE'"));
});

test("Phase 10: Consent Update Requirements", async () => {
  const userId = new mongoose.Types.ObjectId();
  const reqEmpty = {
    user: { _id: userId },
    body: {}
  };
  const resEmpty = createMockRes();
  await updateMyConsent(reqEmpty, resEmpty);
  assert.equal(resEmpty.statusCode, 400);
  assert.ok(resEmpty.jsonData.message.includes("At least one consent parameter"));
});

test("Phase 10: Public Search NoSQL Injection Defense & Parameter Validation", async () => {
  // Test invalid blood group query filter
  const reqBadBg = {
    query: { bloodGroup: { $ne: null } } // NoSQL object injection attempt
  };
  const resBadBg = createMockRes();
  await searchDonors(reqBadBg, resBadBg);
  assert.equal(resBadBg.statusCode, 400);
  assert.ok(resBadBg.jsonData.message.includes("Invalid blood group filter"));

  // Test invalid PIN code query filter
  const reqBadPin = {
    query: { pinCode: "123" }
  };
  const resBadPin = createMockRes();
  await searchDonors(reqBadPin, resBadPin);
  assert.equal(resBadPin.statusCode, 400);
  assert.ok(resBadPin.jsonData.message.includes("PIN code"));

  // Test invalid availability status query filter
  const reqBadAvail = {
    query: { availabilityStatus: "ALL" }
  };
  const resBadAvail = createMockRes();
  await searchDonors(reqBadAvail, resBadAvail);
  assert.equal(resBadAvail.statusCode, 400);
  assert.ok(resBadAvail.jsonData.message.includes("availabilityStatus filter must be one of"));
});

test("Phase 10: Public Privacy Sanitization Contract (toPublicDiscovery)", () => {
  const mockDonor = new DonorProfile({
    userId: new mongoose.Types.ObjectId(),
    bloodGroup: "B+",
    age: 30,
    location: {
      city: "Bengaluru",
      district: "Bengaluru Urban",
      state: "Karnataka",
      pinCode: "560001"
    },
    availabilityStatus: "AVAILABLE",
    lastDonationDate: new Date("2026-01-15"),
    preferredContactMethod: "EMAIL",
    contactSharingConsent: false, // User has NOT consented to share contact
    publicDiscoveryConsent: true,
    profileStatus: "ACTIVE"
  });

  const mockUser = {
    fullName: "Rohan Sharma",
    email: "rohan.private@example.com",
    phoneNumber: "+919876543210",
    profileImage: "https://example.com/rohan.jpg"
  };

  const publicData = mockDonor.toPublicDiscovery(mockUser);

  // 1. Core discovery data present
  assert.equal(publicData.bloodGroup, "B+");
  assert.equal(publicData.location.city, "Bengaluru");
  assert.equal(publicData.availabilityStatus, "AVAILABLE");
  assert.equal(publicData.donor.fullName, "Rohan Sharma");

  // 2. PRIVACY GUARANTEE: lastDonationDate is NEVER exposed publicly
  assert.equal(publicData.lastDonationDate, undefined);

  // 3. PRIVACY GUARANTEE: Email and phone are blocked when contactSharingConsent = false
  assert.equal(publicData.donor.email, undefined);
  assert.equal(publicData.donor.phoneNumber, undefined);

  // 4. When contactSharingConsent = true, only preferredContactMethod is exposed
  mockDonor.contactSharingConsent = true;
  mockDonor.preferredContactMethod = "EMAIL";
  const sharedEmailData = mockDonor.toPublicDiscovery(mockUser);
  assert.equal(sharedEmailData.donor.email, "rohan.private@example.com");
  assert.equal(sharedEmailData.donor.phoneNumber, undefined); // Phone remains hidden
});

test("Phase 10: Owner Profile Contract (toOwnerProfile)", () => {
  const donationDate = new Date("2026-02-10");
  const mockDonor = new DonorProfile({
    userId: new mongoose.Types.ObjectId(),
    bloodGroup: "O-",
    age: 42,
    location: {
      city: "Jaipur",
      district: "Jaipur",
      state: "Rajasthan",
      pinCode: "302001"
    },
    availabilityStatus: "UNAVAILABLE",
    lastDonationDate: donationDate,
    preferredContactMethod: "PHONE",
    notificationConsent: true,
    contactSharingConsent: false,
    publicDiscoveryConsent: false,
    profileStatus: "ACTIVE"
  });

  const ownerData = mockDonor.toOwnerProfile({
    fullName: "Priya Verma",
    email: "priya@example.com"
  });

  // Owner CAN see private fields like lastDonationDate and internal consent states
  assert.equal(ownerData.bloodGroup, "O-");
  assert.equal(ownerData.lastDonationDate.getTime(), donationDate.getTime());
  assert.equal(ownerData.notificationConsent, true);
  assert.equal(ownerData.contactSharingConsent, false);
  assert.equal(ownerData.publicDiscoveryConsent, false);
});

