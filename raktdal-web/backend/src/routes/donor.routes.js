import { Router } from "express";
import {
  createDonorProfile,
  getMyDonorProfile,
  updateMyDonorProfile,
  updateMyAvailability,
  updateMyConsent,
  searchDonors
} from "../controllers/donor.controller.js";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware.js";
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

// Public Donor Discovery Endpoint (Optional authentication to filter own profile)
router.get("/search", optionalAuthenticate, searchLimiter, searchDonors);

// POST /api/v1/donors/seed - Seed sample donor profiles if database has none (Development & Demo utility)
router.post("/seed", async (req, res) => {
  try {
    const { DonorProfile } = await import("../models/DonorProfile.js");
    const { User } = await import("../models/User.js");

    const sampleDonors = [
      {
        fullName: "Aarav Sharma",
        email: "aarav.sharma@raktdal-demo.org",
        phoneNumber: "+91 98123 45671",
        bloodGroup: "O+",
        age: 26,
        location: { city: "Delhi", district: "Central Delhi", state: "Delhi", pinCode: "110001" },
        availabilityStatus: "AVAILABLE"
      },
      {
        fullName: "Priya Patel",
        email: "priya.patel@raktdal-demo.org",
        phoneNumber: "+91 98234 56782",
        bloodGroup: "B+",
        age: 29,
        location: { city: "Mumbai", district: "Mumbai City", state: "Maharashtra", pinCode: "400001" },
        availabilityStatus: "AVAILABLE"
      },
      {
        fullName: "Vikram Singh",
        email: "vikram.singh@raktdal-demo.org",
        phoneNumber: "+91 98345 67893",
        bloodGroup: "A+",
        age: 32,
        location: { city: "Chandigarh", district: "Chandigarh", state: "Punjab", pinCode: "160017" },
        availabilityStatus: "AVAILABLE"
      },
      {
        fullName: "Ananya Iyer",
        email: "ananya.iyer@raktdal-demo.org",
        phoneNumber: "+91 98456 78904",
        bloodGroup: "AB+",
        age: 24,
        location: { city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", pinCode: "560001" },
        availabilityStatus: "AVAILABLE"
      },
      {
        fullName: "Rohan Verma",
        email: "rohan.verma@raktdal-demo.org",
        phoneNumber: "+91 98567 89015",
        bloodGroup: "O-",
        age: 35,
        location: { city: "Delhi", district: "South Delhi", state: "Delhi", pinCode: "110016" },
        availabilityStatus: "AVAILABLE"
      },
      {
        fullName: "Sneha Mukherjee",
        email: "sneha.m@raktdal-demo.org",
        phoneNumber: "+91 98678 90126",
        bloodGroup: "B-",
        age: 28,
        location: { city: "Kolkata", district: "Kolkata", state: "West Bengal", pinCode: "700001" },
        availabilityStatus: "AVAILABLE"
      }
    ];

    let createdCount = 0;
    for (const d of sampleDonors) {
      let user = await User.findOne({ email: d.email });
      if (!user) {
        user = await User.create({
          fullName: d.fullName,
          email: d.email,
          phoneNumber: d.phoneNumber,
          platformRoles: ["USER"],
          isEmailVerified: true
        });
      }

      let profile = await DonorProfile.findOne({ userId: user._id });
      if (!profile) {
        await DonorProfile.create({
          userId: user._id,
          bloodGroup: d.bloodGroup,
          age: d.age,
          location: d.location,
          availabilityStatus: d.availabilityStatus,
          preferredContactMethod: "IN_APP",
          publicDiscoveryConsent: true,
          notificationConsent: true,
          contactSharingConsent: true,
          profileStatus: "ACTIVE"
        });
        createdCount++;
      }
    }

    return res.json({ success: true, message: `Successfully seeded ${createdCount} volunteer donor profiles.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

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
      message: `Alert delivered to ${profile.userId.fullName}.`
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
