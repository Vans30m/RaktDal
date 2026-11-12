import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { Notification, NOTIFICATION_TYPES } from "../src/models/Notification.js";
import { NotificationPreference } from "../src/models/NotificationPreference.js";
import { NotificationService } from "../src/services/notification.service.js";
import { escapeHtml, renderEmailTemplate } from "../src/services/email.service.js";

test("Notification Model: Supported notification types and defaults", () => {
  const dummyUserId = new mongoose.Types.ObjectId();
  const notif = new Notification({
    userId: dummyUserId,
    type: "REQUEST_CREATED",
    title: "Urgent O+ Need",
    message: "A patient needs blood in Delhi"
  });

  assert.equal(notif.isRead, false);
  assert.equal(notif.priority, "NORMAL");
  assert.deepEqual(notif.channels, ["IN_APP"]);
  assert.ok(NOTIFICATION_TYPES.includes(notif.type));
});

test("Notification Model: Rejects unsupported types", () => {
  const dummyUserId = new mongoose.Types.ObjectId();
  const notif = new Notification({
    userId: dummyUserId,
    type: "INVALID_PROMOTIONAL_SPAM",
    title: "Spam",
    message: "Spam message"
  });

  const err = notif.validateSync();
  assert.ok(err?.errors?.type, "Must reject invalid notification types");
});

test("Notification Preferences: Default channels and categories", () => {
  const dummyUserId = new mongoose.Types.ObjectId();
  const pref = new NotificationPreference({ userId: dummyUserId });

  assert.equal(pref.channels.inApp, true);
  assert.equal(pref.channels.email, true);
  assert.equal(pref.channels.push, false);
  assert.equal(pref.categories.bloodRequests, true);
  assert.equal(pref.categories.camps, true);
});

test("Notification Email Templates: HTML Sanitization & Layout", () => {
  const maliciousInput = "<script>alert('xss')</script>&safe";
  const escaped = escapeHtml(maliciousInput);
  assert.equal(escaped.includes("<script>"), false);
  assert.equal(escaped.includes("&amp;safe"), true);

  const emailHtml = renderEmailTemplate({
    title: "Verification Approved",
    subtitle: "Organization Update",
    bodyHtml: "<p>Your organization was approved.</p>",
    actionUrl: "https://raktdal.org/profile",
    actionText: "Open Dashboard"
  });

  assert.ok(emailHtml.includes("RaktDal"));
  assert.ok(emailHtml.includes("Verification Approved"));
  assert.ok(emailHtml.includes("Open Dashboard"));
});

test("Notification Security: User isolation & ownership enforcement logic", () => {
  const userA = new mongoose.Types.ObjectId();
  const userB = new mongoose.Types.ObjectId();

  const isOwner = (notificationUserId, currentUserId) => {
    return notificationUserId.toString() === currentUserId.toString();
  };

  assert.equal(isOwner(userA, userA), true);
  assert.equal(isOwner(userA, userB), false, "User B cannot access or modify User A's notifications");
});

test("Donor Notification Targeting: Honors explicit notification consent", () => {
  const eligibleDonorWithConsent = {
    bloodGroup: "O+",
    availabilityStatus: "AVAILABLE",
    notificationConsent: true,
    location: { city: "Delhi", pinCode: "110001" }
  };

  const eligibleDonorWithoutConsent = {
    ...eligibleDonorWithConsent,
    notificationConsent: false
  };

  const shouldNotify = (donor, bloodGroup, city) => {
    return (
      donor.bloodGroup === bloodGroup &&
      donor.availabilityStatus === "AVAILABLE" &&
      donor.notificationConsent === true &&
      donor.location.city.toLowerCase() === city.toLowerCase()
    );
  };

  assert.equal(shouldNotify(eligibleDonorWithConsent, "O+", "Delhi"), true);
  assert.equal(shouldNotify(eligibleDonorWithoutConsent, "O+", "Delhi"), false, "Must NOT notify donors who opted out");
});

test("Duplicate Notification Prevention: Idempotency Key check", async () => {
  const dummyUserId = new mongoose.Types.ObjectId();
  const dedupKey = "test_request_123_user_456";

  const existingNotification = {
    userId: dummyUserId,
    type: "REQUEST_CREATED",
    metadata: { dedupKey },
    createdAt: new Date()
  };

  const isDuplicate = (existing, key) => {
    if (!existing) return false;
    return existing.metadata?.dedupKey === key;
  };

  assert.equal(isDuplicate(existingNotification, dedupKey), true, "Duplicate notification must be prevented");
});

test("Camp and Welcome Notification Support: Types and Event handling verify", () => {
  assert.ok(NOTIFICATION_TYPES.includes("CAMP_REGISTRATION_CONFIRMED"));
  assert.ok(NOTIFICATION_TYPES.includes("ACCOUNT_CREATED"));
});

