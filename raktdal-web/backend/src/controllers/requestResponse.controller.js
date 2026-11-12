import { RequestResponse } from "../models/RequestResponse.js";
import { BloodRequest } from "../models/BloodRequest.js";
import { Organization } from "../models/Organization.js";
import { eventDispatcher, DOMAIN_EVENTS } from "../services/eventDispatcher.service.js";

/**
 * 1. Submit Donor or Organization Response to a Blood Request
 * POST /api/v1/requests/:requestId/responses
 */
export async function createResponse(req, res) {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const {
      responderType = "INDIVIDUAL_DONOR",
      organizationId,
      unitsOffered = 1,
      contactSharingConsent = false,
      notes,
      message
    } = req.body || {};

    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: "Blood request not found." });
    }

    // Only ACTIVE or RESPONSES_RECEIVED requests can accept responses
    if (!["ACTIVE", "RESPONSES_RECEIVED"].includes(bloodRequest.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot respond to a request with status ${bloodRequest.status}.`
      });
    }

    if (new Date() > bloodRequest.expiresAt) {
      bloodRequest.status = "EXPIRED";
      await bloodRequest.save();
      return res.status(400).json({ success: false, message: "This blood request has expired." });
    }

    // Prevent requester from responding to their own request
    if (bloodRequest.createdByUserId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot respond to your own blood request."
      });
    }

    let sharedContact = {};
    let assignedOrgId = null;

    if (responderType === "ORGANIZATION") {
      if (!organizationId) {
        return res.status(400).json({ success: false, message: "organizationId is required for organization responses." });
      }

      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ success: false, message: "Organization not found." });
      }

      if (!organization.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Unverified organizations cannot respond to requests.",
          error: { code: "UNVERIFIED_ORGANIZATION" }
        });
      }

      // Check if user is an authorized Organization ADMIN
      const isOrgAdmin = organization.organizationAdmins?.some(adminId => adminId.toString() === userId.toString());
      if (!isOrgAdmin && !req.user.platformRoles.includes("ADMIN")) {
        return res.status(403).json({
          success: false,
          message: "You are not an authorized Organization ADMIN for this organization.",
          error: { code: "NOT_ORG_ADMIN" }
        });
      }

      assignedOrgId = organization._id;
      sharedContact = {
        fullName: organization.name,
        phone: organization.phoneNumber || "",
        email: organization.contactEmail
      };
    } else {
      // Individual Donor Response: contact details shared only upon explicit consent
      if (contactSharingConsent) {
        sharedContact = {
          fullName: req.user.fullName,
          phone: req.user.phoneNumber || "",
          email: req.user.email
        };
      }
    }

    // Duplicate Check
    const existingFilter = responderType === "ORGANIZATION"
      ? { requestId: bloodRequest._id, organizationId: assignedOrgId, status: { $ne: "WITHDRAWN" } }
      : { requestId: bloodRequest._id, donorUserId: userId, status: { $ne: "WITHDRAWN" } };

    const existingResponse = await RequestResponse.findOne(existingFilter);
    if (existingResponse) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted an active response to this request."
      });
    }

    const responseRecord = await RequestResponse.create({
      requestId: bloodRequest._id,
      responderType,
      donorUserId: responderType === "INDIVIDUAL_DONOR" ? userId : null,
      organizationId: assignedOrgId,
      status: "ACCEPTED",
      unitsOffered: Math.max(1, parseInt(unitsOffered, 10) || 1),
      contactSharingConsent: Boolean(contactSharingConsent),
      sharedContactInfo: sharedContact,
      notes: (notes || message) ? String(notes || message).trim() : "",
      statusHistory: [{
        status: "ACCEPTED",
        timestamp: new Date(),
        reason: "Response submitted by responder"
      }]
    });

    // Update request status to RESPONSES_RECEIVED if currently ACTIVE
    if (bloodRequest.status === "ACTIVE") {
      bloodRequest.status = "RESPONSES_RECEIVED";
      await bloodRequest.save();
    }

    await eventDispatcher.emit(DOMAIN_EVENTS.RESPONSE_SUBMITTED, {
      requestId: bloodRequest._id,
      responseId: responseRecord._id,
      response: responseRecord,
      requesterUserId: bloodRequest.createdByUserId,
      bloodGroup: bloodRequest.bloodGroup,
      responderType
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your response has been submitted to the requester.",
      data: { response: responseRecord }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "A response from this donor/organization already exists." });
    }
    console.error("createResponse error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to submit response." });
  }
}

/**
 * 2. Get Responses for a Blood Request
 * GET /api/v1/requests/:requestId/responses
 */
export async function getRequestResponses(req, res) {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: "Blood request not found." });
    }

    const isCreator = bloodRequest.createdByUserId.toString() === userId.toString();
    const isPlatformAdmin = req.user.platformRoles.includes("ADMIN");

    if (isCreator || isPlatformAdmin) {
      const responses = await RequestResponse.find({ requestId: bloodRequest._id })
        .populate("donorUserId", "fullName profileImage")
        .populate("organizationId", "name contactEmail phoneNumber type")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: { responses }
      });
    }

    // Authenticated donor checking their own response to this request
    const myResponses = await RequestResponse.find({
      requestId: bloodRequest._id,
      donorUserId: userId
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: { responses: myResponses }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to retrieve responses." });
  }
}

/**
 * 2b. Get My Submitted Responses across all requests
 * GET /api/v1/responses/my
 */
export async function getMyResponses(req, res) {
  try {
    const userId = req.user._id;
    const responses = await RequestResponse.find({ donorUserId: userId })
      .populate("requestId")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: { responses }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to retrieve my responses." });
  }
}

/**
 * 3. Update Response Status (Withdraw / Decline)
 * PATCH /api/v1/responses/:responseId
 */
export async function updateResponseStatus(req, res) {
  try {
    const { responseId } = req.params;
    const { status, reason } = req.body || {};

    if (!["WITHDRAWN", "DECLINED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be WITHDRAWN or DECLINED." });
    }

    const response = await RequestResponse.findById(responseId);
    if (!response) {
      return res.status(404).json({ success: false, message: "Response record not found." });
    }

    const isDonorOwner = response.donorUserId && response.donorUserId.toString() === req.user._id.toString();
    const isPlatformAdmin = req.user.platformRoles.includes("ADMIN");

    let isAuthorizedOrgAdmin = false;
    if (response.organizationId) {
      const org = await Organization.findById(response.organizationId);
      isAuthorizedOrgAdmin = org?.organizationAdmins?.some(adminId => adminId.toString() === req.user._id.toString());
    }

    if (!isDonorOwner && !isAuthorizedOrgAdmin && !isPlatformAdmin) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to modify this response.",
        error: { code: "NOT_RESOURCE_OWNER" }
      });
    }

    response.status = status;
    response.statusHistory.push({
      status,
      timestamp: new Date(),
      reason: reason || `Response marked as ${status}`
    });

    await response.save();

    await eventDispatcher.emit(DOMAIN_EVENTS.RESPONSE_STATUS_CHANGED, {
      responseId: response._id,
      status
    });

    return res.json({
      success: true,
      message: `Response marked as ${status}.`,
      data: { response }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update response." });
  }
}
