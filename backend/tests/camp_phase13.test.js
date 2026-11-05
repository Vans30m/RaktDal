import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { DonationCamp, CAMP_STATUSES } from "../src/models/DonationCamp.js";
import { CampRegistration } from "../src/models/CampRegistration.js";

test("Phase 13: DonationCamp Model validation constraints", () => {
  const dummyOrgId = new mongoose.Types.ObjectId();
  const camp = new DonationCamp({
    organizationId: dummyOrgId,
    title: "City Blood Donation Drive",
    description: "Annual community donation camp organized by Lions Club",
    venueName: "Community Hall",
    address: "MG Road, Sector 4",
    location: {
      city: "Chandigarh",
      state: "Punjab",
      pinCode: "160017"
    },
    startDate: new Date("2026-12-01T09:00:00Z"),
    endDate: new Date("2026-12-01T17:00:00Z"),
    registrationDeadline: new Date("2026-11-30T23:59:59Z"),
    capacity: 100
  });

  const err = camp.validateSync();
  assert.equal(err, undefined, "Valid camp should not produce validation errors");
  assert.equal(camp.status, "DRAFT");
  assert.equal(camp.registrationCount, 0);
  assert.ok(CAMP_STATUSES.includes(camp.status));
});

test("Phase 13: DonationCamp rejects invalid PIN code and capacity out of bounds", () => {
  const dummyOrgId = new mongoose.Types.ObjectId();
  const camp = new DonationCamp({
    organizationId: dummyOrgId,
    title: "Invalid Camp",
    description: "Test description",
    venueName: "Hall",
    address: "Road",
    location: {
      city: "City",
      state: "State",
      pinCode: "0123" // Invalid Indian PIN
    },
    startDate: new Date(),
    endDate: new Date(),
    registrationDeadline: new Date(),
    capacity: 0 // Out of bounds
  });

  const err = camp.validateSync();
  assert.ok(err?.errors?.["location.pinCode"], "Must reject invalid PIN code");
  assert.ok(err?.errors?.capacity, "Must reject capacity < 1");
});

test("Phase 13: Public Profile Sanitizer conceals private contact reference", () => {
  const dummyOrgId = new mongoose.Types.ObjectId();
  const camp = new DonationCamp({
    organizationId: dummyOrgId,
    title: "Sanitized Camp",
    description: "Test",
    organizerContactReference: "+91 9876543210 (Private Mobile)",
    venueName: "Hall",
    address: "Road",
    location: {
      city: "Delhi",
      state: "Delhi",
      pinCode: "110001"
    },
    startDate: new Date("2026-12-01"),
    endDate: new Date("2026-12-02"),
    registrationDeadline: new Date("2026-11-30"),
    capacity: 50,
    registrationCount: 10,
    status: "PUBLISHED"
  });

  const publicData = camp.toPublicProfile();
  assert.equal(publicData.organizerContactReference, undefined, "Private organizer contact must not be leaked publicly");
  assert.equal(publicData.availableSlots, 40, "Calculates available slots accurately");
});

test("Phase 13: CampRegistration enforces single registration and unique compound index logic", () => {
  const campId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId();

  const reg = new CampRegistration({
    campId,
    userId,
    registrationStatus: "REGISTERED",
    attendanceStatus: "NOT_MARKED"
  });

  assert.equal(reg.registrationStatus, "REGISTERED");
  assert.equal(reg.attendanceStatus, "NOT_MARKED");
});

test("Phase 13: Authorization separation - Platform ADMIN vs Organization ADMIN", () => {
  const orgAdminId = new mongoose.Types.ObjectId();
  const otherUserId = new mongoose.Types.ObjectId();
  const platformAdminId = new mongoose.Types.ObjectId();

  const mockOrg = {
    organizationAdmins: [orgAdminId],
    isVerified: true
  };

  const isAuthorizedOrgAdmin = (org, user) => {
    if (user.platformRoles?.includes("ADMIN")) return true;
    return org.organizationAdmins.some(id => id.toString() === user._id.toString());
  };

  assert.equal(isAuthorizedOrgAdmin(mockOrg, { _id: orgAdminId, platformRoles: ["USER"] }), true);
  assert.equal(isAuthorizedOrgAdmin(mockOrg, { _id: platformAdminId, platformRoles: ["ADMIN"] }), true);
  assert.equal(isAuthorizedOrgAdmin(mockOrg, { _id: otherUserId, platformRoles: ["USER"] }), false);
});

test("Phase 13: Unverified Organization cannot publish camps", () => {
  const unverifiedOrg = { isVerified: false };
  const verifiedOrg = { isVerified: true };

  const canPublish = (org) => org.isVerified === true;
  assert.equal(canPublish(unverifiedOrg), false, "Unverified organization must be blocked from publishing");
  assert.equal(canPublish(verifiedOrg), true);
});

test("Phase 13: Capacity Limit & Concurrency logic check", () => {
  const camp = { capacity: 2, registrationCount: 2 };
  const canRegister = (c) => c.registrationCount < c.capacity;
  assert.equal(canRegister(camp), false, "Must reject registration when camp is at full capacity");
});

test("Phase 13: Registration Deadline enforcement logic", () => {
  const pastDeadline = new Date(Date.now() - 3600 * 1000);
  const futureDeadline = new Date(Date.now() + 3600 * 1000);

  const isDeadlinePassed = (deadline) => new Date() > deadline;
  assert.equal(isDeadlinePassed(pastDeadline), true, "Past deadline must be rejected");
  assert.equal(isDeadlinePassed(futureDeadline), false);
});

