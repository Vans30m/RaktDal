import mongoose from "mongoose";

const requestResponseSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
      index: true
    },
    responderType: {
      type: String,
      enum: ["INDIVIDUAL_DONOR", "ORGANIZATION"],
      required: true
    },
    donorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true
    },
    status: {
      type: String,
      enum: ["ACCEPTED", "DECLINED", "WITHDRAWN"],
      default: "ACCEPTED",
      index: true
    },
    unitsOffered: {
      type: Number,
      default: 1,
      min: [1, "Units offered must be at least 1"]
    },
    contactSharingConsent: {
      type: Boolean,
      required: true,
      default: false
    },
    sharedContactInfo: {
      fullName: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true }
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      trim: true
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        reason: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate active responses from the same donor for the same request
requestResponseSchema.index(
  { requestId: 1, donorUserId: 1 },
  {
    unique: true,
    partialFilterExpression: { donorUserId: { $type: "objectId" } }
  }
);

// Compound index to prevent duplicate active responses from the same organization for the same request
requestResponseSchema.index(
  { requestId: 1, organizationId: 1 },
  {
    unique: true,
    partialFilterExpression: { organizationId: { $type: "objectId" } }
  }
);

export const RequestResponse = mongoose.model("RequestResponse", requestResponseSchema);
export default RequestResponse;
