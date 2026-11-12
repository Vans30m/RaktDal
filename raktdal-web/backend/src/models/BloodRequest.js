import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true
    },
    requesterType: {
      type: String,
      enum: ["INDIVIDUAL", "ORGANIZATION"],
      required: true,
      default: "INDIVIDUAL"
    },
    patientReference: {
      type: String,
      required: [true, "Patient reference identifier is required"],
      trim: true
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "Blood group is required"],
      index: true
    },
    component: {
      type: String,
      enum: ["WHOLE_BLOOD", "PACKED_RED_CELLS", "PLATELETS", "PLASMA", "CRYOPRECIPITATE"],
      default: "WHOLE_BLOOD",
      required: true
    },
    unitsRequired: {
      type: Number,
      required: [true, "Units required is required"],
      min: [1, "At least 1 unit is required"],
      max: [50, "Maximum 50 units per request"]
    },
    unitsFulfilled: {
      type: Number,
      default: 0,
      min: 0
    },
    hospitalName: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true
    },
    location: {
      city: { type: String, required: true, trim: true, index: true },
      district: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pinCode: { type: String, required: true, trim: true, index: true }
    },
    requiredBy: {
      type: Date,
      required: [true, "Required by deadline is required"],
      index: true
    },
    urgency: {
      type: String,
      enum: ["CRITICAL", "URGENT", "HIGH", "MEDIUM", "STANDARD", "LOW"],
      default: "STANDARD",
      index: true
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      trim: true
    },
    supportingDocuments: [
      {
        documentType: {
          type: String,
          enum: ["DOCTOR_PRESCRIPTION", "HOSPITAL_ADMISSION", "OTHER"],
          default: "DOCTOR_PRESCRIPTION"
        },
        fileUrl: { type: String },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: [
        "PENDING_VERIFICATION",
        "ACTIVE",
        "RESPONSES_RECEIVED",
        "FULFILLED",
        "CANCELLED",
        "EXPIRED",
        "REJECTED"
      ],
      default: "PENDING_VERIFICATION",
      index: true
    },
    verificationStatus: {
      status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
        index: true
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },
      reviewedAt: {
        type: Date,
        default: null
      },
      rejectionReason: {
        type: String,
        default: null
      },
      history: [
        {
          action: { type: String, required: true },
          performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          timestamp: { type: Date, default: Date.now },
          note: { type: String }
        }
      ]
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    isDemoRequest: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Method to return public safe profile without private medical details
bloodRequestSchema.methods.toPublicView = function () {
  const maskedPatientRef = this.patientReference
    ? this.patientReference.length > 4
      ? `${this.patientReference.substring(0, 2)}***${this.patientReference.slice(-2)}`
      : '***'
    : 'ANONYMOUS';

  return {
    id: this._id,
    _id: this._id,
    createdByUserId: this.createdByUserId,
    requestNumber: this.requestNumber,
    requesterType: this.requesterType,
    patientReference: maskedPatientRef,
    bloodGroup: this.bloodGroup,
    component: this.component,
    unitsRequired: this.unitsRequired,
    unitsFulfilled: this.unitsFulfilled,
    hospitalName: this.hospitalName,
    location: this.location,
    requiredBy: this.requiredBy,
    urgency: this.urgency,
    description: this.description,
    status: this.status,
    verificationStatus: this.verificationStatus?.status || this.verificationStatus,
    expiresAt: this.expiresAt,
    isDemoRequest: this.isDemoRequest,
    createdAt: this.createdAt
  };
};

export const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
export default BloodRequest;
