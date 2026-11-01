import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true
    },
    type: {
      type: String,
      enum: ["BLOOD_BANK", "HOSPITAL", "NGO", "COMMUNITY"],
      default: "BLOOD_BANK"
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    address: {
      city: String,
      state: String,
      pincode: String
    }
  },
  {
    timestamps: true
  }
);

export const Organization = mongoose.model("Organization", organizationSchema);
