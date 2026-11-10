import mongoose from "mongoose";

const fraudAlertSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: true,
      enum: ["USER", "ORGANIZATION", "BLOOD_REQUEST", "DONATION_CAMP", "INVENTORY"],
      index: true
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
      index: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["OPEN", "INVESTIGATING", "RESOLVED", "DISMISSED"],
      default: "OPEN",
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    resolutionNote: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

fraudAlertSchema.index({ status: 1, severity: 1, createdAt: -1 });

export const FraudAlert = mongoose.model("FraudAlert", fraudAlertSchema);
export default FraudAlert;
