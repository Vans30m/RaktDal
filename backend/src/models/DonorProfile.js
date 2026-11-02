import mongoose from "mongoose";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const AVAILABILITY_STATUSES = ["AVAILABLE", "UNAVAILABLE"];
export const PREFERRED_CONTACT_METHODS = ["IN_APP", "EMAIL", "PHONE"];
export const PROFILE_STATUSES = ["ACTIVE", "INACTIVE"];

const consentAuditSchema = new mongoose.Schema(
  {
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    previousValues: {
      publicDiscoveryConsent: Boolean,
      notificationConsent: Boolean,
      contactSharingConsent: Boolean
    },
    newValues: {
      publicDiscoveryConsent: Boolean,
      notificationConsent: Boolean,
      contactSharingConsent: Boolean
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    }
  },
  { _id: false }
);

const donorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId reference is required"],
      unique: true,
      index: true
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: {
        values: BLOOD_GROUPS,
        message: "Invalid blood group. Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-"
      },
      index: true
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Donor must be at least 18 years old"],
      max: [65, "Donor age cannot exceed 65 years"]
    },
    location: {
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        minlength: [2, "City name must have at least 2 characters"],
        maxlength: [100, "City name cannot exceed 100 characters"],
        index: true
      },
      district: {
        type: String,
        required: [true, "District is required"],
        trim: true,
        maxlength: [100, "District cannot exceed 100 characters"]
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        maxlength: [100, "State cannot exceed 100 characters"]
      },
      pinCode: {
        type: String,
        required: [true, "PIN code is required"],
        trim: true,
        match: [/^[1-9][0-9]{5}$/, "PIN code must be a valid 6-digit Indian Postal Code"],
        index: true
      }
    },
    availabilityStatus: {
      type: String,
      enum: {
        values: AVAILABILITY_STATUSES,
        message: "Availability status must be AVAILABLE or UNAVAILABLE"
      },
      default: "AVAILABLE",
      index: true
    },
    lastDonationDate: {
      type: Date,
      default: null,
      select: false // Private by default; never exposed publicly
    },
    preferredContactMethod: {
      type: String,
      enum: {
        values: PREFERRED_CONTACT_METHODS,
        message: "Preferred contact method must be IN_APP, EMAIL, or PHONE"
      },
      default: "IN_APP"
    },
    notificationConsent: {
      type: Boolean,
      default: true
    },
    contactSharingConsent: {
      type: Boolean,
      default: false // NEVER automatically grant contact sharing consent
    },
    publicDiscoveryConsent: {
      type: Boolean,
      default: true,
      index: true
    },
    profileStatus: {
      type: String,
      enum: {
        values: PROFILE_STATUSES,
        message: "Profile status must be ACTIVE or INACTIVE"
      },
      default: "ACTIVE",
      index: true
    },
    consentAuditLog: {
      type: [consentAuditSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

/**
 * Compound indexes to support fast, targeted donor discovery queries
 */
// 1. Blood group + City filter for active, discoverable, available donors
donorProfileSchema.index({
  profileStatus: 1,
  publicDiscoveryConsent: 1,
  bloodGroup: 1,
  "location.city": 1,
  availabilityStatus: 1
});

// 2. Blood group + PIN code filter for active, discoverable, available donors
donorProfileSchema.index({
  profileStatus: 1,
  publicDiscoveryConsent: 1,
  bloodGroup: 1,
  "location.pinCode": 1,
  availabilityStatus: 1
});

// 3. City + PIN code general discovery index
donorProfileSchema.index({
  profileStatus: 1,
  publicDiscoveryConsent: 1,
  "location.city": 1,
  "location.pinCode": 1
});

/**
 * Strips private internal data and ensures only public-safe fields are returned for discovery
 */
donorProfileSchema.methods.toPublicDiscovery = function (userDoc = null) {
  const user = userDoc || (this.userId && typeof this.userId === "object" ? this.userId : null);

  const publicData = {
    id: this._id,
    bloodGroup: this.bloodGroup,
    age: this.age,
    location: {
      city: this.location.city,
      district: this.location.district,
      state: this.location.state,
      pinCode: this.location.pinCode
    },
    availabilityStatus: this.availabilityStatus,
    preferredContactMethod: this.preferredContactMethod,
    profileStatus: this.profileStatus,
    createdAt: this.createdAt
  };

  if (user) {
    publicData.donor = {
      fullName: user.fullName || "Volunteer Donor",
      profileImage: user.profileImage || null
    };

    // Only expose contact info if donor explicitly granted contactSharingConsent
    if (this.contactSharingConsent) {
      if (this.preferredContactMethod === "EMAIL" && user.email) {
        publicData.donor.email = user.email;
      }
      if (this.preferredContactMethod === "PHONE" && user.phoneNumber) {
        publicData.donor.phoneNumber = user.phoneNumber;
      }
    }
  }

  return publicData;
};

/**
 * Full donor profile payload returned only to the authenticated owner
 */
donorProfileSchema.methods.toOwnerProfile = function (userDoc = null) {
  const user = userDoc || (this.userId && typeof this.userId === "object" ? this.userId : null);

  return {
    id: this._id,
    userId: this.userId?._id || this.userId,
    bloodGroup: this.bloodGroup,
    age: this.age,
    location: {
      city: this.location.city,
      district: this.location.district,
      state: this.location.state,
      pinCode: this.location.pinCode
    },
    availabilityStatus: this.availabilityStatus,
    lastDonationDate: this.lastDonationDate,
    preferredContactMethod: this.preferredContactMethod,
    notificationConsent: this.notificationConsent,
    contactSharingConsent: this.contactSharingConsent,
    publicDiscoveryConsent: this.publicDiscoveryConsent,
    profileStatus: this.profileStatus,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    user: user
      ? {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profileImage: user.profileImage
        }
      : null
  };
};

export const DonorProfile = mongoose.model("DonorProfile", donorProfileSchema);

