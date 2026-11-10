import { NotificationService } from "./notification.service.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import BloodRequest from "../models/BloodRequest.js";
import AuditLog from "../models/AuditLog.js";
import FraudAlert from "../models/FraudAlert.js";

/**
 * Service handling all administrative domain logic for platform ADMIN
 */
export class AdminService {
  /**
   * 1. Immutable Audit Logger Helper
   */
  static async recordAuditLog({
    actorUserId,
    actorEmail,
    action,
    entityType,
    entityId = null,
    reason = null,
    details = {},
    ipAddress = null,
    userAgent = null
  }) {
    try {
      return await AuditLog.create({
        actorUserId,
        actorEmail,
        action,
        entityType,
        entityId,
        reason,
        details,
        ipAddress,
        userAgent
      });
    } catch (err) {
      console.error("[AUDIT LOG ERROR] Failed to record audit log:", err.message);
      return null;
    }
  }

  /**
   * 2. Platform Overview Statistics
   */
  static async getPlatformStats() {
    const [
      totalUsers,
      totalDonors,
      totalOrganizations,
      pendingOrgVerifications,
      pendingBloodRequests,
      activeBloodRequests,
      totalBloodBanks,
      openFraudAlerts
    ] = await Promise.all([
      User.countDocuments(),
      // Count users who are active donors (registered or individual responders)
      User.countDocuments({ accountStatus: "ACTIVE" }),
      Organization.countDocuments(),
      Organization.countDocuments({ verificationStatus: "PENDING" }),
      BloodRequest.countDocuments({ status: "PENDING_VERIFICATION" }),
      BloodRequest.countDocuments({ status: { $in: ["ACTIVE", "RESPONSES_RECEIVED"] } }),
      Organization.countDocuments({ type: "BLOOD_BANK", verificationStatus: "APPROVED" }),
      FraudAlert.countDocuments({ status: "OPEN" })
    ]);

    // Query recent platform activity logs
    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return {
      overview: {
        totalUsers,
        totalDonors,
        totalOrganizations,
        pendingOrgVerifications,
        pendingBloodRequests,
        activeBloodRequests,
        totalBloodBanks,
        activeCamps: 0, // Graceful default until Camp module mounts
        pendingCampVerifications: 0,
        openFraudAlerts
      },
      recentActivity
    };
  }

  /**
   * 3. Organizations Review Queue with Pagination & Filtering
   */
  static async getOrganizations({
    status = "ALL",
    type = "ALL",
    search = "",
    page = 1,
    limit = 20
  }) {
    const query = {};

    if (status !== "ALL") {
      query.verificationStatus = status;
    }

    if (type !== "ALL") {
      query.type = type;
    }

    if (search && search.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: sanitized, $options: "i" } },
        { contactEmail: { $regex: sanitized, $options: "i" } },
        { "address.city": { $regex: sanitized, $options: "i" } }
      ];
    }

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (numericPage - 1) * numericLimit;

    const [items, total] = await Promise.all([
      Organization.find(query)
        .populate("organizationAdmins", "fullName email")
        .populate("reviewedBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      Organization.countDocuments(query)
    ]);

    return {
      items,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        totalPages: Math.ceil(total / numericLimit)
      }
    };
  }

  /**
   * 4. Verify / Moderate Organization (Approve or Reject)
   */
  static async verifyOrganization({
    orgId,
    decision,
    reason = null,
    adminUser,
    ipAddress = null,
    userAgent = null
  }) {
    if (!["APPROVED", "REJECTED"].includes(decision)) {
      throw new Error("Invalid verification decision. Must be APPROVED or REJECTED.");
    }

    if (decision === "REJECTED" && (!reason || !reason.trim())) {
      throw new Error("Rejection reason is mandatory when rejecting an organization.");
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      throw new Error("Organization not found.");
    }

    // Prevent unauthorized users from approving their own organization
    const isMemberAdmin = org.organizationAdmins?.some(
      adminId => adminId.toString() === adminUser._id.toString()
    );
    if (isMemberAdmin && !adminUser.platformRoles.includes("ADMIN")) {
      throw new Error("Conflict of interest: You cannot verify your own organization.");
    }

    const prevStatus = org.verificationStatus;

    org.verificationStatus = decision;
    org.isVerified = decision === "APPROVED";
    org.verifiedAt = decision === "APPROVED" ? new Date() : null;
    org.reviewedBy = adminUser._id;
    org.reviewedAt = new Date();
    org.rejectionReason = decision === "REJECTED" ? reason.trim() : null;

    await org.save();

    // Record immutable audit log
    await this.recordAuditLog({
      actorUserId: adminUser._id,
      actorEmail: adminUser.email,
      action: decision === "APPROVED" ? "ORG_VERIFICATION_APPROVED" : "ORG_VERIFICATION_REJECTED",
      entityType: "ORGANIZATION",
      entityId: org._id,
      reason: org.rejectionReason,
      details: {
        orgName: org.name,
        prevStatus,
        newStatus: decision
      },
      ipAddress,
      userAgent
    });

    return org;
  }

  /**
   * 5. User Directory & Account Status Management
   */
  static async getUsers({
    accountStatus = "ALL",
    role = "ALL",
    search = "",
    page = 1,
    limit = 20
  }) {
    const query = {};

    if (accountStatus !== "ALL") {
      query.accountStatus = accountStatus;
    }

    if (role !== "ALL") {
      query.platformRoles = role;
    }

    if (search && search.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { fullName: { $regex: sanitized, $options: "i" } },
        { email: { $regex: sanitized, $options: "i" } }
      ];
    }

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (numericPage - 1) * numericLimit;

    const [items, total] = await Promise.all([
      User.find(query)
        .select("-passwordHash -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      User.countDocuments(query)
    ]);

    return {
      items,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        totalPages: Math.ceil(total / numericLimit)
      }
    };
  }

  /**
   * 6. Suspend or Reactivate Account
   */
  static async updateUserAccountStatus({
    userId,
    status,
    reason,
    adminUser,
    ipAddress = null,
    userAgent = null
  }) {
    if (!["ACTIVE", "SUSPENDED", "DEACTIVATED"].includes(status)) {
      throw new Error("Invalid account status. Must be ACTIVE, SUSPENDED, or DEACTIVATED.");
    }

    if (status !== "ACTIVE" && (!reason || !reason.trim())) {
      throw new Error("A reason is required when suspending or deactivating an account.");
    }

    // Safety: Protect platform ADMIN accounts from accidental self-suspension
    if (userId && adminUser && userId.toString() === adminUser._id.toString()) {
      throw new Error("Safety check: You cannot suspend your own administrative account.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const prevStatus = user.accountStatus;
    user.accountStatus = status;
    await user.save();

    await this.recordAuditLog({
      actorUserId: adminUser._id,
      actorEmail: adminUser.email,
      action: status === "ACTIVE" ? "USER_REACTIVATED" : "USER_SUSPENDED",
      entityType: "USER",
      entityId: user._id,
      reason: reason ? reason.trim() : "Administrative status update",
      details: {
        targetUserEmail: user.email,
        prevStatus,
        newStatus: status
      },
      ipAddress,
      userAgent
    });

    return user.toPublicProfile();
  }

  /**
   * 7. Admin Blood Request Moderation View
   */
  static async getBloodRequests({
    status = "ALL",
    verificationStatus = "ALL",
    urgency = "ALL",
    search = "",
    page = 1,
    limit = 20
  }) {
    const query = {};

    if (status !== "ALL") {
      query.status = status;
    }

    if (verificationStatus !== "ALL") {
      query["verificationStatus.status"] = verificationStatus;
    }

    if (urgency !== "ALL") {
      query.urgency = urgency;
    }

    if (search && search.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { requestNumber: { $regex: sanitized, $options: "i" } },
        { hospitalName: { $regex: sanitized, $options: "i" } },
        { "location.city": { $regex: sanitized, $options: "i" } }
      ];
    }

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (numericPage - 1) * numericLimit;

    const [items, total] = await Promise.all([
      BloodRequest.find(query)
        .populate("createdByUserId", "fullName email")
        .populate("organizationId", "name type isVerified")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      BloodRequest.countDocuments(query)
    ]);

    return {
      items,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        totalPages: Math.ceil(total / numericLimit)
      }
    };
  }

  /**
   * 8. Fraud Alerts Management
   */
  static async getFraudAlerts({ status = "OPEN", page = 1, limit = 20 }) {
    const query = {};
    if (status !== "ALL") {
      query.status = status;
    }

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (numericPage - 1) * numericLimit;

    const [items, total] = await Promise.all([
      FraudAlert.find(query)
        .populate("resolvedBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      FraudAlert.countDocuments(query)
    ]);

    return {
      items,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        totalPages: Math.ceil(total / numericLimit)
      }
    };
  }

  static async resolveFraudAlert({
    alertId,
    status,
    note = "",
    adminUser,
    ipAddress = null,
    userAgent = null
  }) {
    if (!["INVESTIGATING", "RESOLVED", "DISMISSED"].includes(status)) {
      throw new Error("Invalid fraud alert status.");
    }

    const alert = await FraudAlert.findById(alertId);
    if (!alert) {
      throw new Error("Fraud alert not found.");
    }

    alert.status = status;
    alert.resolvedBy = adminUser._id;
    alert.resolvedAt = new Date();
    alert.resolutionNote = note ? note.trim() : null;
    await alert.save();

    await this.recordAuditLog({
      actorUserId: adminUser._id,
      actorEmail: adminUser.email,
      action: `FRAUD_ALERT_${status}`,
      entityType: "FRAUD_ALERT",
      entityId: alert._id,
      reason: alert.resolutionNote,
      details: { title: alert.title, status },
      ipAddress,
      userAgent
    });

    return alert;
  }

  /**
   * 9. Audit Logs View
   */
  static async getAuditLogs({ entityType = "ALL", action = "ALL", page = 1, limit = 30 }) {
    const query = {};
    if (entityType !== "ALL") query.entityType = entityType;
    if (action !== "ALL") query.action = action;

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 30));
    const skip = (numericPage - 1) * numericLimit;

    const [items, total] = await Promise.all([
      AuditLog.find(query)
        .populate("actorUserId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      AuditLog.countDocuments(query)
    ]);

    return {
      items,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        totalPages: Math.ceil(total / numericLimit)
      }
    };
  }
}

export default AdminService;
