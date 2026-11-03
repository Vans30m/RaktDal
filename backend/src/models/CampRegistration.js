import mongoose from "mongoose";

export const REGISTRATION_STATUSES = ["REGISTERED", "CANCELLED"];
export const ATTENDANCE_STATUSES = ["NOT_MARKED", "ATTENDED", "ABSENT"];

const campRegistrationSchema = new mongoose.Schema(
  {
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationCamp",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    registrationStatus: {
      type: String,
      enum: REGISTRATION_STATUSES,
      default: "REGISTERED",
      index: true
    },
    attendanceStatus: {
      type: String,
      enum: ATTENDANCE_STATUSES,
      default: "NOT_MARKED",
      index: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancellationReason: {
      type: String,
      default: null,
      maxlength: 300
    },
    checkInAt: {
      type: Date,
      default: null
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    notes: {
      type: String,
      maxlength: 500,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index ensuring a user cannot register twice for the same camp
campRegistrationSchema.index({ campId: 1, userId: 1 }, { unique: true });
campRegistrationSchema.index({ campId: 1, registrationStatus: 1, attendanceStatus: 1 });

export const CampRegistration = mongoose.model("CampRegistration", campRegistrationSchema);
export default CampRegistration;
