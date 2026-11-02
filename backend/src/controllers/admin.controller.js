import { AdminService } from "../services/admin.service.js";

/**
 * Admin Controller for Platform Administration (Platform ADMIN only)
 */

export const getDashboardStats = async (req, res) => {
  try {
    const data = await AdminService.getPlatformStats();
    res.json({
      success: true,
      message: "Platform statistics retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrganizationsQueue = async (req, res) => {
  try {
    const { status, type, search, page, limit } = req.query;
    const data = await AdminService.getOrganizations({ status, type, search, page, limit });
    res.json({
      success: true,
      message: "Organizations queue retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

    res.json({
      success: true,
      message: `Organization ${status.toLowerCase()} successfully.`,
      data: updatedOrg
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getUsersDirectory = async (req, res) => {
  try {
    const { accountStatus, role, search, page, limit } = req.query;
    const data = await AdminService.getUsers({ accountStatus, role, search, page, limit });
    res.json({
      success: true,
      message: "Users directory retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

    res.json({
      success: true,
      message: `User account status updated to ${status}.`,
      data: updatedUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
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
    res.json({
      success: true,
      message: "Blood requests retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFraudAlerts = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const data = await AdminService.getFraudAlerts({ status, page, limit });
    res.json({
      success: true,
      message: "Fraud alerts retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

    res.json({
      success: true,
      message: "Fraud alert status updated successfully.",
      data: alert
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { entityType, action, page, limit } = req.query;
    const data = await AdminService.getAuditLogs({ entityType, action, page, limit });
    res.json({
      success: true,
      message: "Audit logs retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
