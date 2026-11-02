import { ReportsService } from "../services/reports.service.js";

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
    res.json({
      success: true,
      message: "Platform overview reports retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    res.json({
      success: true,
      message: "Requests analytics retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
      limit: 1000, // Controlled safe export limit
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
    res.status(200).send(csvData);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    res.json({
      success: true,
      message: "Organization reports retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
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
    res.json({
      success: true,
      message: "Personal activity report retrieved successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
