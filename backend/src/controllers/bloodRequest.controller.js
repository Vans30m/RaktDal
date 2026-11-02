import crypto from "crypto";
import { BloodRequest } from "../models/BloodRequest.js";
import { Organization } from "../models/Organization.js";
import { eventDispatcher, DOMAIN_EVENTS } from "../services/eventDispatcher.service.js";

// In-memory rate limiting map for request creation: userId -> timestamp of last creation
const requestRateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 30 * 1000; // 30 seconds cooldown between creates

/**
 * Helper to generate human-readable request numbers (e.g., BR-2026-X8F2A)
 */
function generateRequestNumber() {
  const year = new Date().getFullYear();
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BR-${year}-${randomSuffix}`;
}

/**
 * 1. Create a Blood Request
 * POST /api/v1/requests
 */
export async function createBloodRequest(req, res) {
  try {
    const userId = req.user._id;

    // Rate Limiting Check
    const now = Date.now();
    const lastRequestAt = requestRateLimitMap.get(userId.toString()) || 0;
    if (now - lastRequestAt < RATE_LIMIT_WINDOW_MS) {
      const waitSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequestAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before creating another blood request.`
      });
    }

    const {
      requesterType = "INDIVIDUAL",
      organizationId,
      patientReference,
      bloodGroup,
      component = "WHOLE_BLOOD",
      unitsRequired,
      hospitalName,
      location,
      requiredBy,
      urgency = "STANDARD",
      description,
      supportingDocuments = [],
      isDemoRequest = false
    } = req.body || {};

    // Validate Required Fields
    if (!patientReference || typeof patientReference !== "string") {
      return res.status(400).json({ success: false, message: "Valid patient reference is required." });
    }
    if (!bloodGroup || !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodGroup)) {
      return res.status(400).json({ success: false, message: "Valid blood group is required." });
    }
    if (!unitsRequired || typeof unitsRequired !== "number" || unitsRequired < 1 || unitsRequired > 50) {
      return res.status(400).json({ success: false, message: "Units required must be an integer between 1 and 50." });
    }
    if (!hospitalName || typeof hospitalName !== "string") {
      return res.status(400).json({ success: false, message: "Hospital name is required." });
    }
    if (!location || !location.city || !location.district || !location.state || !location.pinCode) {
      return res.status(400).json({ success: false, message: "Complete location (city, district, state, pinCode) is required." });
    }
    if (!requiredBy || isNaN(new Date(requiredBy).getTime())) {
      return res.status(400).json({ success: false, message: "Valid deadline date (requiredBy) is required." });
    }

    const requiredDate = new Date(requiredBy);
    if (requiredDate <= new Date()) {
      return res.status(400).json({ success: false, message: "Required deadline must be in the future." });
    }

    // Default expiration: requiredBy deadline plus 24 hours, or 7 days max
    const expiresAt = new Date(Math.min(requiredDate.getTime() + 24 * 60 * 60 * 1000, Date.now() + 7 * 24 * 60 * 60 * 1000));

    let assignedOrgId = null;
    let initialVerificationStatus = "PENDING";
    let initialStatus = "PENDING_VERIFICATION";

    // Organizational Request Authorization
    if (requesterType === "ORGANIZATION") {
      if (!organizationId) {
        return res.status(400).json({ success: false, message: "organizationId is required for organizational requests." });
      }

      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ success: false, message: "Organization not found." });
      }

      // Check organization verification status
      if (!organization.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Unverified organizations cannot publish organizational blood requests.",
          error: { code: "UNVERIFIED_ORGANIZATION" }
        });
      }

      // Check if user is an authorized Organization ADMIN (or Platform ADMIN)
      const isOrgAdmin = organization.organizationAdmins?.some(adminId => adminId.toString() === userId.toString());
      if (!isOrgAdmin && !req.user.platformRoles.includes("ADMIN")) {
        return res.status(403).json({
          success: false,
          message: "You are not an authorized Organization ADMIN for this organization.",
          error: { code: "NOT_ORG_ADMIN" }
        });
      }

      assignedOrgId = organization._id;
      // Pre-verified organizations can be activated directly
      initialVerificationStatus = "APPROVED";
      initialStatus = "ACTIVE";
    }

    const requestNumber = generateRequestNumber();

    const bloodRequest = await BloodRequest.create({
      requestNumber,
      createdByUserId: userId,
      organizationId: assignedOrgId,
      requesterType,
      patientReference: patientReference.trim(),
      bloodGroup,
      component,
      unitsRequired: Math.floor(unitsRequired),
      unitsFulfilled: 0,
      hospitalName: hospitalName.trim(),
      location: {
        city: location.city.trim(),
        district: location.district.trim(),
        state: location.state.trim(),
        pinCode: location.pinCode.trim()
      },
      requiredBy: requiredDate,
      urgency,
      description: description ? description.trim() : "",
      supportingDocuments,
      status: initialStatus,
      verificationStatus: {
        status: initialVerificationStatus,
        reviewedBy: initialVerificationStatus === "APPROVED" ? userId : null,
        reviewedAt: initialVerificationStatus === "APPROVED" ? new Date() : null,
        history: [{
          action: "CREATED",
          performedBy: userId,
          timestamp: new Date(),
          note: `Request created with status ${initialStatus}`
        }]
      },
      expiresAt,
      isDemoRequest: Boolean(isDemoRequest)
    });

    requestRateLimitMap.set(userId.toString(), now);

    // Emit decoupled domain event
    await eventDispatcher.emit(DOMAIN_EVENTS.REQUEST_CREATED, {
      id: bloodRequest._id,
      requestNumber: bloodRequest.requestNumber,
      summary: `New ${bloodRequest.bloodGroup} request in ${bloodRequest.location.city}`
    });

    return res.status(201).json({
      success: true,
      message: initialStatus === "ACTIVE"
        ? "Organizational request published successfully."
        : "Blood request submitted successfully and is pending administrator review.",
      data: { request: bloodRequest.toPublicView() }
    });
  } catch (err) {
    console.error("createBloodRequest error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to create blood request." });
  }
}

/**
 * 2. Get Public Blood Requests (Discovery Feed)
 * GET /api/v1/requests
 */
export async function getBloodRequests(req, res) {
  try {
    const {
      city,
      pinCode,
      bloodGroup,
      component,
      urgency,
      status = "ACTIVE",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    const filter = {
      expiresAt: { $gt: new Date() }
    };

    // By default, public feeds only show ACTIVE or RESPONSES_RECEIVED requests
    if (status && ["ACTIVE", "RESPONSES_RECEIVED", "FULFILLED", "EXPIRED"].includes(status)) {
      filter.status = status;
    } else {
      filter.status = { $in: ["ACTIVE", "RESPONSES_RECEIVED"] };
    }

    if (city && typeof city === "string") {
      filter["location.city"] = new RegExp(`^${city.trim()}$`, "i");
    }
    if (pinCode && typeof pinCode === "string") {
      filter["location.pinCode"] = pinCode.trim();
    }
    if (bloodGroup && typeof bloodGroup === "string") {
      filter.bloodGroup = bloodGroup.toUpperCase();
    }
    if (component && typeof component === "string") {
      filter.component = component.toUpperCase();
    }
    if (urgency && typeof urgency === "string") {
      filter.urgency = urgency.toUpperCase();
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Allowlisted sort fields
    const allowedSortFields = ["createdAt", "requiredBy", "urgency", "unitsRequired"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const [requests, totalCount] = await Promise.all([
      BloodRequest.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      BloodRequest.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: {
        requests: requests.map(r => r.toPublicView()),
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      }
    });
  } catch (err) {
    console.error("getBloodRequests error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to retrieve blood requests." });
  }
}

/**
 * 3. Get Single Blood Request Details
 * GET /api/v1/requests/:requestId
 */
export async function getBloodRequestById(req, res) {
  try {
    const { requestId } = req.params;
    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: "Blood request not found." });
    }

    // Auto-update expired status if past deadline
    if (request.status === "ACTIVE" && new Date() > request.expiresAt) {
      request.status = "EXPIRED";
      await request.save();
    }

    const isCreator = req.user && request.createdByUserId.toString() === req.user._id.toString();
    const isPlatformAdmin = req.user && req.user.platformRoles.includes("ADMIN");

    // Full medical review details visible to requester or platform admin; public view for others
    if (isCreator || isPlatformAdmin) {
      return res.json({
        success: true,
        data: { request }
      });
    }

    return res.json({
      success: true,
      data: { request: request.toPublicView() }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching blood request." });
  }
}

/**
 * 4. Get Current User's Requests
 * GET /api/v1/requests/my
 */
export async function getMyBloodRequests(req, res) {
  try {
    const userId = req.user._id;

    const requests = await BloodRequest.find({ createdByUserId: userId })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: { requests }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch your blood requests." });
  }
}

/**
 * 5. Update Request Status (Fulfillment / Cancellation)
 * PATCH /api/v1/requests/:requestId/status
 */
export async function updateRequestStatus(req, res) {
  try {
    const { requestId } = req.params;
    const { status, note } = req.body || {};

    const validTransitions = ["FULFILLED", "CANCELLED"];
    if (!validTransitions.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status update. Allowed transitions: ${validTransitions.join(", ")}`
      });
    }

    const request = await BloodRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Blood request not found." });
    }

    const isCreator = request.createdByUserId.toString() === req.user._id.toString();
    const isPlatformAdmin = req.user.platformRoles.includes("ADMIN");

    if (!isCreator && !isPlatformAdmin) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this request.",
        error: { code: "NOT_RESOURCE_OWNER" }
      });
    }

    const oldStatus = request.status;
    request.status = status;
    request.verificationStatus.history.push({
      action: `STATUS_CHANGED_TO_${status}`,
      performedBy: req.user._id,
      timestamp: new Date(),
      note: note || `Status transitioned from ${oldStatus} to ${status}`
    });

    if (status === "FULFILLED") {
      request.unitsFulfilled = request.unitsRequired;
    }

    await request.save();

    await eventDispatcher.emit(DOMAIN_EVENTS.REQUEST_STATUS_CHANGED, {
      id: request._id,
      oldStatus,
      newStatus: status
    });

    return res.json({
      success: true,
      message: `Request status successfully updated to ${status}.`,
      data: { request: request.toPublicView() }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update request status." });
  }
}

/**
 * 6. Platform Admin Verification (Approval / Rejection)
 * PATCH /api/v1/requests/:requestId/verify
 */
export async function verifyBloodRequest(req, res) {
  try {
    const { requestId } = req.params;
    const { status, rejectionReason, note } = req.body || {};

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be either APPROVED or REJECTED." });
    }

    const request = await BloodRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Blood request not found." });
    }

    request.verificationStatus.status = status;
    request.verificationStatus.reviewedBy = req.user._id;
    request.verificationStatus.reviewedAt = new Date();

    if (status === "APPROVED") {
      request.status = "ACTIVE";
      request.verificationStatus.rejectionReason = null;
    } else {
      request.status = "REJECTED";
      request.verificationStatus.rejectionReason = rejectionReason || "Does not meet verification criteria";
    }

    request.verificationStatus.history.push({
      action: `ADMIN_${status}`,
      performedBy: req.user._id,
      timestamp: new Date(),
      note: note || `Request was ${status.toLowerCase()} by platform admin`
    });

    await request.save();

    await eventDispatcher.emit(
      status === "APPROVED" ? DOMAIN_EVENTS.REQUEST_APPROVED : DOMAIN_EVENTS.REQUEST_REJECTED,
      { id: request._id, status }
    );

    return res.json({
      success: true,
      message: `Blood request successfully ${status.toLowerCase()}.`,
      data: { request: request.toPublicView() }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to verify blood request." });
  }
}
