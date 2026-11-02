import mongoose from "mongoose";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import BloodRequest from "../models/BloodRequest.js";
import RequestResponse from "../models/RequestResponse.js";

/**
 * Service for Aggregating Platform, Organization, and Personal Reports
 */
export class ReportsService {
  /**
   * Helper: Parse and validate date filters
   */
  static parseDateFilter({ range = "30d", startDate = null, endDate = null }) {
    const now = new Date();
    let start = null;
    let end = new Date(now);

    if (range === "today") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "7d") {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "30d") {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "90d") {
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (range === "thisYear") {
      start = new Date(now.getFullYear(), 0, 1);
    } else if (range === "custom" && startDate) {
      start = new Date(startDate);
      if (endDate) {
        end = new Date(endDate);
      }
    } else {
      // Default fallback: 30 days
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    if (isNaN(start.getTime())) {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    if (isNaN(end.getTime())) {
      end = new Date(now);
    }

    return { start, end };
  }

  /**
   * Helper: Sanitize values for CSV to prevent Formula Injection (CWE-1236)
   */
  static sanitizeCsvField(val) {
    if (val === null || val === undefined) return "";
    let str = String(val).trim();
    // If field starts with =, +, -, @, \t, or \r prefix with single quote to neutralize
    if (/^[=+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }
    // Escape quotes
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      str = `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * 1. Platform Admin Reports: Executive Overview
   */
  static async getPlatformOverviewReports({ range = "30d", startDate = null, endDate = null, excludeDemo = true }) {
    const { start, end } = this.parseDateFilter({ range, startDate, endDate });

    const userMatch = { createdAt: { $gte: start, $lte: end } };
    const requestMatch = { createdAt: { $gte: start, $lte: end } };

    if (excludeDemo) {
      userMatch.isDemoAccount = { $ne: true };
      requestMatch.isDemoRequest = { $ne: true };
    }

    // Aggregations
    const [
      newUsersCount,
      totalUsersCount,
      requestsSummary,
      requestsByStatus,
      requestsByBloodGroup,
      requestsByComponent,
      timeSeriesRequests
    ] = await Promise.all([
      User.countDocuments(userMatch),
      User.countDocuments(excludeDemo ? { isDemoAccount: { $ne: true } } : {}),
      BloodRequest.aggregate([
        { $match: requestMatch },
        {
          $group: {
            _id: null,
            totalRequests: { $sum: 1 },
            totalUnitsRequired: { $sum: "$unitsRequired" },
            totalUnitsFulfilled: { $sum: "$unitsFulfilled" },
            fulfilledRequests: {
              $sum: { $cond: [{ $eq: ["$status", "FULFILLED"] }, 1, 0] }
            },
            activeRequests: {
              $sum: { $cond: [{ $in: ["$status", ["ACTIVE", "RESPONSES_RECEIVED"]] }, 1, 0] }
            },
            cancelledRequests: {
              $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] }
            },
            rejectedRequests: {
              $sum: { $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0] }
            },
            pendingVerificationRequests: {
              $sum: { $cond: [{ $eq: ["$status", "PENDING_VERIFICATION"] }, 1, 0] }
            }
          }
        }
      ]),
      BloodRequest.aggregate([
        { $match: requestMatch },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      BloodRequest.aggregate([
        { $match: requestMatch },
        { $group: { _id: "$bloodGroup", count: { $sum: 1 }, units: { $sum: "$unitsRequired" } } },
        { $sort: { _id: 1 } }
      ]),
      BloodRequest.aggregate([
        { $match: requestMatch },
        { $group: { _id: "$component", count: { $sum: 1 }, units: { $sum: "$unitsRequired" } } },
        { $sort: { _id: 1 } }
      ]),
      // Daily trend aggregation
      BloodRequest.aggregate([
        { $match: requestMatch },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            fulfilled: { $sum: { $cond: [{ $eq: ["$status", "FULFILLED"] }, 1, 0] } }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const reqStats = requestsSummary[0] || {
      totalRequests: 0,
      totalUnitsRequired: 0,
      totalUnitsFulfilled: 0,
      fulfilledRequests: 0,
      activeRequests: 0,
      cancelledRequests: 0,
      rejectedRequests: 0,
      pendingVerificationRequests: 0
    };

    // Calculate Fulfillment Rate (Fulfilled / Total Concluded or Total Valid Requests)
    const validRequestsDenominator = reqStats.totalRequests - reqStats.cancelledRequests;
    const fulfillmentRate = validRequestsDenominator > 0
      ? Number(((reqStats.fulfilledRequests / validRequestsDenominator) * 100).toFixed(1))
      : 0;

    return {
      dateRange: { range, start, end },
      kpis: {
        newUsers: newUsersCount,
        totalUsers: totalUsersCount,
        totalRequests: reqStats.totalRequests,
        fulfilledRequests: reqStats.fulfilledRequests,
        activeRequests: reqStats.activeRequests,
        pendingVerificationRequests: reqStats.pendingVerificationRequests,
        totalUnitsRequired: reqStats.totalUnitsRequired,
        totalUnitsFulfilled: reqStats.totalUnitsFulfilled,
        fulfillmentRate
      },
      requestsByStatus: requestsByStatus.map(s => ({ status: s._id, count: s.count })),
      requestsByBloodGroup: requestsByBloodGroup.map(g => ({ bloodGroup: g._id, count: g.count, units: g.units })),
      requestsByComponent: requestsByComponent.map(c => ({ component: c._id, count: c.count, units: c.units })),
      timeSeriesRequests: timeSeriesRequests.map(t => ({ date: t._id, count: t.count, fulfilled: t.fulfilled }))
    };
  }

  /**
   * 2. Platform Admin Reports: Detailed Blood Requests Analytics
   */
  static async getRequestsAnalytics({ range = "30d", urgency = "ALL", bloodGroup = "ALL", status = "ALL", page = 1, limit = 20, excludeDemo = true }) {
    const { start, end } = this.parseDateFilter({ range });
    const match = { createdAt: { $gte: start, $lte: end } };

    if (excludeDemo) match.isDemoRequest = { $ne: true };
    if (urgency !== "ALL") match.urgency = urgency;
    if (bloodGroup !== "ALL") match.bloodGroup = bloodGroup;
    if (status !== "ALL") match.status = status;

    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (numericPage - 1) * numericLimit;

    const [items, total] = await Promise.all([
      BloodRequest.find(match)
        .populate("createdByUserId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean(),
      BloodRequest.countDocuments(match)
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
   * 3. Organization Reports: Scoped to specific Organization ID
   */
  static async getOrganizationReports({ organizationId, range = "30d", adminUser }) {
    const org = await Organization.findById(organizationId);
    if (!org) {
      throw new Error("Organization not found.");
    }

    // Enforce authorization: Must be Platform ADMIN or in organizationAdmins
    const isPlatformAdmin = adminUser.platformRoles?.includes("ADMIN");
    const isOrgAdmin = org.organizationAdmins?.some(a => a.toString() === adminUser._id.toString());

    if (!isPlatformAdmin && !isOrgAdmin) {
      throw new Error("Access denied. You do not have permission to view reports for this organization.");
    }

    const { start, end } = this.parseDateFilter({ range });

    const requestMatch = {
      organizationId: org._id,
      createdAt: { $gte: start, $lte: end }
    };

    const responseMatch = {
      organizationId: org._id,
      createdAt: { $gte: start, $lte: end }
    };

    const [createdRequests, responseStats, statusBreakdown] = await Promise.all([
      BloodRequest.aggregate([
        { $match: requestMatch },
        {
          $group: {
            _id: null,
            totalCreated: { $sum: 1 },
            unitsRequired: { $sum: "$unitsRequired" },
            unitsFulfilled: { $sum: "$unitsFulfilled" },
            fulfilledCount: { $sum: { $cond: [{ $eq: ["$status", "FULFILLED"] }, 1, 0] } }
          }
        }
      ]),
      RequestResponse.aggregate([
        { $match: responseMatch },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            unitsOffered: { $sum: "$unitsOffered" }
          }
        }
      ]),
      BloodRequest.aggregate([
        { $match: requestMatch },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ])
    ]);

    const reqData = createdRequests[0] || { totalCreated: 0, unitsRequired: 0, unitsFulfilled: 0, fulfilledCount: 0 };

    return {
      organization: {
        id: org._id,
        name: org.name,
        type: org.type,
        isVerified: org.isVerified
      },
      dateRange: { range, start, end },
      requests: {
        totalCreated: reqData.totalCreated,
        unitsRequired: reqData.unitsRequired,
        unitsFulfilled: reqData.unitsFulfilled,
        fulfilledCount: reqData.fulfilledCount,
        statusBreakdown: statusBreakdown.map(s => ({ status: s._id, count: s.count }))
      },
      responses: responseStats.map(r => ({ status: r._id, count: r.count, unitsOffered: r.unitsOffered }))
    };
  }

  /**
   * 4. Personal Activity Reports: Authenticated User Activity
   */
  static async getPersonalReports({ userId, range = "90d" }) {
    const { start, end } = this.parseDateFilter({ range });

    const [requestsCreated, responsesSubmitted] = await Promise.all([
      BloodRequest.find({
        createdByUserId: userId,
        createdAt: { $gte: start, $lte: end }
      })
        .sort({ createdAt: -1 })
        .lean(),
      RequestResponse.find({
        donorUserId: userId,
        createdAt: { $gte: start, $lte: end }
      })
        .populate("requestId", "requestNumber hospitalName bloodGroup component status")
        .sort({ createdAt: -1 })
        .lean()
    ]);

    return {
      dateRange: { range, start, end },
      summary: {
        totalRequestsCreated: requestsCreated.length,
        totalDonationOffers: responsesSubmitted.length,
        fulfilledRequestsCreated: requestsCreated.filter(r => r.status === "FULFILLED").length
      },
      requests: requestsCreated.map(r => ({
        id: r._id,
        requestNumber: r.requestNumber,
        bloodGroup: r.bloodGroup,
        component: r.component,
        unitsRequired: r.unitsRequired,
        hospitalName: r.hospitalName,
        status: r.status,
        createdAt: r.createdAt
      })),
      responses: responsesSubmitted.map(resp => ({
        id: resp._id,
        requestNumber: resp.requestId?.requestNumber || "N/A",
        hospitalName: resp.requestId?.hospitalName || "N/A",
        bloodGroup: resp.requestId?.bloodGroup || "N/A",
        status: resp.status,
        unitsOffered: resp.unitsOffered,
        createdAt: resp.createdAt
      }))
    };
  }

  /**
   * 5. CSV Export Serializer with Anti-Formula Injection Neutralization
   */
  static generateCsv(headers, rows) {
    const headerLine = headers.map(h => this.sanitizeCsvField(h.label)).join(",");
    const dataLines = rows.map(row => {
      return headers.map(h => {
        const val = typeof h.key === "function" ? h.key(row) : row[h.key];
        return this.sanitizeCsvField(val);
      }).join(",");
    });

    return [headerLine, ...dataLines].join("\r\n");
  }
}

export default ReportsService;
