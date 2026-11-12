import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  getCurrentUser,
  getSessions,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmailOtp,
  resendOtp,
  initiateGoogleLogin,
  handleGoogleCallback
} from "../controllers/auth.controller.js";
import {
  authenticate,
  authorize,
  preventSelfRoleElevation,
  logAdminAction
} from "../middleware/auth.middleware.js";
import { verifyCsrf } from "../utils/security.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again after 15 minutes.",
  prefix: "auth"
});

const passwordResetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many password reset requests. Please try again after an hour.",
  prefix: "pwd_reset"
});

const router = Router();

// Email & Password Authentication
router.post("/register", authLimiter, verifyCsrf, register);
router.post("/login", authLimiter, verifyCsrf, login);
router.post("/refresh", verifyCsrf, refresh);
router.post("/logout", verifyCsrf, logout);
router.post("/logout-all", authenticate, verifyCsrf, logoutAll);

// Password Management Flows
router.post("/forgot-password", passwordResetLimiter, verifyCsrf, forgotPassword);
router.post("/reset-password", passwordResetLimiter, verifyCsrf, resetPassword);
router.post("/change-password", authenticate, verifyCsrf, changePassword);

// Profile and Sessions
router.get("/me", authenticate, getCurrentUser);
router.get("/sessions", authenticate, getSessions);

// Self-profile update with prevention of self-role elevation
router.patch("/me", authenticate, verifyCsrf, preventSelfRoleElevation, async (req, res) => {
  const allowedUpdates = ["fullName", "phoneNumber", "preferredLanguage"];
  const updates = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  Object.assign(req.user, updates);
  await req.user.save();

  // If user changed their name or phone, also keep any embedded references up to date in related models
  if (updates.fullName || updates.phoneNumber) {
    try {
      const { CampRegistration } = await import("../models/CampRegistration.js");
      const campUpdates = {};
      if (updates.fullName) campUpdates.donorName = updates.fullName;
      if (updates.phoneNumber) campUpdates.donorPhone = updates.phoneNumber;
      await CampRegistration.updateMany({ userId: req.user._id }, { $set: campUpdates });
    } catch (e) {
      console.warn("Could not cascade update to CampRegistrations:", e.message);
    }
  }

  res.json({ success: true, message: "Profile updated successfully.", data: { user: req.user.toPublicProfile() } });
});

// Admin-Only Endpoint with Audit Logging
router.get("/admin/dashboard", authenticate, authorize("ADMIN"), logAdminAction("ACCESS_ADMIN_DASHBOARD"), (req, res) => {
  res.json({
    success: true,
    message: "Admin authorization verified. Access granted to administrative control plane.",
    data: { admin: req.user.email }
  });
});

// Email OTP Verification
router.post("/verify-email", verifyCsrf, verifyEmailOtp);
router.post("/resend-otp", verifyCsrf, resendOtp);

// Google OAuth
router.get("/google", initiateGoogleLogin);
router.get("/google/callback", handleGoogleCallback);


export default router;
