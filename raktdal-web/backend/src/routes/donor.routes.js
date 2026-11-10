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
import { Organization } from "../models/Organization.js";
import { CampService } from "../services/camp.service.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const searchLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: "Too many search requests. Please slow down.",
  prefix: "search"
});

const router = Router();

// Public Donor Discovery Endpoint (No authentication required)
router.get("/search", searchLimiter, searchDonors);

// Authenticated Donor Profile Endpoints
router.post("/profile", authenticate, verifyCsrf, createDonorProfile);
router.get("/me", authenticate, getMyDonorProfile);
router.patch("/me", authenticate, verifyCsrf, updateMyDonorProfile);
router.patch("/me/availability", authenticate, verifyCsrf, updateMyAvailability);
router.patch("/me/consent", authenticate, verifyCsrf, updateMyConsent);

// Direct In-App Alert to a Volunteer Donor
router.post("/:donorProfileId/alert", authenticate, verifyCsrf, async (req, res) => {
  try {
    const { donorProfileId } = req.params;
    const { hospitalName, city, bloodGroup, message, contactNumber } = req.body || {};
    const requester = req.user;

    const { DonorProfile } = await import("../models/DonorProfile.js");
    const { NotificationService } = await import("../services/notification.service.js");

    const profile = await DonorProfile.findById(donorProfileId).populate("userId", "fullName email");
    if (!profile || !profile.userId) {
      return res.status(404).json({ success: false, message: "Donor profile not found." });
    }

    if (String(profile.userId._id) === String(requester._id)) {
      return res.status(400).json({ success: false, message: "You cannot send an emergency donation alert to yourself." });
    }

    const alertTitle = `🚨 Urgent Blood Requirement: ${bloodGroup || profile.bloodGroup}`;
    const alertMessage = `${requester.fullName} has requested blood donation at ${hospitalName || "local hospital"} (${city || profile.location.city}). Contact: ${contactNumber || requester.phoneNumber || requester.email}. Note: ${message || "Immediate transfusion needed."}`;

    await NotificationService.notifyUser({
      userId: profile.userId._id,
      type: "REQUEST_CREATED",
      title: alertTitle,
      message: alertMessage,
      priority: "URGENT",
      relatedEntityType: "User",
      relatedEntityId: requester._id,
      metadata: {
        requesterName: requester.fullName,
        requesterContact: contactNumber || requester.phoneNumber || requester.email,
        hospitalName,
        bloodGroup: bloodGroup || profile.bloodGroup,
        city: city || profile.location.city
      }
    });

    return res.json({
      success: true,
      message: `In-app alert successfully sent to ${profile.userId.fullName}!`
    });
  } catch (err) {
    console.error("Donor alert error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to send in-app alert to donor." });
  }
});

// Public Blood Bank Directory & Donation Camps Endpoints
router.get("/directory/blood-banks", searchLimiter, async (req, res) => {
  try {
    const { city, state, search, page = 1, limit = 12 } = req.query;
    const query = {
      type: "BLOOD_BANK",
      isVerified: true,
      verificationStatus: "APPROVED"
    };

    if (city && typeof city === "string") {
      query["address.city"] = new RegExp(`^${city.trim()}$`, "i");
    }
    if (state && typeof state === "string") {
      query["address.state"] = new RegExp(`^${state.trim()}$`, "i");
    }
    if (search && typeof search === "string" && search.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: sanitized, $options: "i" } },
        { "address.city": { $regex: sanitized, $options: "i" } },
        { "address.state": { $regex: sanitized, $options: "i" } },
        { licenseNumber: { $regex: sanitized, $options: "i" } }
      ];
    }

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    const [banks, total] = await Promise.all([
      Organization.find(query)
        .sort({ name: 1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      Organization.countDocuments(query)
    ]);

    const sanitizedBanks = banks.map((b) => b.toPublicProfile());

    res.json({
      success: true,
      message: "Blood banks fetched successfully.",
      data: {
        bloodBanks: sanitizedBanks,
        pagination: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Failed to fetch blood banks." });
  }
});

router.get("/directory/camps", searchLimiter, async (req, res) => {
  try {
    const { city, state, pinCode, status, page, limit } = req.query;
    const result = await CampService.searchPublishedCamps({
      city,
      state,
      pinCode,
      status: status || "PUBLISHED",
      page,
      limit: limit || 12
    });

    res.json({
      success: true,
      message: "Donation camps fetched successfully.",
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Failed to fetch camps." });
  }
});

export default router;
