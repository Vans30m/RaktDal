import { Notification } from "../models/Notification.js";
import { NotificationPreference } from "../models/NotificationPreference.js";
import { NotificationService } from "../services/notification.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

/**
 * Get current user's notifications (Paginated, supports filter by unread)
 * GET /api/v1/notifications
 */
export async function getMyNotifications(req, res) {
  try {
    const userId = req.user._id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const unreadOnly = req.query.unread === "true";

    const query = { userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const [items, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query)
    ]);

    return sendSuccess(res, {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, "Notifications retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Get count of unread notifications
 * GET /api/v1/notifications/unread-count
 */
export async function getUnreadCount(req, res) {
  try {
    const count = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false
    });
    return sendSuccess(res, { unreadCount: count }, "Unread notification count retrieved.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Mark a single notification as read
 * PATCH /api/v1/notifications/:notificationId/read
 */
export async function markAsRead(req, res) {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOne({
      _id: notificationId,
      userId: req.user._id
    });

    if (!notification) {
      return sendError(res, "Notification not found.", 404);
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return sendSuccess(res, { notification }, "Notification marked as read.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Mark all notifications as read for current user
 * PATCH /api/v1/notifications/read-all
 */
export async function markAllAsRead(req, res) {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return sendSuccess(res, { modifiedCount: result.modifiedCount }, "All notifications marked as read.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Delete a notification
 * DELETE /api/v1/notifications/:notificationId
 */
export async function deleteNotification(req, res) {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: req.user._id
    });

    if (!notification) {
      return sendError(res, "Notification not found.", 404);
    }

    return sendSuccess(res, null, "Notification deleted successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Get notification preferences
 * GET /api/v1/notifications/preferences
 */
export async function getPreferences(req, res) {
  try {
    const preferences = await NotificationService.getPreferences(req.user._id);
    return sendSuccess(res, { preferences }, "Preferences retrieved successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Update notification preferences
 * PATCH /api/v1/notifications/preferences
 */
export async function updatePreferences(req, res) {
  try {
    const { channels, categories } = req.body;
    const pref = await NotificationService.getPreferences(req.user._id);

    if (channels) {
      if (typeof channels.inApp === "boolean") pref.channels.inApp = channels.inApp;
      if (typeof channels.email === "boolean") pref.channels.email = channels.email;
      if (typeof channels.push === "boolean") pref.channels.push = channels.push;
    }

    if (categories) {
      if (typeof categories.bloodRequests === "boolean") pref.categories.bloodRequests = categories.bloodRequests;
      if (typeof categories.donorResponses === "boolean") pref.categories.donorResponses = categories.donorResponses;
      if (typeof categories.camps === "boolean") pref.categories.camps = categories.camps;
      if (typeof categories.organization === "boolean") pref.categories.organization = categories.organization;
    }

    await pref.save();
    return sendSuccess(res, { preferences: pref }, "Preferences updated successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Register FCM push token
 * POST /api/v1/notifications/push/subscribe
 */
export async function subscribePush(req, res) {
  try {
    const { token, deviceInfo } = req.body;
    if (!token || typeof token !== "string") {
      return sendError(res, "Valid push token is required.", 400);
    }

    const pref = await NotificationService.getPreferences(req.user._id);
    const existing = pref.fcmTokens.find(t => t.token === token);

    if (existing) {
      existing.lastUsedAt = new Date();
    } else {
      pref.fcmTokens.push({
        token,
        deviceInfo: deviceInfo || "Browser",
        subscribedAt: new Date(),
        lastUsedAt: new Date()
      });
    }

    pref.channels.push = true;
    await pref.save();

    return sendSuccess(res, null, "Device push subscription registered successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

/**
 * Unsubscribe FCM push token
 * DELETE /api/v1/notifications/push/unsubscribe
 */
export async function unsubscribePush(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return sendError(res, "Push token is required.", 400);
    }

    const pref = await NotificationService.getPreferences(req.user._id);
    pref.fcmTokens = pref.fcmTokens.filter(t => t.token !== token);
    if (pref.fcmTokens.length === 0) {
      pref.channels.push = false;
    }

    await pref.save();
    return sendSuccess(res, null, "Device push subscription removed successfully.");
  } catch (err) {
    return sendError(res, err.message, 500);
  }
}

