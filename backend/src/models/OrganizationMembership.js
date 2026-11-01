import mongoose from "mongoose";

const organizationMembershipSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    orgRole: {
      type: String,
      enum: ["OWNER", "ADMIN", "MANAGER", "STAFF"],
      default: "STAFF",
      required: true
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INVITED", "SUSPENDED"],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure unique membership per user per organization
organizationMembershipSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export const OrganizationMembership = mongoose.model(
  "OrganizationMembership",
  organizationMembershipSchema
);
