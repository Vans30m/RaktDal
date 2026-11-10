import express from "express";
import {
  authenticate,
  requireVerifiedOrganization,
  requireOrganizationAdmin
} from "../middleware/auth.middleware.js";
import {
  getCamps,
  getCampDetails,
  createCamp,
  getOrganizationCamps,
  publishCamp,
  registerForCamp,
  cancelMyRegistration,
  getMyRegistration,
  getMyRegistrationsList,
  getCampRegistrations,
  markAttendance,
  submitCampReport
} from "../controllers/camp.controller.js";

const router = express.Router();

// --- Public Discovery ---
router.get("/", getCamps);
router.get("/my-registrations", authenticate, getMyRegistrationsList);
router.get("/:campId", getCampDetails);

// --- User Camp Registrations ---
router.post("/:campId/register", authenticate, registerForCamp);
router.delete("/:campId/register", authenticate, cancelMyRegistration);
router.get("/:campId/registrations/me", authenticate, getMyRegistration);

// --- Organization Camp Management ---
router.post(
  "/organizations/:organizationId/camps",
  authenticate,
  requireOrganizationAdmin(req => req.params.organizationId),
  createCamp
);

router.get(
  "/organizations/:organizationId/camps",
  authenticate,
  requireOrganizationAdmin(req => req.params.organizationId),
  getOrganizationCamps
);

router.post("/:campId/publish", authenticate, publishCamp);
router.get("/:campId/registrations", authenticate, getCampRegistrations);
router.patch("/:campId/registrations/:registrationId/attendance", authenticate, markAttendance);
router.post("/:campId/report", authenticate, submitCampReport);

export default router;

