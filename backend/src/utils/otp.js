import crypto from "crypto";
import { Resend } from "resend";
import { env } from "../config/env.js";

// Initialize Resend client only if API key is provided
const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

/**
 * Generates a cryptographically secure 6-digit OTP string
 */
export function generateSixDigitOtp() {
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

/**
 * Hashes an OTP or reset token with SHA-256 before saving to DB
 */
export function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp.trim()).digest("hex");
}

/**
 * Sends OTP email using Resend
 */
export async function sendOtpEmail({ email, otp }) {
  if (!resend) {
    if (env.nodeEnv !== "production") {
      console.log(`[DEV MODE] Resend API key not set. Email to ${email} would contain OTP: ${otp}`);
      return { success: true, id: "dev-simulated-id" };
    }
    throw new Error("Resend email service is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from: env.emailFrom,
    to: [email],
    subject: "Your RaktDal Email Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #b91c1c; margin-top: 0;">RaktDal Verification</h2>
        <p style="color: #374151; font-size: 15px;">Your 6-digit email verification code is:</p>
        <div style="background: #fee2e2; color: #991b1b; font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 14px; text-align: center; border-radius: 6px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 13px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `
  });

  if (error) {
    throw new Error(error.message || "Failed to deliver email through Resend");
  }

  return { success: true, id: data?.id };
}

/**
 * Sends Password Reset email with link and reset token
 */
export async function sendPasswordResetEmail({ email, resetToken }) {
  const resetUrl = `${env.frontendUrl}/reset-password.html?token=${resetToken}&email=${encodeURIComponent(email)}`;

  if (!resend) {
    if (env.nodeEnv !== "production") {
      console.log(`[DEV MODE] Resend API key not set. Password reset for ${email}: ${resetUrl} (Token: ${resetToken})`);
      return { success: true, id: "dev-simulated-id" };
    }
    throw new Error("Resend email service is not configured.");
  }

  const { data, error } = await resend.emails.send({
    from: env.emailFrom,
    to: [email],
    subject: "Reset Your RaktDal Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #b91c1c; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #374151; font-size: 15px;">We received a request to reset your RaktDal account password.</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${resetUrl}" style="background: #b91c1c; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #4b5563; font-size: 13px;">Or copy and paste this code/token into the reset form:</p>
        <div style="background: #f3f4f6; color: #1f2937; padding: 10px; font-family: monospace; font-size: 14px; word-break: break-all; border-radius: 4px; margin-bottom: 16px;">
          ${resetToken}
        </div>
        <p style="color: #6b7280; font-size: 12px;">This password reset link will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `
  });

  if (error) {
    throw new Error(error.message || "Failed to deliver reset email through Resend");
  }

  return { success: true, id: data?.id };
}
