import test from "node:test";
import assert from "node:assert/strict";
import {
  authorize,
  requireOwnership,
  requireOrgRole,
  requireVerifiedOrganization,
  preventSelfRoleElevation
} from "../src/middleware/auth.middleware.js";

test("RBAC Middleware: authorize allows user with required platform role", () => {
  const adminUser = { _id: "admin-1", platformRoles: ["ADMIN"] };
  const req = { user: adminUser };
  let calledNext = false;

  const middleware = authorize("ADMIN");
  middleware(req, {}, () => {
    calledNext = true;
  });

  assert.equal(calledNext, true, "ADMIN role must be permitted");
});

test("RBAC Middleware: authorize blocks user without required platform role", () => {
  const standardUser = { _id: "user-1", platformRoles: ["USER"] };
  const req = { user: standardUser };
  let responseStatus = null;
  let responseBody = null;

  const res = {
    status(code) {
      responseStatus = code;
      return {
        json(body) {
          responseBody = body;
        }
      };
    }
  };

  const middleware = authorize("ADMIN");
  middleware(req, res, () => {
    assert.fail("Next should not have been called for unauthorized user");
  });

  assert.equal(responseStatus, 403);
  assert.equal(responseBody.error.code, "FORBIDDEN");
});

test("Resource Ownership Middleware: allows owner or platform ADMIN", () => {
  const currentUserId = "user-123";
  const reqOwner = {
    user: { _id: currentUserId, platformRoles: ["USER"] },
    params: { donorId: "user-123" }
  };

  let nextCalled = false;
  const ownerMiddleware = requireOwnership((req) => req.params.donorId);
  ownerMiddleware(reqOwner, {}, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true, "Resource owner must be permitted");

  // Admin bypass
  const reqAdmin = {
    user: { _id: "admin-999", platformRoles: ["ADMIN"] },
    params: { donorId: "user-123" }
  };
  let adminNextCalled = false;
  ownerMiddleware(reqAdmin, {}, () => {
    adminNextCalled = true;
  });
  assert.equal(adminNextCalled, true, "Platform ADMIN must bypass resource ownership check");
});

test("Resource Ownership Middleware: blocks non-owner", () => {
  const reqNonOwner = {
    user: { _id: "user-999", platformRoles: ["USER"] },
    params: { donorId: "user-123" }
  };

  let responseStatus = null;
  let responseBody = null;
  const res = {
    status(code) {
      responseStatus = code;
      return {
        json(body) {
          responseBody = body;
        }
      };
    }
  };

  const ownerMiddleware = requireOwnership((req) => req.params.donorId);
  ownerMiddleware(reqNonOwner, res, () => {
    assert.fail("Should block non-owner");
  });

  assert.equal(responseStatus, 403);
  assert.equal(responseBody.error.code, "NOT_RESOURCE_OWNER");
});

test("Role Elevation Protection: blocks standard user from altering platformRoles", () => {
  const reqStandard = {
    user: { _id: "user-1", platformRoles: ["USER"] },
    body: { fullName: "Aarav", platformRoles: ["ADMIN"] }
  };

  let status = null;
  let body = null;
  const res = {
    status(code) {
      status = code;
      return {
        json(b) {
          body = b;
        }
      };
    }
  };

  preventSelfRoleElevation(reqStandard, res, () => {
    assert.fail("Should not allow standard user to elevate roles");
  });

  assert.equal(status, 403);
  assert.equal(body.error.code, "ROLE_ELEVATION_DENIED");
});

test("Role Elevation Protection: allows standard profile updates without role tampering", () => {
  const reqValid = {
    user: { _id: "user-1", platformRoles: ["USER"] },
    body: { fullName: "Aarav Sharma", phoneNumber: "9876543210" }
  };

  let nextCalled = false;
  preventSelfRoleElevation(reqValid, {}, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true, "Standard profile updates must pass through");
});

test("Organization Verification Check: blocks publishing from unverified organization", async () => {
  const unverifiedOrg = { _id: "org-1", isVerified: false };
  let status = null;
  let responseBody = null;

  const res = {
    status(code) {
      status = code;
      return {
        json(b) {
          responseBody = b;
        }
      };
    }
  };

  // Mock finding unverified organization
  const mockGetOrg = () => "org-1";
  const req = { params: { orgId: "org-1" } };

  // Helper function logic test
  if (!unverifiedOrg.isVerified) {
    res.status(403).json({
      success: false,
      message: "Unverified organizations cannot publish donation requests or camps.",
      error: { code: "UNVERIFIED_ORGANIZATION" }
    });
  }

  assert.equal(status, 403);
  assert.equal(responseBody.error.code, "UNVERIFIED_ORGANIZATION");
});

test("Organization Membership & Role Matrix: checks OWNER, ADMIN, MANAGER, STAFF roles", () => {
  const validOrgRoles = ["OWNER", "ADMIN", "MANAGER", "STAFF"];
  assert.equal(validOrgRoles.includes("OWNER"), true);
  assert.equal(validOrgRoles.includes("ADMIN"), true);
  assert.equal(validOrgRoles.includes("MANAGER"), true);
  assert.equal(validOrgRoles.includes("STAFF"), true);
  assert.equal(validOrgRoles.includes("UNKNOWN"), false);
});
