import { verifyAccessToken } from "../utils/security.js";
import { User } from "../models/User.js";
import { Organization } from "../models/Organization.js";
import { OrganizationMembership } from "../models/OrganizationMembership.js";

/**
 * 1. Authentication Middleware
 * Validates access token and attaches user information to req.user
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
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
        error: { code: "TOKEN_EXPIRED" }
      });
    }

    const user = await User.findById(decoded.id);

    if (!user || user.accountStatus !== "ACTIVE") {
      return res.status(401).json({
        success: false,
        message: "User account not found or suspended.",
        error: { code: "ACCOUNT_INACTIVE" }
      });
    }

    req.user = user;
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
 * 4. Organization Membership & Role Check Middleware
 * Verifies that the user belongs to the organization with one of the allowed org roles:
 * "OWNER", "ADMIN", "MANAGER", "STAFF"
 */
export function requireOrgRole(getOrgIdFromRequest, ...allowedOrgRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
          error: { code: "UNAUTHORIZED" }
        });
      }

      // Platform ADMIN can bypass organization membership checks
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

      const membership = await OrganizationMembership.findOne({
        organizationId: orgId,
        userId: req.user._id,
        status: "ACTIVE"
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You are not an active member of this organization.",
          error: { code: "NOT_ORG_MEMBER" }
        });
      }

      if (allowedOrgRoles.length > 0 && !allowedOrgRoles.includes(membership.orgRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Requires one of [${allowedOrgRoles.join(", ")}] roles in this organization.`,
          error: { code: "INSUFFICIENT_ORG_ROLE" }
        });
      }

      req.orgMembership = membership;
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error verifying organization membership.",
        error: { code: "INTERNAL_ERROR" }
      });
    }
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
