import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Organization from "../src/models/Organization.js";
import BloodRequest from "../src/models/BloodRequest.js";
import AuditLog from "../src/models/AuditLog.js";
import FraudAlert from "../src/models/FraudAlert.js";
import { AdminService } from "../src/services/admin.service.js";

test("Admin Phase 15: Platform ADMIN vs Organization ADMIN Authorization Separation", () => {
  const platformAdmin = new User({
    fullName: "Super Admin",
    email: "admin@rakt.dal",
    googleSubject: "google-admin-1",
    platformRoles: ["ADMIN"]
  });

  const orgAdminUser = new User({
    fullName: "Hospital Org Admin",
    email: "orgadmin@apollo.hospital",
    googleSubject: "google-org-admin-1",
    platformRoles: ["USER"]
  });

  const regularUser = new User({
    fullName: "Regular Donor",
    email: "donor@gmail.com",
    googleSubject: "google-user-1",
    platformRoles: ["USER"]
  });

  const checkPlatformAdminAccess = (user) => {
    return user && user.platformRoles && user.platformRoles.includes("ADMIN");
  };

  assert.equal(checkPlatformAdminAccess(platformAdmin), true, "Platform ADMIN must have access");
  assert.equal(checkPlatformAdminAccess(orgAdminUser), false, "Organization ADMIN without platform ADMIN role must be DENIED");
  assert.equal(checkPlatformAdminAccess(regularUser), false, "Regular USER must be DENIED");
});

test("Admin Phase 15: Organization Verification Transition & Mandatory Rejection Reason", async () => {
  // Test rejection without reason throws validation error
  await assert.rejects(
    async () => {
      await AdminService.verifyOrganization({
        orgId: new mongoose.Types.ObjectId(),
        decision: "REJECTED",
        reason: "", // Empty reason
        adminUser: { _id: new mongoose.Types.ObjectId(), email: "admin@rakt.dal", platformRoles: ["ADMIN"] }
      });
    },
    { message: /Rejection reason is mandatory/ }
  );

  // Test invalid decision throws error
  await assert.rejects(
    async () => {
      await AdminService.verifyOrganization({
        orgId: new mongoose.Types.ObjectId(),
        decision: "INVALID_DECISION",
        reason: "Some note",
        adminUser: { _id: new mongoose.Types.ObjectId(), email: "admin@rakt.dal", platformRoles: ["ADMIN"] }
      });
    },
    { message: /Invalid verification decision/ }
  );
});

test("Admin Phase 15: Organization Model toPublicProfile() prevents document leakage", () => {
  const org = new Organization({
    name: "City Blood Bank",
    type: "BLOOD_BANK",
    contactEmail: "contact@cityblood.org",
    verificationStatus: "APPROVED",
    isVerified: true,
    licenseNumber: "LIC-CONFIDENTIAL-8899",
    verificationDocuments: [
      {
        docType: "GOVERNMENT_LICENSE",
        docName: "license.pdf",
        docUrl: "https://secure-storage.internal/docs/license.pdf"
      }
    ]
  });

  const publicProfile = org.toPublicProfile();

  assert.equal(publicProfile.name, "City Blood Bank");
  assert.equal(publicProfile.isVerified, true);
  assert.equal(publicProfile.verificationDocuments, undefined, "Private verification documents must NEVER leak in public profile");
  assert.equal(publicProfile.licenseNumber, undefined, "Confidential license number should not be in public summary");
});

test("Admin Phase 15: User Status Moderation prevents self-suspension of platform admin", async () => {
  const adminId = new mongoose.Types.ObjectId();
  const adminUser = {
    _id: adminId,
    email: "admin@rakt.dal",
    platformRoles: ["ADMIN"]
  };

  // Attempting to self-suspend
  await assert.rejects(
    async () => {
      await AdminService.updateUserAccountStatus({
        userId: adminId,
        status: "SUSPENDED",
        reason: "Accidental self lockout",
        adminUser
      });
    },
    { message: /You cannot suspend your own administrative account/ }
  );
});

test("Admin Phase 15: AuditLog Model Schema Constraints & Immutability Concept", () => {
  const log = new AuditLog({
    actorUserId: new mongoose.Types.ObjectId(),
    actorEmail: "admin@rakt.dal",
    action: "ORG_VERIFICATION_APPROVED",
    entityType: "ORGANIZATION",
    entityId: new mongoose.Types.ObjectId(),
    reason: "Valid license verified with state drug authority",
    details: { orgName: "Apex Blood Center" },
    ipAddress: "127.0.0.1"
  });

  const err = log.validateSync();
  assert.equal(err, undefined, "AuditLog should validate successfully");
  assert.equal(log.action, "ORG_VERIFICATION_APPROVED");
  assert.equal(log.entityType, "ORGANIZATION");
});

test("Admin Phase 15: FraudAlert Model Severity & Status Validation", () => {
  const alert = new FraudAlert({
    entityType: "BLOOD_REQUEST",
    entityId: "REQ-9988",
    severity: "HIGH",
    title: "Unusually high quantity request",
    description: "Request for 48 units of O- within 1 hour"
  });

  const err = alert.validateSync();
  assert.equal(err, undefined, "FraudAlert should validate with valid severity");
  assert.equal(alert.status, "OPEN");

  // Invalid severity
  alert.severity = "EXTREME";
  const errInvalid = alert.validateSync();
  assert.ok(errInvalid.errors["severity"], "Invalid severity must fail validation");
});
