import { ReportsService } from "../services/reports.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Controller for Administrative, Organization, and Personal Reports
 */

// --- Admin Platform Analytics ---

export const getAdminOverviewReport = async (req, res) => {
  try {
    const { range, startDate, endDate, excludeDemo } = req.query;
    const data = await ReportsService.getPlatformOverviewReports({
      range,
      startDate,
      endDate,
      excludeDemo: excludeDemo !== "false"
    });
    return sendSuccess(res, { data }, "Platform overview reports retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const getAdminRequestsReport = async (req, res) => {
  try {
    const { range, urgency, bloodGroup, status, page, limit, excludeDemo } = req.query;
    const data = await ReportsService.getRequestsAnalytics({
      range,
      urgency,
      bloodGroup,
      status,
      page,
      limit,
      excludeDemo: excludeDemo !== "false"
    });
    return sendSuccess(res, { data }, "Requests analytics retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

export const exportAdminRequestsCsv = async (req, res) => {
  try {
    const { range, urgency, bloodGroup, status, excludeDemo } = req.query;
    const { items } = await ReportsService.getRequestsAnalytics({
      range,
      urgency,
      bloodGroup,
      status,
      page: 1,
      limit: 1000,
      excludeDemo: excludeDemo !== "false"
    });

    const headers = [
      { label: "Request Number", key: "requestNumber" },
      { label: "Blood Group", key: "bloodGroup" },
      { label: "Component", key: "component" },
      { label: "Units Required", key: "unitsRequired" },
      { label: "Units Fulfilled", key: "unitsFulfilled" },
      { label: "Hospital Name", key: "hospitalName" },
      { label: "City", key: (r) => r.location?.city || "N/A" },
      { label: "State", key: (r) => r.location?.state || "N/A" },
      { label: "Urgency", key: "urgency" },
      { label: "Status", key: "status" },
      { label: "Created Date", key: (r) => new Date(r.createdAt).toISOString().split("T")[0] }
    ];

    const csvData = ReportsService.generateCsv(headers, items);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="raktdal_requests_report_${Date.now()}.csv"`
    );
    return res.status(200).send(csvData);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// --- Organization Scoped Reports ---

export const getOrganizationReports = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { range } = req.query;
    const data = await ReportsService.getOrganizationReports({
      organizationId,
      range,
      adminUser: req.user
    });
    return sendSuccess(res, { data }, "Organization reports retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 403);
  }
};

// --- Personal Activity Reports ---

export const getPersonalReports = async (req, res) => {
  try {
    const { range } = req.query;
    const data = await ReportsService.getPersonalReports({
      userId: req.user._id,
      range
    });
    return sendSuccess(res, { data }, "Personal activity report retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
