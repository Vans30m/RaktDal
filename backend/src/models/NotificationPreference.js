import mongoose from "mongoose";

const notificationPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false }
    },
    categories: {
      bloodRequests: { type: Boolean, default: true },
      donorResponses: { type: Boolean, default: true },
      camps: { type: Boolean, default: true },
      organization: { type: Boolean, default: true }
    },
    fcmTokens: [
      {
        token: { type: String, required: true },
        deviceInfo: { type: String, default: "Browser" },
        subscribedAt: { type: Date, default: Date.now },
        lastUsedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const NotificationPreference = mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema
);
export default NotificationPreference;

