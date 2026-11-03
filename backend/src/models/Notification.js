import mongoose from "mongoose";

export const NOTIFICATION_TYPES = [
  // Authentication & Account
  "ACCOUNT_CREATED",
  "ACCOUNT_UPDATED",
  "NEW_SESSION_ALERT",

  // Blood Requests
  "REQUEST_CREATED",
  "REQUEST_APPROVED",
  "REQUEST_REJECTED",
  "REQUEST_UPDATED",
  "REQUEST_CANCELLED",
  "REQUEST_RESPONSE_RECEIVED",
  "REQUEST_FULFILLED",
  "REQUEST_EXPIRED",

  // Donor Responses
  "DONOR_RESPONSE_ACCEPTED",
  "DONOR_RESPONSE_DECLINED",
  "DONOR_RESPONSE_WITHDRAWN",

  // Blood Banks & Inventory
  "INVENTORY_UPDATED",
  "INVENTORY_STALE_ALERT",

  // Organizations
  "ORGANIZATION_VERIFICATION_SUBMITTED",
  "ORGANIZATION_VERIFICATION_APPROVED",
  "ORGANIZATION_VERIFICATION_REJECTED",

  // Donation Camps
  "CAMP_PUBLISHED",
  "CAMP_REGISTRATION_CONFIRMED",
  "CAMP_REGISTRATION_CANCELLED",
  "CAMP_UPDATED",
  "CAMP_CANCELLED",
  "CAMP_REMINDER",
  "CAMP_COMPLETED"
];

export const NOTIFICATION_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: NOTIFICATION_TYPES,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    relatedEntityType: {
      type: String,
      enum: ["BloodRequest", "RequestResponse", "Organization", "DonationCamp", "User", null],
      default: null
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true
    },
    channels: {
      type: [
        {
          type: String,
          enum: ["IN_APP", "EMAIL", "PUSH"]
        }
      ],
      default: ["IN_APP"]
    },
    priority: {
      type: String,
      enum: NOTIFICATION_PRIORITIES,
      default: "NORMAL"
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for user querying, unread filters, and sorting
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
