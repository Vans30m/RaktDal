import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    passwordHash: {
      type: String,
      default: null,
      select: false
    },
    emailVerifiedAt: {
      type: Date,
      default: null
    },
    googleSubject: {
      type: String,
      default: null,
      sparse: true,
      index: true
    },
    profileImage: {
      type: String,
      default: null
    },
    phoneNumber: {
      type: String,
      default: null,
      trim: true
    },
    platformRoles: {
      type: [String],
      enum: ["USER", "ADMIN"],
      default: ["USER"]
    },

    accountStatus: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "DEACTIVATED"],
      default: "ACTIVE",
      index: true
    },
    preferredLanguage: {
      type: String,
      default: "en",
      trim: true
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    },
    isDemoAccount: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    profileImage: this.profileImage,
    platformRoles: this.platformRoles,
    accountStatus: this.accountStatus,
    preferredLanguage: this.preferredLanguage,
    emailVerifiedAt: this.emailVerifiedAt,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt
  };
};

export const User = mongoose.model("User", userSchema);
export default User;
