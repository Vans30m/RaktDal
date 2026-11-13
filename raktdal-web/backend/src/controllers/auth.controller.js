import { OAuth2Client } from "google-auth-library";
import argon2 from "argon2";
import crypto from "crypto";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import { EmailOtp } from "../models/EmailOtp.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { isDatabaseConnected } from "../config/database.js";
import { generateSixDigitOtp, hashOtp, sendOtpEmail, sendPasswordResetEmail } from "../utils/otp.js";
import {
  getCookieOptions,
  generateAccessToken,
  createSession,
  rotateRefreshToken,
  hashToken,
  generatePkcePair
} from "../utils/security.js";
import {
  generateGoogleAuthUrl,
  exchangeAndVerifyGoogleToken
} from "../services/googleAuth.service.js";
import { NotificationService } from "../services/notification.service.js";

const googleClient = new OAuth2Client(
  env.google.clientId,
  env.google.clientSecret,
  env.google.callbackUrl
);

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 mins
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Forgot password resend cooldown & rate limiting (Map: email -> { lastSentAt, attempts, resetAt })
const resetRateLimitMap = new Map();
const RESET_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const RESET_WINDOW_MS = 15 * 60 * 1000; // 15 mins
const MAX_RESET_REQUESTS = 5;

/**
 * User Registration
 * POST /api/v1/auth/register
 */
export async function register(req, res) {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database service is unavailable. Please ensure MONGODB_URI is configured and the database is reachable."
      });
    }

    const { fullName, email, password } = req.body || {};

    if (
      !fullName ||
      !email ||
      !password ||
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required and must be valid strings."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    // Hash password with Argon2
    const passwordHash = await argon2.hash(password);

    // Create user with unverified email
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      emailVerifiedAt: null,
      accountStatus: "ACTIVE",
      platformRoles: ["USER"]
    });

    // Invalidate existing unused codes and generate 6-digit OTP
    await EmailOtp.updateMany({ email: normalizedEmail, isUsed: false }, { isUsed: true });
    const rawOtp = generateSixDigitOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailOtp.create({
      userId: user._id,
      email: normalizedEmail,
      otpHash: hashOtp(rawOtp),
      expiresAt
    });

    // Send verification email via Resend
    await sendOtpEmail({ email: normalizedEmail, otp: rawOtp });

    return res.status(201).json({
      success: true,
      message: "Registration successful! A 6-digit verification code has been sent to your email.",
      data: {
        email: user.email
      }
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration."
    });
  }
}

/**
 * Email & Password Login
 * POST /api/v1/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required and must be valid strings."
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    if (!user.emailVerifiedAt) {
      return res.status(403).json({
        success: false,
        message: "Email is not verified. Please verify your email before signing in.",
        error: { code: "EMAIL_NOT_VERIFIED" }
      });
    }

    if (user.accountStatus !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.accountStatus.toLowerCase()}.`,
        error: { code: "ACCOUNT_SUSPENDED" }
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const userAgent = req.headers["user-agent"] || "Unknown Device";
    const ipAddress = req.ip || req.connection?.remoteAddress || "Unknown IP";

    const { rawRefreshToken } = await createSession({
      userId: user._id,
      userAgent,
      ipAddress
    });

    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, getCookieOptions({ maxAge: ACCESS_TOKEN_MAX_AGE }));
    res.cookie("refreshToken", rawRefreshToken, getCookieOptions({ maxAge: REFRESH_TOKEN_MAX_AGE }));

    return res.json({
      success: true,
      message: "Login successful.",
      data: {
        user: user.toPublicProfile()
      }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login."
    });
  }
}

/**
 * Refresh Access Token
 * POST /api/v1/auth/refresh
 */
export async function refresh(req, res) {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided."
      });
    }

    const userAgent = req.headers["user-agent"] || "Unknown Device";
    const ipAddress = req.ip || req.connection?.remoteAddress || "Unknown IP";

    const { userId, newRawRefreshToken } = await rotateRefreshToken({
      rawRefreshToken,
      userAgent,
      ipAddress
    });

    const user = await User.findById(userId);
    if (!user || user.accountStatus !== "ACTIVE") {
      res.clearCookie("accessToken", getCookieOptions());
      res.clearCookie("refreshToken", getCookieOptions());
      return res.status(401).json({
        success: false,
        message: "User session is no longer active."
      });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, getCookieOptions({ maxAge: ACCESS_TOKEN_MAX_AGE }));
    res.cookie("refreshToken", newRawRefreshToken, getCookieOptions({ maxAge: REFRESH_TOKEN_MAX_AGE }));

    return res.json({
      success: true,
      message: "Token refreshed successfully.",
      data: {
        user: user.toPublicProfile()
      }
    });
  } catch (err) {
    res.clearCookie("accessToken", getCookieOptions());
    res.clearCookie("refreshToken", getCookieOptions());

    return res.status(401).json({
      success: false,
      message: err.message || "Failed to refresh session."
    });
  }
}

/**
 * Logout
 * POST /api/v1/auth/logout
 */
export async function logout(req, res) {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await Session.findOneAndUpdate({ refreshTokenHash: tokenHash }, { isRevoked: true });
    }

    res.clearCookie("accessToken", getCookieOptions());
    res.clearCookie("refreshToken", getCookieOptions());

    return res.json({
      success: true,
      message: "Logged out successfully."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error during logout."
    });
  }
}

/**
 * Logout from all devices
 * POST /api/v1/auth/logout-all
 */
export async function logoutAll(req, res) {
  try {
    if (req.user?._id) {
      await Session.updateMany({ userId: req.user._id, isRevoked: false }, { isRevoked: true });
    }

    res.clearCookie("accessToken", getCookieOptions());
    res.clearCookie("refreshToken", getCookieOptions());

    return res.json({
      success: true,
      message: "All sessions have been revoked successfully."
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error during global logout."
    });
  }
}

/**
 * Get current authenticated user profile
 * GET /api/v1/auth/me
 */
export async function getCurrentUser(req, res) {
  res.json({
    success: true,
    data: { user: req.user.toPublicProfile() }
  });
}

/**
 * Get all active sessions for current user
 * GET /api/v1/auth/sessions
 */
export async function getSessions(req, res) {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    const currentHash = rawRefreshToken ? hashToken(rawRefreshToken) : null;

    const sessions = await Session.find({
      userId: req.user._id,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    const formatted = sessions.map((s) => ({
      id: s._id,
      userAgent: s.userAgent,
      ipAddress: s.ipAddress,
      createdAt: s.createdAt,
      lastActiveAt: s.updatedAt,
      isCurrent: s.refreshTokenHash === currentHash
    }));

    res.json({
      success: true,
      data: { sessions: formatted }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve sessions."
    });
  }
}

/**
 * Request Password Reset
 * POST /api/v1/auth/forgot-password
 * Returns a generic success message to prevent user enumeration attacks.
 */
export async function forgotPassword(req, res) {
  const genericResponse = {
    success: true,
    message: "If an account with that email exists, password reset instructions have been sent."
  };

  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting check
    const now = Date.now();
    const entry = resetRateLimitMap.get(normalizedEmail) || { attempts: 0, lastSentAt: 0, resetAt: now + RESET_WINDOW_MS };

    if (now > entry.resetAt) {
      entry.attempts = 0;
      entry.resetAt = now + RESET_WINDOW_MS;
    }

    if (entry.lastSentAt && now - entry.lastSentAt < RESET_RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil((RESET_RESEND_COOLDOWN_MS - (now - entry.lastSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before requesting another reset email.`
      });
    }

    if (entry.attempts >= MAX_RESET_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many password reset requests. Please try again after 15 minutes."
      });
    }

    entry.attempts += 1;
    entry.lastSentAt = now;
    resetRateLimitMap.set(normalizedEmail, entry);

    // Look for registered user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Return generic message to prevent email enumeration
      return res.json(genericResponse);
    }

    // Invalidate existing unused reset tokens for this user
    await PasswordResetToken.updateMany({ userId: user._id, isUsed: false }, { isUsed: true });

    // Generate high-entropy 32-byte single-use token
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiration

    // Store only the hashed token in MongoDB
    await PasswordResetToken.create({
      userId: user._id,
      email: normalizedEmail,
      tokenHash,
      expiresAt,
      maxAttempts: 5
    });

    // Send email through Resend (never logged or exposed in API response)
    await sendPasswordResetEmail({
      email: user.email,
      resetToken: rawResetToken
    });

    return res.json(genericResponse);
  } catch (err) {
    console.error("forgotPassword error:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request."
    });
  }
}

/**
 * Reset Password
 * POST /api/v1/auth/reset-password
 */
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body || {};

    if (!token || !newPassword || typeof token !== "string" || typeof newPassword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required and must be valid strings."
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long."
      });
    }

    // Hash the incoming token to look it up
    const tokenHash = hashToken(token.trim());
    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      isUsed: false
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or already used password reset token."
      });
    }

    // Check expiration
    if (new Date() > resetRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Password reset token has expired. Please request a new one."
      });
    }

    // Check maximum attempts
    if (resetRecord.attempts >= resetRecord.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: "Too many attempts on this reset link. It has been invalidated."
      });
    }

    // Mark reset credential as used immediately to prevent reuse
    resetRecord.isUsed = true;
    await resetRecord.save();

    // Hash the new password using Argon2
    const passwordHash = await argon2.hash(newPassword);

    // Update user password and ensure email is verified
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found."
      });
    }

    user.passwordHash = passwordHash;
    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date();
    }
    await user.save();

    // Revoke all existing refresh-token sessions for this user across all devices
    await Session.updateMany({ userId: user._id }, { isRevoked: true });

    // Clear active session cookies if present
    res.clearCookie("accessToken", getCookieOptions());
    res.clearCookie("refreshToken", getCookieOptions());

    return res.json({
      success: true,
      message: "Password has been successfully reset. All existing sessions have been signed out. Please sign in with your new password."
    });
  } catch (err) {
    console.error("resetPassword error:", err.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password."
    });
  }
}

/**
 * Change Password (Authenticated user with current password check)
 * POST /api/v1/auth/change-password
 */
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long."
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found."
      });
    }

    // If user already has a password set, verify currentPassword
    if (user.passwordHash) {
      if (!currentPassword || typeof currentPassword !== "string") {
        return res.status(400).json({
          success: false,
          message: "Current password is required."
        });
      }

      const isMatch = await argon2.verify(user.passwordHash, currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect current password."
        });
      }
    }

    // Hash the new password using Argon2
    const passwordHash = await argon2.hash(newPassword);
    user.passwordHash = passwordHash;
    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully."
    });
  } catch (err) {
    console.error("changePassword error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update password. Please try again."
    });
  }
}

/**
 * Verify Email with OTP
 * POST /api/v1/auth/verify-email
 */
export async function verifyEmailOtp(req, res) {
  try {
    const { otp, email } = req.body || {};
    const targetEmail = req.user?.email || email;

    if (
      !otp ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp.trim()) ||
      !targetEmail ||
      typeof targetEmail !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email and 6-digit verification code."
      });
    }

    const otpRecord = await EmailOtp.findOne({
      email: targetEmail.toLowerCase().trim(),
      isUsed: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No active verification code found."
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired."
      });
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Code is invalid."
      });
    }

    if (hashOtp(otp) !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = Math.max(0, otpRecord.maxAttempts - otpRecord.attempts);
      return res.status(400).json({
        success: false,
        message: `Incorrect code. ${remaining} attempt(s) remaining.`
      });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    const user = await User.findOne({ email: targetEmail.toLowerCase().trim() });
    if (user) {
      const wasAlreadyVerified = Boolean(user.emailVerifiedAt);
      user.emailVerifiedAt = new Date();
      await user.save();

      // If newly verified, send welcome email notification
      if (!wasAlreadyVerified) {
        try {
          await NotificationService.notifyUser({
            userId: user._id,
            type: "ACCOUNT_CREATED",
            title: "Welcome to RaktDal!",
            message: `Hello ${user.fullName || "Friend"}, your email has been verified. Welcome to RaktDal, where every drop connects and saves lives!`,
            priority: "NORMAL",
            emailOptions: {
              subject: "Welcome to RaktDal - Account Activated!",
              subtitle: "Thank you for joining our life-saving community.",
              bodyHtml: `
                <p>Hello <strong>${user.fullName || "Friend"}</strong>,</p>
                <p>Congratulations! Your RaktDal account has been successfully created and verified.</p>
                <p>With RaktDal, you can:</p>
                <ul style="padding-left: 20px; line-height: 1.8;">
                  <li><strong>Register as a Blood Donor:</strong> Make yourself discoverable to verified hospitals and families in critical need.</li>
                  <li><strong>Find Blood Donors:</strong> Search verified donors in real-time across your city and state.</li>
                  <li><strong>Join Blood Donation Camps:</strong> Discover and register for verified donation drives in your area.</li>
                  <li><strong>Request Emergency Blood:</strong> Submit verified emergency blood requests that notify matching donors immediately.</li>
                </ul>
                <p>Together, we bridge the gap between donors and patients in urgent need.</p>
              `,
              actionUrl: "/pages/donor-registration.html",
              actionText: "Become a Donor",
              templateParams: {
                to_name: user.fullName || "User",
                subject: "Welcome to RaktDal - Account Activated!",
                message: "Your email has been verified and your RaktDal account is activated. Thank you for joining our community!"
              }
            }
          });
        } catch (welcomeErr) {
          console.warn("[AUTH] Welcome notification non-fatal error:", welcomeErr.message);
        }
      }
    }

    return res.json({
      success: true,
      message: "Email verified successfully."
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error verifying email." });
  }
}

/**
 * Resend Email Verification OTP
 * POST /api/v1/auth/resend-otp
 */
export async function resendOtp(req, res) {
  try {
    const rawEmail = req.user?.email || req.body?.email;
    if (!rawEmail || typeof rawEmail !== "string") {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }

    const email = rawEmail.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email." });
    }

    if (user.emailVerifiedAt) {
      return res.status(400).json({ success: false, message: "Email is already verified." });
    }

    await EmailOtp.updateMany({ email, isUsed: false }, { isUsed: true });

    const rawOtp = generateSixDigitOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailOtp.create({
      userId: user._id,
      email,
      otpHash: hashOtp(rawOtp),
      expiresAt
    });

    await sendOtpEmail({ email, otp: rawOtp });

    return res.json({
      success: true,
      message: "Verification code sent to your email."
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to send code." });
  }
}

// Allowed client origin pattern for development & production
function getRedirectOrigin(req) {
  const referer = req.headers?.referer || req.headers?.origin;
  if (referer) {
    try {
      const url = new URL(referer);
      // If client initiated from localhost or 127.0.0.1 on any port (e.g. 3000, 5500, 5173, 5000), preserve it
      if (!env.isProduction && /^(localhost|127\.0\.0\.1)$/.test(url.hostname)) {
        return `${url.protocol}//${url.host}`;
      }
    } catch (_e) {}
  }
  return env.frontendUrl;
}

/**
 * Google Login Kickoff
 * GET /api/v1/auth/google
 */
export function initiateGoogleLogin(req, res) {
  try {
    const state = crypto.randomBytes(32).toString("hex");
    const { verifier, challenge } = generatePkcePair();

    // Capture the origin the user actually came from (e.g. port 3000, 5500, 5173, etc.)
    const clientOrigin = getRedirectOrigin(req);

    // Store state, code_verifier, and client origin in short-lived HttpOnly cookies
    res.cookie("oauth_state", state, getCookieOptions({ maxAge: 10 * 60 * 1000 }));
    res.cookie("oauth_code_verifier", verifier, getCookieOptions({ maxAge: 10 * 60 * 1000 }));
    res.cookie("oauth_client_origin", clientOrigin, getCookieOptions({ maxAge: 10 * 60 * 1000 }));

    const authUrl = generateGoogleAuthUrl({
      state,
      codeChallenge: challenge
    });

    return res.redirect(authUrl);
  } catch (err) {
    console.error("Failed to initiate Google OAuth:", err.message);
    const fallbackOrigin = getRedirectOrigin(req);
    return res.redirect(`${fallbackOrigin}/index.html#/login?error=oauth_init_failed`);
  }
}

/**
 * Google Callback
 * GET /api/v1/auth/google/callback
 */
export async function handleGoogleCallback(req, res) {
  // Determine redirect origin (from cookie saved during kickoff, or fallback)
  let targetOrigin = env.frontendUrl;
  const savedOrigin = req.cookies?.oauth_client_origin;
  if (savedOrigin) {
    try {
      const parsed = new URL(savedOrigin);
      if (!env.isProduction && /^(localhost|127\.0\.0\.1)$/.test(parsed.hostname)) {
        targetOrigin = `${parsed.protocol}//${parsed.host}`;
      } else if (savedOrigin === env.frontendUrl) {
        targetOrigin = savedOrigin;
      }
    } catch (_e) {}
  }

  try {
    const { code, state, error } = req.query;

    if (error || !code) {
      return res.redirect(`${targetOrigin}/index.html#/login?error=cancelled`);
    }

    const savedState = req.cookies?.oauth_state;
    const savedVerifier = req.cookies?.oauth_code_verifier;

    // Clear OAuth transaction cookies immediately
    res.clearCookie("oauth_state", getCookieOptions());
    res.clearCookie("oauth_code_verifier", getCookieOptions());
    res.clearCookie("oauth_client_origin", getCookieOptions());

    if (!savedState || typeof state !== "string" || savedState !== state) {
      console.warn("OAuth state validation failed: state mismatch or missing cookie.");
      return res.redirect(`${targetOrigin}/index.html#/login?error=invalid_state`);
    }

    if (!savedVerifier || typeof savedVerifier !== "string") {
      console.warn("PKCE code_verifier is missing from cookies.");
      return res.redirect(`${targetOrigin}/index.html#/login?error=invalid_pkce`);
    }

    // Exchange code for tokens and verify Google ID token
    const { payload } = await exchangeAndVerifyGoogleToken({
      code,
      codeVerifier: savedVerifier
    });

    if (!payload.email || !payload.sub) {
      console.warn("Google ID token missing essential claims (email or sub).");
      return res.redirect(`${targetOrigin}/index.html#/login?error=invalid_account`);
    }

    // Lookup user by immutable Google Subject ID ('sub') first
    let user = await User.findOne({ googleSubject: payload.sub });

    if (user) {
      // Keep profile image and name fresh from Google if provided
      if (payload.picture && payload.picture !== user.profileImage) {
        user.profileImage = payload.picture;
      }
      if (payload.name && (!user.fullName || user.fullName === "Blood Donor")) {
        user.fullName = payload.name;
      }
      await user.save();
    } else {
      // Check if an existing account uses this email
      const existingUserWithEmail = await User.findOne({ email: payload.email });
      if (existingUserWithEmail) {
        if (existingUserWithEmail.googleSubject && existingUserWithEmail.googleSubject !== payload.sub) {
          // Conflict: Email belongs to an account linked to a different Google Subject
          console.warn("Prevented unsafe account linking: sub mismatch on existing email.");
          return res.redirect(`${targetOrigin}/index.html#/login?error=identity_conflict`);
        }
        // Link Google Subject to the existing record
        existingUserWithEmail.googleSubject = payload.sub;
        if (payload.emailVerified && !existingUserWithEmail.emailVerifiedAt) {
          existingUserWithEmail.emailVerifiedAt = new Date();
        }
        if (payload.picture) {
          existingUserWithEmail.profileImage = payload.picture;
        }
        user = await existingUserWithEmail.save();
      } else {
        // Create new user record
        user = await User.create({
          fullName: payload.name || "Blood Donor",
          email: payload.email,
          emailVerifiedAt: payload.emailVerified ? new Date() : new Date(),
          googleSubject: payload.sub,
          profileImage: payload.picture || null,
          platformRoles: ["USER"],
          accountStatus: "ACTIVE"
        });
      }
    }

    if (user.accountStatus !== "ACTIVE") {
      return res.redirect(`${targetOrigin}/index.html#/login?error=account_suspended`);
    }

    user.lastLoginAt = new Date();
    await user.save();

    // Create authenticated user session
    const userAgent = req.headers["user-agent"] || "Unknown Device";
    const ipAddress = req.ip || req.connection?.remoteAddress || "Unknown IP";

    const { rawRefreshToken } = await createSession({
      userId: user._id,
      userAgent,
      ipAddress
    });

    const accessToken = generateAccessToken(user);

    res.cookie("accessToken", accessToken, getCookieOptions({ maxAge: ACCESS_TOKEN_MAX_AGE }));
    res.cookie("refreshToken", rawRefreshToken, getCookieOptions({ maxAge: REFRESH_TOKEN_MAX_AGE }));

    return res.redirect(`${targetOrigin}/index.html#/auth/callback?status=success`);
  } catch (err) {
    console.error("Google OAuth callback error:", err.message);
    return res.redirect(`${targetOrigin}/index.html#/login?error=auth_failed`);
  }
}

