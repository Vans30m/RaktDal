import mongoose from "mongoose";

export const CAMP_STATUSES = [
  "DRAFT",
  "PENDING_APPROVAL",
  "PUBLISHED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "REJECTED"
];

const donationCampSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, "Camp title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"]
    },
    description: {
      type: String,
      required: [true, "Camp description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    organizerContactReference: {
      type: String,
      trim: true,
      default: null,
      select: false // Private organizer contact reference
    },
    venueName: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true
    },
    location: {
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        index: true
      },
      district: {
        type: String,
        trim: true,
        default: ""
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        index: true
      },
      pinCode: {
        type: String,
        required: [true, "PIN Code is required"],
        trim: true,
        match: [/^[1-9][0-9]{5}$/, "PIN code must be a valid 6-digit Indian postal code"],
        index: true
      }
    },
    startDate: {
      type: Date,
      required: [true, "Start date and time are required"],
      index: true
    },
    endDate: {
      type: Date,
      required: [true, "End date and time are required"]
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Registration deadline is required"]
    },
    capacity: {
      type: Number,
      required: [true, "Donor capacity is required"],
      min: [1, "Capacity must be at least 1 donor"],
      max: [5000, "Capacity cannot exceed 5000 donors"]
    },
    registrationCount: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: CAMP_STATUSES,
      default: "DRAFT",
      index: true
    },
    cancellationReason: {
      type: String,
      default: null
    },
    additionalInstructions: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },
    report: {
      totalRegistrations: { type: Number, default: 0 },
      totalAttendees: { type: Number, default: 0 },
      totalAbsentees: { type: Number, default: 0 },
      organizerReportedDonations: { type: Number, default: 0 },
      summary: { type: String, maxlength: 2000, default: "" },
      observations: { type: String, maxlength: 2000, default: "" },
      submittedAt: { type: Date, default: null }
    },
    isDemoCamp: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for public search and filtering
donationCampSchema.index({ "location.city": 1, status: 1, startDate: 1 });
donationCampSchema.index({ status: 1, startDate: 1 });
donationCampSchema.index({ organizationId: 1, status: 1 });

// Sanitize for public discovery (masks internal references & contact numbers)
donationCampSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    organizationId: this.organizationId,
    title: this.title,
    description: this.description,
    venueName: this.venueName,
    address: this.address,
    location: this.location,
    startDate: this.startDate,
    endDate: this.endDate,
    registrationDeadline: this.registrationDeadline,
    capacity: this.capacity,
    registrationCount: this.registrationCount,
    availableSlots: Math.max(0, this.capacity - this.registrationCount),
    status: this.status,
    additionalInstructions: this.additionalInstructions,
    report: this.status === "COMPLETED" ? this.report : undefined,
    isDemoCamp: this.isDemoCamp,
    createdAt: this.createdAt
  };
};

export const DonationCamp = mongoose.model("DonationCamp", donationCampSchema);
export default DonationCamp;
