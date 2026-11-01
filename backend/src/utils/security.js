import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Session } from "../models/Session.js";

/**
 * Standard cookie configuration helper for cross-origin Render topology
 */
export function getCookieOptions({ maxAge } = {}) {
  const options = {
    httpOnly: true,
    secure: env.isProduction,
    // SameSite=None is required for cross-site cookies over HTTPS (Render frontend & backend)
    sameSite: env.isProduction ? "none" : "lax",
    path: "/"
  };
  if (maxAge) options.maxAge = maxAge;
  return options;
}

/**
 * Double-submit / Custom Header CSRF verification for state-changing requests
 */
export function verifyCsrf(req, res, next) {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) return next();

  // Browsers cannot send custom headers cross-origin without CORS preflight approval
  const csrfHeader = req.headers["x-requested-with"] || req.headers["x-csrf-token"];
  if (!csrfHeader) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed: Missing X-Requested-With header."
    });
  }
  next();
}

/**
 * Computes deterministic SHA-256 hash of a string
 */
export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Generates high-entropy random string
 */
export function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Generates PKCE code_verifier and code_challenge (S256)
 */
export function generatePkcePair() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

/**
 * Generates short-lived 15-minute access JWT
 */
export function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, roles: user.platformRoles },
    env.jwtSecret,
    { expiresIn: env.accessExpiresIn }
  );
}

/**
 * Verifies access JWT
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (err) {
    return null;
  }
}

/**
 * Creates new session and refresh token family
 */
export async function createSession({ userId, userAgent, ipAddress }) {
  const rawRefreshToken = generateRandomToken(40);
  const refreshTokenHash = hashToken(rawRefreshToken);
  const tokenFamilyId = crypto.randomUUID();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.refreshExpiresDays);

  const session = await Session.create({
    userId,
    refreshTokenHash,
    tokenFamilyId,
    userAgent: userAgent || "Unknown Device",
    ipAddress: ipAddress || "Unknown IP",
    expiresAt
  });

  return { session, rawRefreshToken };
}

/**
 * Rotates a refresh token with automatic token-reuse detection
 */
export async function rotateRefreshToken({ rawRefreshToken, userAgent, ipAddress }) {
  if (!rawRefreshToken) {
    throw new Error("No refresh token provided.");
  }

  const tokenHash = hashToken(rawRefreshToken);
  const session = await Session.findOne({ refreshTokenHash: tokenHash });

  if (!session) {
    throw new Error("Invalid session.");
  }

  // REUSE DETECTION: If token is already marked revoked, compromise detected!
  if (session.isRevoked) {
    // Revoke all tokens belonging to this family immediately
    await Session.updateMany({ tokenFamilyId: session.tokenFamilyId }, { isRevoked: true });
    throw new Error("Token reuse detected! Session family has been revoked.");
  }

  // Check expiration
  if (new Date() > session.expiresAt) {
    session.isRevoked = true;
    await session.save();
    throw new Error("Session has expired. Please sign in again.");
  }

  // Revoke current token on rotation
  session.isRevoked = true;
  await session.save();

  // Issue new token in the same token family
  const newRawRefreshToken = generateRandomToken(40);
  const newRefreshTokenHash = hashToken(newRawRefreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.refreshExpiresDays);

  const newSession = await Session.create({
    userId: session.userId,
    refreshTokenHash: newRefreshTokenHash,
    tokenFamilyId: session.tokenFamilyId,
    userAgent: userAgent || session.userAgent,
    ipAddress: ipAddress || session.ipAddress,
    expiresAt
  });

  return {
    userId: session.userId,
    newSession,
    newRawRefreshToken
  };
}
