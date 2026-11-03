import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getPreferences,
  updatePreferences,
  subscribePush,
  unsubscribePush
} from "../controllers/notification.controller.js";

const router = express.Router();

// All notification routes require authenticated user
router.use(authenticate);

// In-app notifications
router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:notificationId/read", markAsRead);
router.delete("/:notificationId", deleteNotification);

// Notification preferences
router.get("/preferences", getPreferences);
router.patch("/preferences", updatePreferences);

// FCM Push subscriptions
router.post("/push/subscribe", subscribePush);
router.delete("/push/unsubscribe", unsubscribePush);

export default router;

