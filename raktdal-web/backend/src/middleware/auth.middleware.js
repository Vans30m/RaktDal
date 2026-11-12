import { verifyAccessToken, hashToken } from "../utils/security.js";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import { Organization } from "../models/Organization.js";

/**
 * 1. Authentication Middleware
 * Validates access token, checks session revocation & account status, and attaches req.user and req.session
 */
export async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        error: { code: "UNAUTHORIZED" }
      });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
        error: { code: "TOKEN_EXPIRED" }
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
        error: { code: "USER_NOT_FOUND" }
      });
    }

    // Check account status: ACTIVE vs SUSPENDED vs DEACTIVATED
    if (user.accountStatus !== "ACTIVE") {
      // Security measure: Revoke any active sessions when an account is suspended or deactivated
      await Session.updateMany({ userId: user._id, isRevoked: false }, { isRevoked: true });

      return res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus.toLowerCase()}. Access denied.`,
        error: { code: `ACCOUNT_${user.accountStatus}` }
      });
    }

    // Check session validity if refresh token cookie is present
    const rawRefreshToken = req.cookies?.refreshToken;
    let currentSession = null;
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      currentSession = await Session.findOne({ refreshTokenHash: tokenHash, userId: user._id });

      if (currentSession && (currentSession.isRevoked || new Date() > currentSession.expiresAt)) {
        return res.status(401).json({
          success: false,
          message: "Session has been revoked or expired.",
          error: { code: "SESSION_REVOKED" }
        });
      }
    }

    req.user = user;
    req.session = currentSession || { userId: user._id };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication session.",
      error: { code: "AUTH_ERROR" }
    });
  }
}

/**
 * Optional Authentication Middleware
 * Attaches req.user if a valid session exists, but allows unauthenticated requests to proceed.
 */
export async function optionalAuthenticate(req, res, next) {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return next();
    }
    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.id) {
      return next();
    }
    const user = await User.findById(decoded.id);
    if (!user || user.accountStatus !== "ACTIVE") {
      return next();
    }
    req.user = user;
    next();
  } catch (_err) {
    next();
  }
}

/**
 * 2. Platform Role Authorization Middleware
 * Authorizes based on platform roles: "USER", "ADMIN"
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        error: { code: "UNAUTHORIZED" }
      });
    }

    const hasRole = req.user.platformRoles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient platform permissions.",
        error: { code: "FORBIDDEN" }
      });
    }

    next();
  };
}

/**
 * 3. Resource Ownership Middleware
 * Ensures the authenticated user owns the resource or is a platform ADMIN
 */
export function requireOwnership(getOwnerIdFromRequest) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        error: { code: "UNAUTHORIZED" }
      });
    }

    // Platform ADMIN can bypass resource ownership checks
    if (req.user.platformRoles.includes("ADMIN")) {
      return next();
    }

    const targetOwnerId = getOwnerIdFromRequest(req);
    const currentUserId = req.user._id.toString();

    if (!targetOwnerId || targetOwnerId.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not own this resource.",
        error: { code: "NOT_RESOURCE_OWNER" }
      });
    }

    next();
  };
}



/**
 * 5. Verified Organization Check Middleware
 * Ensures unverified organizations cannot publish requests or donation camps
 */
export function requireVerifiedOrganization(getOrgIdFromRequest) {
  return async (req, res, next) => {
    try {
      const orgId = getOrgIdFromRequest(req);
      if (!orgId) {
        return res.status(400).json({
          success: false,
          message: "Organization ID is required.",
          error: { code: "ORG_ID_REQUIRED" }
        });
      }

      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: "Organization not found.",
          error: { code: "ORG_NOT_FOUND" }
        });
      }

      if (!organization.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Unverified organizations cannot publish donation requests or camps.",
          error: { code: "UNVERIFIED_ORGANIZATION" }
        });
      }

      req.organization = organization;
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error verifying organization status.",
        error: { code: "INTERNAL_ERROR" }
      });
    }
  };
}

/**
 * 6. Organization Admin Authorization Middleware
 * Verifies that the authenticated user is an authorized Organization ADMIN for the target organization.
 * (Platform ADMIN can also administer or moderate organization resources).
 */
export function requireOrganizationAdmin(getOrgIdFromRequest) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
          error: { code: "UNAUTHORIZED" }
        });
      }

      // Platform ADMIN has global oversight
      if (req.user.platformRoles.includes("ADMIN")) {
        return next();
      }

      const orgId = getOrgIdFromRequest(req);
      if (!orgId) {
        return res.status(400).json({
          success: false,
          message: "Organization ID is required.",
          error: { code: "ORG_ID_REQUIRED" }
        });
      }

      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: "Organization not found.",
          error: { code: "ORG_NOT_FOUND" }
        });
      }

      const isOrgAdmin = organization.organizationAdmins?.some(
        adminId => adminId.toString() === req.user._id.toString()
      );

      if (!isOrgAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You are not an authorized Organization ADMIN.",
          error: { code: "NOT_ORG_ADMIN" }
        });
      }

      req.organization = organization;
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error verifying organization administrator authorization.",
        error: { code: "INTERNAL_ERROR" }
      });
    }
  };
}

/**
 * 6. Prevent Self Role Elevation Middleware
 * Prevents users from changing their own platform roles in update requests
 */
export function preventSelfRoleElevation(req, res, next) {
  if (req.body && (req.body.platformRoles !== undefined || req.body.roles !== undefined)) {
    // Only platform ADMIN can assign or change roles
    if (!req.user || !req.user.platformRoles.includes("ADMIN")) {
      return res.status(403).json({
        success: false,
        message: "You cannot modify your own or other users' platform roles.",
        error: { code: "ROLE_ELEVATION_DENIED" }
      });
    }
  }
  next();
}

/**
 * 7. Administrative Audit Logging Middleware
 * Securely logs sensitive administrative control actions without exposing tokens or passwords
 */
export function logAdminAction(actionName) {
  return (req, res, next) => {
    const adminEmail = req.user?.email || "Unknown Admin";
    const adminId = req.user?._id || "Unknown ID";
    const ip = req.ip || req.connection?.remoteAddress || "Unknown IP";
    const timestamp = new Date().toISOString();

    console.log(
      `[ADMIN AUDIT LOG] ${timestamp} | Admin: ${adminEmail} (${adminId}) | Action: ${actionName} | Route: ${req.method} ${req.originalUrl} | IP: ${ip}`
    );

    next();
  };
}
