import crypto from "crypto";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "../config/env.js";

// 1. Resend Client (used if RESEND_API_KEY is provided and not a placeholder)
const hasValidResendKey = env.resendApiKey && !env.resendApiKey.startsWith("re_your_");
const resend = hasValidResendKey ? new Resend(env.resendApiKey) : null;

// 2. Nodemailer Transporter (used if SMTP_USER and SMTP_PASS are provided)
const hasSmtpConfig = Boolean(env.smtpUser && env.smtpPass);
const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass
      }
    })
  : null;

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
 * Sends email using EmailJS, Gmail SMTP (Nodemailer), Resend, or falls back to dev terminal simulation
 */
async function dispatchEmail({ to, toName = "", subject, html, templateParams = {}, templateId = null }) {
  const from = env.smtpUser ? `RaktDal <${env.smtpUser}>` : env.emailFrom;

  // In development, if providers throw or are restricted, gracefully fallback to terminal
  try {
    // Priority 1: EmailJS if configured
    if (env.emailjsServiceId && (templateId || env.emailjsTemplateId) && env.emailjsPublicKey) {
      const payload = {
        service_id: env.emailjsServiceId,
        template_id: templateId || env.emailjsTemplateId,
        user_id: env.emailjsPublicKey,
        template_params: {
          to_email: to,
          email: to,
          to_name: toName,
          name: toName,
          subject: subject,
          message: html,
          html_content: html,
          ...templateParams
        }
      };
      if (env.emailjsPrivateKey) {
        payload.accessToken = env.emailjsPrivateKey;
      }
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        return { success: true, id: `emailjs-${Date.now()}` };
      }
      console.warn(`[OTP] EmailJS failed (${response.status}):`, await response.text());
    }

    // Priority 2: Gmail SMTP (Sends to ANY email address)
    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html
      });
      return { success: true, id: info.messageId };
    }

    // Priority 3: Resend
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: env.emailFrom,
        to: [to],
        subject,
        html
      });
      if (error) {
        throw new Error(error.message || "Failed to deliver email through Resend");
      }
      return { success: true, id: data?.id };
    }
  } catch (deliveryError) {
    if (env.nodeEnv !== "production") {
      console.warn(`[EMAIL DELIVERY NOTICE] Email dispatch failed (${deliveryError.message}). Fallback to terminal.`);
      return { success: true, id: "dev-simulated-fallback-id" };
    }
    throw deliveryError;
  }

  // Fallback: Development simulation
  if (env.nodeEnv !== "production") {
    console.log(`\n========================================`);
    console.log(`[DEV EMAIL SIMULATION] To: ${to}`);
    console.log(`[DEV EMAIL SIMULATION] Subject: ${subject}`);
    console.log(`========================================\n`);
    return { success: true, id: "dev-simulated-id" };
  }

  throw new Error("No email service configured (requires SMTP_USER/SMTP_PASS or RESEND_API_KEY).");
}

/**
 * Sends OTP email - ALWAYS logs prominently to terminal in development!
 */
export async function sendOtpEmail({ email, otp }) {
  // Always print loud and clear in dev terminal for instant testing
  if (env.nodeEnv !== "production") {
    console.log(`\n======================================================`);
    console.log(`🔥 [DEV OTP VERIFICATION] 🔥`);
    console.log(`Email: ${email}`);
    console.log(`OTP Code: >>> ${otp} <<<`);
    console.log(`======================================================\n`);
  }

  try {
    await dispatchEmail({
      to: email,
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
  } catch (err) {
    if (env.nodeEnv !== "production") {
      console.warn(`[OTP] Resend rejected external recipient, but OTP is printed above for dev testing.`);
    } else {
      throw err;
    }
  }

  return { success: true, id: "otp-dispatched" };
}

/**
 * Sends Password Reset email with link and reset token
 */
export async function sendPasswordResetEmail({ email, resetToken }) {
  const resetUrl = `${env.frontendUrl}/pages/reset-password.html?token=${resetToken}&email=${encodeURIComponent(email)}`;

  if (env.nodeEnv !== "production") {
    console.log(`\n======================================================`);
    console.log(`🔑 [DEV PASSWORD RESET] 🔑`);
    console.log(`Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Reset Token: >>> ${resetToken} <<<`);
    console.log(`======================================================\n`);
  }

  try {
    await dispatchEmail({
      to: email,
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
  } catch (err) {
    if (env.nodeEnv !== "production") {
      console.warn(`[RESET] Resend rejected external recipient, but Reset Token is printed above for dev testing.`);
    } else {
      throw err;
    }
  }

  return { success: true, id: "reset-dispatched" };
}
