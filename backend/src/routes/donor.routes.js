import { Router } from "express";
import {
  createDonorProfile,
  getMyDonorProfile,
  updateMyDonorProfile,
  updateMyAvailability,
  updateMyConsent,
  searchDonors
} from "../controllers/donor.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { verifyCsrf } from "../utils/security.js";

const router = Router();

// Public Donor Discovery Endpoint (No authentication required)
router.get("/search", searchDonors);

// Authenticated Donor Profile Endpoints
router.post("/profile", authenticate, verifyCsrf, createDonorProfile);
router.get("/me", authenticate, getMyDonorProfile);
router.patch("/me", authenticate, verifyCsrf, updateMyDonorProfile);
router.patch("/me/availability", authenticate, verifyCsrf, updateMyAvailability);
router.patch("/me/consent", authenticate, verifyCsrf, updateMyConsent);

export default router;

