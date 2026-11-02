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
    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    rejectionReason: {
      type: String,
      default: null
    },
    licenseNumber: {
      type: String,
      trim: true,
      default: null
    },
    licenseExpiry: {
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
    },
    verificationDocuments: [
      {
        docType: { type: String, required: true },
        docName: { type: String, required: true },
        docUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    organizationAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// Method to sanitize organization data for public discovery without leaking private verification docs
organizationSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    isVerified: this.isVerified,
    verificationStatus: this.verificationStatus,
    contactEmail: this.contactEmail,
    phoneNumber: this.phoneNumber,
    address: this.address,
    createdAt: this.createdAt
  };
};

export const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
