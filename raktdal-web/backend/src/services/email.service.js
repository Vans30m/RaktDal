import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "../config/env.js";

const hasValidResendKey = env.resendApiKey && !env.resendApiKey.startsWith("re_your_");
const resend = hasValidResendKey ? new Resend(env.resendApiKey) : null;

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
 * Escapes HTML characters to prevent XSS in email bodies
 */
export function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Common RaktDal HTML email layout
 */
export function renderEmailTemplate({ title, subtitle, bodyHtml, actionUrl = null, actionText = null }) {
  const safeTitle = escapeHtml(title);
  const safeSubtitle = subtitle ? escapeHtml(subtitle) : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${safeTitle}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);">
              <tr>
                <td style="background-color: #b91c1c; padding: 24px 32px; text-align: left;">
                  <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                    RaktDal
                  </h1>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #fecaca;">
                    Blood Donation & Donor Coordination Platform
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 10px; font-size: 18px; font-weight: 700; color: #0f172a;">
                    ${safeTitle}
                  </h2>
                  ${safeSubtitle ? `<p style="margin: 0 0 20px; font-size: 14px; color: #64748b; line-height: 1.5;">${safeSubtitle}</p>` : ""}
                  <div style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px;">
                    ${bodyHtml}
                  </div>
                  ${actionUrl && actionText ? `
                    <div style="margin: 28px 0 12px; text-align: center;">
                      <a href="${escapeHtml(actionUrl)}" style="background-color: #b91c1c; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">
                        ${escapeHtml(actionText)}
                      </a>
                    </div>
                  ` : ""}
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 32px; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                    This is an automated notification from RaktDal. Please do not reply directly to this email.<br>
                    Medical decisions & donor eligibility are conducted on-site by qualified professionals.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Send email via EmailJS REST API
 * Supports standard parameters: to_email, to_name, subject, message, html_content
 */
export async function sendEmailViaEmailJS({
  to,
  toName = "",
  subject,
  html,
  templateParams = {},
  templateId = null
}) {
  const serviceId = env.emailjsServiceId;
  const targetTemplateId = templateId || env.emailjsTemplateId;
  const publicKey = env.emailjsPublicKey;
  const privateKey = env.emailjsPrivateKey;

  if (!serviceId || !targetTemplateId || !publicKey) {
    throw new Error("EmailJS configuration is missing serviceId, templateId, or publicKey.");
  }

  const payload = {
    service_id: serviceId,
    template_id: targetTemplateId,
    user_id: publicKey,
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

  if (privateKey) {
    payload.accessToken = privateKey;
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS send failed (${response.status}): ${errorText}`);
  }

  return { success: true, provider: "emailjs", messageId: `emailjs-${Date.now()}` };
}

/**
 * Low-level email dispatcher (EmailJS -> Gmail SMTP -> Resend -> Dev fallback)
 */
export async function sendEmail({ to, toName = "", subject, html, templateParams = {}, templateId = null }) {
  const from = env.smtpUser ? `RaktDal <${env.smtpUser}>` : env.emailFrom;

  try {
    // Priority 1: EmailJS if configured
    if (env.emailjsServiceId && (templateId || env.emailjsTemplateId) && env.emailjsPublicKey) {
      return await sendEmailViaEmailJS({
        to,
        toName,
        subject,
        html,
        templateParams,
        templateId
      });
    }

    // Priority 2: Gmail SMTP
    if (transporter) {
      const info = await transporter.sendMail({ from, to, subject, html });
      return { success: true, provider: "smtp", messageId: info.messageId };
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
      return { success: true, provider: "resend", messageId: data?.id };
    }
  } catch (deliveryError) {
    if (env.nodeEnv !== "production") {
      console.warn(`[EMAIL DELIVERY NOTICE] Primary email provider failed (${deliveryError.message}). Fallback to dev log.`);
      return { success: true, provider: "dev-fallback", messageId: "dev-simulated-fallback-id" };
    }
    throw deliveryError;
  }

  if (env.nodeEnv !== "production") {
    console.log(`\n========================================`);
    console.log(`[DEV NOTIFICATION EMAIL] To: ${to}`);
    console.log(`[DEV NOTIFICATION EMAIL] Subject: ${subject}`);
    console.log(`========================================\n`);
    return { success: true, provider: "dev-simulation", messageId: "dev-simulated-id" };
  }

  throw new Error("No email service configured.");
}

