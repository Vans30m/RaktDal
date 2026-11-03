import { Notification } from "../models/Notification.js";
import { NotificationPreference } from "../models/NotificationPreference.js";
import { User } from "../models/User.js";
import { DonorProfile } from "../models/DonorProfile.js";
import { sendEmail, renderEmailTemplate, escapeHtml } from "./email.service.js";
import { env } from "../config/env.js";

export class NotificationService {
  /**
   * Helper: Get or initialize user notification preferences
   */
  static async getPreferences(userId) {
    let pref = await NotificationPreference.findOne({ userId });
    if (!pref) {
      pref = await NotificationPreference.create({ userId });
    }
    return pref;
  }

  /**
   * Dispatches a single notification to a user across enabled channels
   */
  static async notifyUser({
    userId,
    type,
    title,
    message,
    relatedEntityType = null,
    relatedEntityId = null,
    priority = "NORMAL",
    metadata = {},
    emailOptions = null,
    dedupKey = null
  }) {
    if (!userId) return null;

    // Check duplicate notification within last 1 hour if dedupKey provided
    if (dedupKey) {
      const recent = await Notification.findOne({
        userId,
        type,
        "metadata.dedupKey": dedupKey,
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
      });
      if (recent) return recent;
      metadata.dedupKey = dedupKey;
    }

    const pref = await this.getPreferences(userId);

    // 1. In-App Notification (Always stored by default unless explicitly disabled)
    let inAppNotification = null;
    if (pref.channels.inApp) {
      inAppNotification = await Notification.create({
        userId,
        type,
        title,
        message,
        relatedEntityType,
        relatedEntityId,
        priority,
        channels: ["IN_APP"],
        metadata
      });
    }

    // 2. Email Delivery (Optional transactional, requires preference & user email)
    if (pref.channels.email && emailOptions) {
      try {
        const user = await User.findById(userId).select("email fullName");
        if (user && user.email) {
          const emailHtml = renderEmailTemplate({
            title: emailOptions.subject || title,
            subtitle: emailOptions.subtitle || null,
            bodyHtml: emailOptions.bodyHtml || `<p>${escapeHtml(message)}</p>`,
            actionUrl: emailOptions.actionUrl ? `${env.frontendUrl}${emailOptions.actionUrl}` : null,
            actionText: emailOptions.actionText || null
          });

          await sendEmail({
            to: user.email,
            subject: emailOptions.subject || title,
            html: emailHtml
          });

          if (inAppNotification) {
            inAppNotification.channels.push("EMAIL");
            await inAppNotification.save();
          }
        }
      } catch (err) {
        console.error(`[NOTIFICATION EMAIL ERROR] Failed to send email to user ${userId}:`, err.message);
      }
    }

    // 3. FCM Browser Push (If subscribed tokens exist and channel enabled)
    if (pref.channels.push && pref.fcmTokens?.length > 0) {
      // Graceful push stub for FCM
      if (inAppNotification && !inAppNotification.channels.includes("PUSH")) {
        inAppNotification.channels.push("PUSH");
        await inAppNotification.save();
      }
    }

    return inAppNotification;
  }

  /**
   * Targets eligible donors for an approved blood request
   * Respects availability, location (City / PIN Code), and explicit notification consent.
   */
  static async notifyMatchingDonors(bloodRequest) {
    try {
      if (!bloodRequest || bloodRequest.status !== "ACTIVE") return;

      const { bloodGroup, location } = bloodRequest;
      if (!bloodGroup || !location?.city) return;

      // Filter eligible active donors in city
      const query = {
        bloodGroup,
        availabilityStatus: "AVAILABLE",
        notificationConsent: true,
        "location.city": new RegExp(`^${location.city.trim()}$`, "i")
      };

      if (location.pinCode) {
        query["location.pinCode"] = location.pinCode.trim();
      }

      const matchingDonors = await DonorProfile.find(query).limit(50);

      const requestUrl = `#/requests`;
      for (const donor of matchingDonors) {
        await this.notifyUser({
          userId: donor.userId,
          type: "REQUEST_CREATED",
          title: `Urgent: Blood Needed (${bloodGroup}) in ${location.city}`,
          message: `A patient at ${bloodRequest.hospitalName || "a local facility"} urgently requires ${bloodRequest.unitsRequired || 1} units of ${bloodGroup} blood.`,
          relatedEntityType: "BloodRequest",
          relatedEntityId: bloodRequest._id,
          priority: bloodRequest.urgency === "CRITICAL" ? "URGENT" : "HIGH",
          metadata: { bloodGroup, city: location.city },
          emailOptions: {
            subject: `Urgent Blood Donation Need: ${bloodGroup} in ${location.city}`,
            subtitle: `A patient needs your support in ${location.city}`,
            bodyHtml: `
              <p>Hello,</p>
              <p>A new verified blood request matching your blood group (<strong>${escapeHtml(bloodGroup)}</strong>) has been opened near your registered location in <strong>${escapeHtml(location.city)}</strong>.</p>
              <table cellpadding="6" style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #f8fafc; border-radius: 6px;">
                <tr><td style="color:#64748b;">Hospital:</td><td><strong>${escapeHtml(bloodRequest.hospitalName || "Regional Hospital")}</strong></td></tr>
                <tr><td style="color:#64748b;">Units:</td><td><strong>${bloodRequest.unitsRequired || 1} unit(s)</strong></td></tr>
                <tr><td style="color:#64748b;">Urgency:</td><td><strong style="color:#b91c1c;">${escapeHtml(bloodRequest.urgency || "NORMAL")}</strong></td></tr>
              </table>
              <p>If you are in good health and able to donate, please check the request details to respond.</p>
            `,
            actionUrl: requestUrl,
            actionText: "View Blood Request"
          },
          dedupKey: `blood_request_${bloodRequest._id}_${donor.userId}`
        });
      }
    } catch (err) {
      console.error("[DONOR TARGETING ERROR]", err.message);
    }
  }
}

