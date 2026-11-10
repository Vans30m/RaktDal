import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true
    },
    tokenFamilyId: {
      type: String,
      required: true,
      index: true
    },
    userAgent: {
      type: String,
      default: "Unknown Device"
    },
    ipAddress: {
      type: String,
      default: "Unknown IP"
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // Automatic cleanup of expired sessions via MongoDB TTL
    }
  },
  {
    timestamps: true
  }
);

export const Session = mongoose.model("Session", sessionSchema);
