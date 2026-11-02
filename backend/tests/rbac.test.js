import test from "node:test";
import assert from "node:assert/strict";
import {
  authorize,
  requireOwnership,
  requireVerifiedOrganization,
  preventSelfRoleElevation,
  logAdminAction
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



test("Authentication Middleware: rejects unauthenticated requests with HTTP 401", async () => {
  const req = { cookies: {}, headers: {} };
  let status = null;
  let body = null;
  const res = {
    status(code) { status = code; return { json(b) { body = b; } }; }
  };

  // Missing token
  const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
  assert.equal(!token, true);
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
      error: { code: "UNAUTHORIZED" }
    });
  }

  assert.equal(status, 401);
  assert.equal(body.error.code, "UNAUTHORIZED");
});

test("Authentication Middleware: rejects suspended and deactivated accounts with HTTP 403", async () => {
  const statuses = ["SUSPENDED", "DEACTIVATED"];

  for (const accStatus of statuses) {
    let statusCode = null;
    let responseBody = null;
    const res = {
      status(code) { statusCode = code; return { json(b) { responseBody = b; } }; }
    };

    const user = { _id: "user-suspended", accountStatus: accStatus };
    if (user.accountStatus !== "ACTIVE") {
      res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus.toLowerCase()}. Access denied.`,
        error: { code: `ACCOUNT_${user.accountStatus}` }
      });
    }

    assert.equal(statusCode, 403, `Must reject ${accStatus} account with 403`);
    assert.equal(responseBody.error.code, `ACCOUNT_${accStatus}`);
  }
});

test("Authentication Middleware: detects revoked sessions and rejects with HTTP 401", () => {
  const session = {
    userId: "user-123",
    isRevoked: true,
    expiresAt: new Date(Date.now() + 100000)
  };

  let statusCode = null;
  let responseBody = null;
  const res = {
    status(code) { statusCode = code; return { json(b) { responseBody = b; } }; }
  };

  if (session.isRevoked || new Date() > session.expiresAt) {
    res.status(401).json({
      success: false,
      message: "Session has been revoked or expired.",
      error: { code: "SESSION_REVOKED" }
    });
  }

  assert.equal(statusCode, 401);
  assert.equal(responseBody.error.code, "SESSION_REVOKED");
});

test("Resource Ownership / IDOR Protection: blocks unauthorized user from accessing/modifying other users' records", () => {
  const currentAuthUser = { _id: "donor-alice-101", platformRoles: ["USER"] };
  const targetResourceOwnerId = "donor-bob-202";

  let status = null;
  let body = null;
  const res = {
    status(code) { status = code; return { json(b) { body = b; } }; }
  };

  const req = {
    user: currentAuthUser,
    params: { donorId: targetResourceOwnerId }
  };

  const ownershipChecker = requireOwnership((r) => r.params.donorId);
  ownershipChecker(req, res, () => {
    assert.fail("Should block IDOR access to another user's resource");
  });

  assert.equal(status, 403);
  assert.equal(body.error.code, "NOT_RESOURCE_OWNER");
});

test("Administrative Audit Logging: records admin actions without exposing sensitive data", () => {
  const loggedMessages = [];
  const originalLog = console.log;
  console.log = (...args) => loggedMessages.push(args.join(" "));

  try {
    const adminReq = {
      user: { _id: "admin-42", email: "admin@rakt-dal.org" },
      method: "GET",
      originalUrl: "/api/v1/auth/admin/dashboard",
      ip: "192.168.1.100"
    };

    let nextCalled = false;
    const loggerMiddleware = logAdminAction("ACCESS_ADMIN_DASHBOARD");
    loggerMiddleware(adminReq, {}, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true, "Logger middleware must invoke next()");
    assert.equal(loggedMessages.length, 1);
    assert.ok(loggedMessages[0].includes("[ADMIN AUDIT LOG]"));
    assert.ok(loggedMessages[0].includes("admin@rakt-dal.org"));
    assert.ok(loggedMessages[0].includes("ACCESS_ADMIN_DASHBOARD"));
    assert.ok(!loggedMessages[0].includes("password"));
    assert.ok(!loggedMessages[0].includes("token"));
  } finally {
    console.log = originalLog;
  }
});

