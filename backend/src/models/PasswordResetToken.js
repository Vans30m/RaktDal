import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    tokenHash: {
      type: String,
      required: true,
      index: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 5
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index to auto-remove expired tokens
    }
  },
  {
    timestamps: true
  }
);

export const PasswordResetToken = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
