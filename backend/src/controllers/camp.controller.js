import { CampService } from "../services/camp.service.js";
import { DonationCamp } from "../models/DonationCamp.js";
import { CampRegistration } from "../models/CampRegistration.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Public: Search published donation camps
 * GET /api/v1/camps
 */
export async function getCamps(req, res) {
  try {
    const { city, state, pinCode, status, startDate, page, limit } = req.query;
    const result = await CampService.searchPublishedCamps({
      city,
      state,
      pinCode,
      status,
      startDate,
      page,
      limit
    });
    return sendSuccess(res, result, "Donation camps retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Public: Get single camp details
 * GET /api/v1/camps/:campId
 */
export async function getCampDetails(req, res) {
  try {
    const { campId } = req.params;
    const camp = await CampService.getCampById(campId);
    if (!camp) {
      return sendError(res, "Donation camp not found.", 404);
    }
    return sendSuccess(res, { camp }, "Camp details retrieved.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Organization: Create camp draft
 * POST /api/v1/organizations/:organizationId/camps
 */
export async function createCamp(req, res) {
  try {
    const { organizationId } = req.params;
    const camp = await CampService.createCamp(organizationId, req.body, req.user._id);
    return sendSuccess(res, { camp }, "Donation camp created as draft.", 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
}

/**
 * Organization: Get camps belonging to organization
 * GET /api/v1/organizations/:organizationId/camps
 */
export async function getOrganizationCamps(req, res) {
  try {
    const { organizationId } = req.params;
    const camps = await DonationCamp.find({ organizationId }).sort({ startDate: -1 });
    return sendSuccess(res, { camps }, "Organization camps retrieved.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Organization: Publish camp
 * POST /api/v1/camps/:campId/publish
 */
export async function publishCamp(req, res) {
  try {
    const { campId } = req.params;
    const camp = await CampService.publishCamp(campId, req.user);
    return sendSuccess(res, { camp }, "Donation camp published successfully.");
  } catch (err) {
    return sendError(res, err.message, 400);
  }
}

/**
 * User: Register for camp
 * POST /api/v1/camps/:campId/register
 */
export async function registerForCamp(req, res) {
  try {
    const { campId } = req.params;
    const registration = await CampService.registerUserForCamp(campId, req.user._id);
    return sendSuccess(res, { registration }, "Registration for donation camp confirmed.", 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
}

/**
 * User: Cancel own registration
 * DELETE /api/v1/camps/:campId/register
 */
export async function cancelMyRegistration(req, res) {
  try {
    const { campId } = req.params;
    const { reason } = req.body || {};
    const registration = await CampService.cancelRegistration(campId, req.user._id, reason);
    return sendSuccess(res, { registration }, "Registration cancelled successfully.");
  } catch (err) {
    return sendError(res, err.message, 400);
  }
}

/**
 * User: Check own registration status
 * GET /api/v1/camps/:campId/registrations/me
 */
export async function getMyRegistration(req, res) {
  try {
    const { campId } = req.params;
    const registration = await CampRegistration.findOne({
      campId,
      userId: req.user._id
    });
    return sendSuccess(res, { registration }, "Registration status retrieved.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * User: Get list of camps user is registered for
 * GET /api/v1/camps/my-registrations
 */
export async function getMyRegistrationsList(req, res) {
  try {
    const registrations = await CampRegistration.find({
      userId: req.user._id,
      registrationStatus: "REGISTERED"
    })
      .populate("campId")
      .sort({ registeredAt: -1 });

    return sendSuccess(res, { registrations }, "User camp registrations retrieved.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Organization: View participant registrations
 * GET /api/v1/camps/:campId/registrations
 */
export async function getCampRegistrations(req, res) {
  try {
    const { campId } = req.params;
    const registrations = await CampRegistration.find({ campId })
      .populate("userId", "fullName email")
      .sort({ registeredAt: 1 });

    return sendSuccess(res, { registrations }, "Camp registrations retrieved.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Organization: Mark participant attendance
 * PATCH /api/v1/camps/:campId/registrations/:registrationId/attendance
 */
export async function markAttendance(req, res) {
  try {
    const { campId, registrationId } = req.params;
    const { status } = req.body;
    const registration = await CampService.markAttendance({
      campId,
      registrationId,
      status,
      organizerUser: req.user
    });
    return sendSuccess(res, { registration }, `Attendance marked as ${status}.`);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
}

/**
 * Organization: Submit camp report
 * POST /api/v1/camps/:campId/report
 */
export async function submitCampReport(req, res) {
  try {
    const { campId } = req.params;
    const camp = await CampService.submitCampReport(campId, req.body, req.user);
    return sendSuccess(res, { camp }, "Camp report submitted and camp marked as completed.");
  } catch (err) {
    return sendError(res, err.message, 400);
  }
}

