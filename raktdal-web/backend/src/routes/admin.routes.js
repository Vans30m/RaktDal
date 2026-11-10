import { Router } from "express";
import {
  getDashboardStats,
  getOrganizationsQueue,
  verifyOrganization,
  getUsersDirectory,
  updateUserAccountStatus,
  getAdminBloodRequests,
  getFraudAlerts,
  resolveFraudAlert,
  getAuditLogs
} from "../controllers/admin.controller.js";
import { authenticate, authorize, logAdminAction } from "../middleware/auth.middleware.js";
import { verifyCsrf } from "../utils/security.js";

const router = Router();

// Strictly enforce platform ADMIN authentication on all admin endpoints
router.use(authenticate);
router.use(authorize("ADMIN"));

// 1. Dashboard Overview Stats & Recent Activity
router.get("/stats", logAdminAction("VIEW_ADMIN_STATS"), getDashboardStats);

// 2. Organization Verification Queue & Moderation
router.get("/organizations", logAdminAction("VIEW_ORGANIZATIONS_QUEUE"), getOrganizationsQueue);
router.patch("/organizations/:orgId/verify", verifyCsrf, logAdminAction("VERIFY_ORGANIZATION"), verifyOrganization);

// 3. User Management & Account Suspension
router.get("/users", logAdminAction("VIEW_USERS_DIRECTORY"), getUsersDirectory);
router.patch("/users/:userId/status", verifyCsrf, logAdminAction("UPDATE_USER_STATUS"), updateUserAccountStatus);

// 4. Blood Request Moderation View
router.get("/requests", logAdminAction("VIEW_ADMIN_BLOOD_REQUESTS"), getAdminBloodRequests);

// 5. Fraud Flags & Suspicious Activity
router.get("/fraud-alerts", logAdminAction("VIEW_FRAUD_ALERTS"), getFraudAlerts);
router.patch("/fraud-alerts/:alertId", verifyCsrf, logAdminAction("RESOLVE_FRAUD_ALERT"), resolveFraudAlert);

// 6. Immutable Audit Logs
router.get("/audit-logs", logAdminAction("VIEW_AUDIT_LOGS"), getAuditLogs);

// 7. Platform Reports & Analytics (Phase 16)
import {
  getAdminOverviewReport,
  getAdminRequestsReport,
  exportAdminRequestsCsv
} from "../controllers/reports.controller.js";

router.get("/reports/overview", logAdminAction("VIEW_ANALYTICS_OVERVIEW"), getAdminOverviewReport);
router.get("/reports/requests", logAdminAction("VIEW_ANALYTICS_REQUESTS"), getAdminRequestsReport);
router.get("/reports/export", logAdminAction("EXPORT_ANALYTICS_CSV"), exportAdminRequestsCsv);

export default router;
