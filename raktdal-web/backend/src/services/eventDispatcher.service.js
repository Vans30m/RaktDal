/**
 * Event Dispatcher Service for RaktDal
 *
 * Provides a clean decoupled interface for emitting application domain events
 * (e.g. blood request creation, responses, status transitions, fulfillment)
 * and dispatches notifications via NotificationService.
 */

import { NotificationService } from "./notification.service.js";

class EventDispatcher {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, handler) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(handler);
    return () => this.off(eventName, handler);
  }

  subscribe(eventName, handler) {
    return this.on(eventName, handler);
  }

  off(eventName, handler) {
    if (!this.listeners.has(eventName)) return;
    const handlers = this.listeners.get(eventName).filter(h => h !== handler);
    this.listeners.set(eventName, handlers);
  }

  async emit(eventName, eventData) {
    const timestamp = new Date().toISOString();
    console.log(`[DOMAIN EVENT: ${eventName}] ${timestamp}`, {
      eventId: eventData.id || eventData._id || "N/A",
      type: eventName,
      summary: eventData.summary || "Domain event triggered"
    });

    const handlers = [...(this.listeners.get(eventName) || [])];
    for (const handler of handlers) {
      try {
        await handler(eventData);
      } catch (err) {
        console.error(`Error in event listener for [${eventName}]:`, err.message);
      }
    }

    // Secondary Notification dispatch
    try {
      if (eventName === "blood_request.created" || eventName === "blood_request.approved") {
        if (eventData.bloodRequest && eventData.bloodRequest.status === "ACTIVE") {
          await NotificationService.notifyMatchingDonors(eventData.bloodRequest);
        }
      } else if (eventName === "request_response.submitted") {
        if (eventData.requesterUserId && eventData.response) {
          const donorName = eventData.response.sharedContactInfo?.fullName || "A volunteer donor";
          const donorPhone = eventData.response.sharedContactInfo?.phone;
          const donorEmail = eventData.response.sharedContactInfo?.email;
          const units = eventData.response.unitsOffered || 1;
          const contactSnippet = donorPhone ? ` Phone: ${donorPhone}.` : (donorEmail ? ` Email: ${donorEmail}.` : "");

          await NotificationService.notifyUser({
            userId: eventData.requesterUserId,
            type: "REQUEST_RESPONSE_RECEIVED",
            title: `🩸 Donor Response: ${donorName} offered ${units} Unit(s)`,
            message: `${donorName} is ready to donate ${units} unit(s) for your blood request (${eventData.bloodGroup || "blood"}).${contactSnippet} Click "View Request & Contact Donor" to see full details.`,
            relatedEntityType: "BloodRequest",
            relatedEntityId: eventData.requestId,
            metadata: {
              requestId: String(eventData.requestId),
              responseId: String(eventData.response._id),
              donorPhone: donorPhone || "",
              donorEmail: donorEmail || ""
            },
            priority: "HIGH"
          });
        }
      } else if (eventName === "camp.registered") {
        if (eventData.userId && eventData.campId) {
          const campTitle = eventData.campTitle || "Blood Donation Camp";
          const venue = eventData.venueName ? `${eventData.venueName}, ${eventData.address || ""}` : (eventData.address || "Camp Venue");
          const cityState = [eventData.city, eventData.state].filter(Boolean).join(", ");
          const slot = eventData.preferredSlot || "General / All day";
          const startDateStr = eventData.startDate ? new Date(eventData.startDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Scheduled date";

          const bodyHtml = `
            <p>Dear Volunteer,</p>
            <p>Thank you for registering to donate blood! Your registration for <strong>${campTitle}</strong> has been confirmed successfully.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 140px;">Camp:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${campTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Date & Time:</td>
                <td style="padding: 8px 0; color: #0f172a;">${startDateStr}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Venue:</td>
                <td style="padding: 8px 0; color: #0f172a;">${venue} ${cityState ? `(${cityState})` : ""}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Preferred Slot:</td>
                <td style="padding: 8px 0; color: #0f172a; text-transform: capitalize;">${slot}</td>
              </tr>
            </table>
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-top: 16px;">
              <p style="margin: 0; font-size: 13px; color: #166534;">
                <strong>Important Preparation Tips:</strong><br>
                • Get adequate rest and drink plenty of fluids prior to donating.<br>
                • Have a healthy meal within 2-3 hours before your slot.<br>
                • Please carry a government-issued photo ID.
              </p>
            </div>
          `;

          await NotificationService.notifyUser({
            userId: eventData.userId,
            type: "CAMP_REGISTRATION_CONFIRMED",
            title: `Camp Registration Confirmed: ${campTitle}`,
            message: `You are registered for ${campTitle} at ${venue} (${startDateStr}). Preferred slot: ${slot}.`,
            relatedEntityType: "DonationCamp",
            relatedEntityId: eventData.campId,
            priority: "HIGH",
            emailOptions: {
              subject: `Registration Confirmed: ${campTitle}`,
              subtitle: "Thank you for stepping up to save lives with RaktDal.",
              bodyHtml: bodyHtml,
              actionUrl: `/pages/camp-details.html?id=${eventData.campId}`,
              actionText: "View Camp Details",
              templateParams: {
                camp_title: campTitle,
                venue: venue,
                date_time: startDateStr,
                slot: slot,
                action_url: `${campTitle}`
              }
            }
          });
        }
      }
    } catch (notifErr) {
      console.error("[EVENT NOTIFICATION DISPATCH ERROR]", notifErr.message);
    }
  }

  async publish(eventName, eventData) {
    return this.emit(eventName, eventData);
  }
}

export const eventDispatcher = new EventDispatcher();

// Standard Domain Event Constants
export const DOMAIN_EVENTS = {
  REQUEST_CREATED: "blood_request.created",
  REQUEST_APPROVED: "blood_request.approved",
  REQUEST_REJECTED: "blood_request.rejected",
  REQUEST_STATUS_CHANGED: "blood_request.status_changed",
  REQUEST_FULFILLED: "blood_request.fulfilled",
  REQUEST_CANCELLED: "blood_request.cancelled",
  RESPONSE_SUBMITTED: "request_response.submitted",
  RESPONSE_STATUS_CHANGED: "request_response.status_changed"
};
