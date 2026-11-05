import { AdminService } from "../services/admin.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Admin Controller for Platform Administration (Platform ADMIN only)
 */

export const getDashboardStats = async (req, res) => {
  try {
    const data = await AdminService.getPlatformStats();
    return sendSuccess(res, { data }, "Platform statistics retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getOrganizationsQueue = async (req, res) => {
  try {
    const { status, type, search, page, limit } = req.query;
    const data = await AdminService.getOrganizations({ status, type, search, page, limit });
    return sendSuccess(res, { data }, "Organizations queue retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const verifyOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { status, reason } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.get("user-agent");

    const updatedOrg = await AdminService.verifyOrganization({
      orgId,
      decision: status,
      reason,
      adminUser: req.user,
      ipAddress,
      userAgent
    });

    return sendSuccess(res, { data: updatedOrg }, `Organization ${status.toLowerCase()} successfully.`);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const getUsersDirectory = async (req, res) => {
  try {
    const { accountStatus, role, search, page, limit } = req.query;
    const data = await AdminService.getUsers({ accountStatus, role, search, page, limit });
    return sendSuccess(res, { data }, "Users directory retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const updateUserAccountStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, reason } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.get("user-agent");

    const updatedUser = await AdminService.updateUserAccountStatus({
      userId,
      status,
      reason,
      adminUser: req.user,
      ipAddress,
      userAgent
    });

    return sendSuccess(res, { data: updatedUser }, `User account status updated to ${status}.`);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const getAdminBloodRequests = async (req, res) => {
  try {
    const { status, verificationStatus, urgency, search, page, limit } = req.query;
    const data = await AdminService.getBloodRequests({
      status,
      verificationStatus,
      urgency,
      search,
      page,
      limit
    });
    return sendSuccess(res, { data }, "Blood requests retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getFraudAlerts = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const data = await AdminService.getFraudAlerts({ status, page, limit });
    return sendSuccess(res, { data }, "Fraud alerts retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const resolveFraudAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, note } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.get("user-agent");

    const alert = await AdminService.resolveFraudAlert({
      alertId,
      status,
      note,
      adminUser: req.user,
      ipAddress,
      userAgent
    });

    return sendSuccess(res, { data: alert }, "Fraud alert status updated successfully.");
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { entityType, action, page, limit } = req.query;
    const data = await AdminService.getAuditLogs({ entityType, action, page, limit });
    return sendSuccess(res, { data }, "Audit logs retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
