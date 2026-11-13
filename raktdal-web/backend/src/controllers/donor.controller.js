import {
  DonorProfile,
  BLOOD_GROUPS,
  AVAILABILITY_STATUSES,
  PREFERRED_CONTACT_METHODS,
  PROFILE_STATUSES
} from "../models/DonorProfile.js";
import { User } from "../models/User.js";

const PIN_CODE_REGEX = /^[1-9][0-9]{5}$/;

/**
 * Validates and sanitizes location payload
 */
function validateLocation(location) {
  if (!location || typeof location !== "object") {
    return { valid: false, message: "Location object is required." };
  }
  const { city, district, state, pinCode } = location;

  if (!city || typeof city !== "string" || city.trim().length < 2 || city.trim().length > 100) {
    return { valid: false, message: "City is required (2-100 characters)." };
  }
  if (!district || typeof district !== "string" || !district.trim() || district.trim().length > 100) {
    return { valid: false, message: "District is required." };
  }
  if (!state || typeof state !== "string" || !state.trim() || state.trim().length > 100) {
    return { valid: false, message: "State is required." };
  }
  if (!pinCode || typeof pinCode !== "string" || !PIN_CODE_REGEX.test(pinCode.trim())) {
    return { valid: false, message: "PIN code must be a valid 6-digit Indian Postal Code." };
  }

  return {
    valid: true,
    sanitized: {
      city: city.trim(),
      district: district.trim(),
      state: state.trim(),
      pinCode: pinCode.trim()
    }
  };
}

/**
 * 1. Create Donor Profile
 * POST /api/v1/donors/profile
 */
export async function createDonorProfile(req, res) {
  try {
    const userId = req.user._id;
    const {
      bloodGroup,
      age,
      location,
      availabilityStatus,
      lastDonationDate,
      preferredContactMethod,
      notificationConsent,
      contactSharingConsent,
      publicDiscoveryConsent
    } = req.body || {};

    // 1. Validate bloodGroup first
    if (!bloodGroup || !BLOOD_GROUPS.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: `Invalid blood group. Supported values: ${BLOOD_GROUPS.join(", ")}`
      });
    }

    // 2. Validate age (18 - 65)
    const numAge = Number(age);
    if (!age || Number.isNaN(numAge) || numAge < 18 || numAge > 65) {
      return res.status(400).json({
        success: false,
        message: "Age is required and must be between 18 and 65 years."
      });
    }

    // 3. Validate location
    const locValidation = validateLocation(location);
    if (!locValidation.valid) {
      return res.status(400).json({
        success: false,
        message: locValidation.message
      });
    }

    // 4. Validate preferredContactMethod
    const contactMethod = preferredContactMethod || "IN_APP";
    if (!PREFERRED_CONTACT_METHODS.includes(contactMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid preferred contact method. Supported: ${PREFERRED_CONTACT_METHODS.join(", ")}`
      });
    }

    // 5. Validate availabilityStatus
    const status = availabilityStatus || "AVAILABLE";
    if (!AVAILABILITY_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid availability status. Supported: ${AVAILABILITY_STATUSES.join(", ")}`
      });
    }

    // 6. Optional lastDonationDate parsing & validation
    let parsedLastDonationDate = null;
    if (lastDonationDate) {
      const d = new Date(lastDonationDate);
      if (Number.isNaN(d.getTime()) || d > new Date()) {
        return res.status(400).json({
          success: false,
          message: "lastDonationDate must be a valid past date."
        });
      }
      parsedLastDonationDate = d;
    }

    // One donor profile per user constraint
    const existing = await DonorProfile.findOne({ userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A donor profile already exists for this account.",
        error: { code: "PROFILE_ALREADY_EXISTS" }
      });
    }

    // Explicit consents (Never automatically grant contactSharingConsent)
    const notifConsent = notificationConsent !== undefined ? Boolean(notificationConsent) : true;
    const contactConsent = contactSharingConsent !== undefined ? Boolean(contactSharingConsent) : false;
    const discoveryConsent = publicDiscoveryConsent !== undefined ? Boolean(publicDiscoveryConsent) : true;

    const initialAudit = {
      changedAt: new Date(),
      changedBy: userId,
      previousValues: {
        publicDiscoveryConsent: false,
        notificationConsent: false,
        contactSharingConsent: false
      },
      newValues: {
        publicDiscoveryConsent: discoveryConsent,
        notificationConsent: notifConsent,
        contactSharingConsent: contactConsent
      },
      ipAddress: req.ip || req.headers["x-forwarded-for"] || null,
      userAgent: req.headers["user-agent"] || null
    };

    const newProfile = await DonorProfile.create({
      userId,
      bloodGroup,
      age: numAge,
      location: locValidation.sanitized,
      availabilityStatus: status,
      lastDonationDate: parsedLastDonationDate,
      preferredContactMethod: contactMethod,
      notificationConsent: notifConsent,
      contactSharingConsent: contactConsent,
      publicDiscoveryConsent: discoveryConsent,
      profileStatus: "ACTIVE",
      consentAuditLog: [initialAudit]
    });

    return res.status(201).json({
      success: true,
      message: "Donor profile created successfully.",
      data: {
        donor: newProfile.toOwnerProfile(req.user)
      }
    });
  } catch (err) {
    console.error("Create donor profile error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create donor profile."
    });
  }
}

/**
 * 2. Get Current Authenticated Donor Profile
 * GET /api/v1/donors/me
 */
export async function getMyDonorProfile(req, res) {
  try {
    const profile = await DonorProfile.findOne({ userId: req.user._id }).select("+lastDonationDate");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No donor profile found for this user.",
        error: { code: "PROFILE_NOT_FOUND" }
      });
    }

    return res.json({
      success: true,
      data: {
        donor: profile.toOwnerProfile(req.user)
      }
    });
  } catch (err) {
    console.error("Get my donor profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve donor profile."
    });
  }
}

/**
 * 3. Update Donor Profile (Protected against userId / roles manipulation)
 * PATCH /api/v1/donors/me
 */
export async function updateMyDonorProfile(req, res) {
  try {
    const profile = await DonorProfile.findOne({ userId: req.user._id }).select("+lastDonationDate");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No donor profile found to update.",
        error: { code: "PROFILE_NOT_FOUND" }
      });
    }

    const {
      bloodGroup,
      age,
      location,
      lastDonationDate,
      preferredContactMethod,
      profileStatus
    } = req.body || {};

    if (bloodGroup !== undefined) {
      if (!BLOOD_GROUPS.includes(bloodGroup)) {
        return res.status(400).json({
          success: false,
          message: `Invalid blood group. Supported values: ${BLOOD_GROUPS.join(", ")}`
        });
      }
      profile.bloodGroup = bloodGroup;
    }

    if (age !== undefined) {
      const numAge = Number(age);
      if (Number.isNaN(numAge) || numAge < 18 || numAge > 65) {
        return res.status(400).json({
          success: false,
          message: "Age must be between 18 and 65 years."
        });
      }
      profile.age = numAge;
    }

    if (location !== undefined) {
      const locValidation = validateLocation(location);
      if (!locValidation.valid) {
        return res.status(400).json({
          success: false,
          message: locValidation.message
        });
      }
      profile.location = locValidation.sanitized;
    }

    if (lastDonationDate !== undefined) {
      if (lastDonationDate === null || lastDonationDate === "") {
        profile.lastDonationDate = null;
      } else {
        const d = new Date(lastDonationDate);
        if (Number.isNaN(d.getTime()) || d > new Date()) {
          return res.status(400).json({
            success: false,
            message: "lastDonationDate must be a valid past date."
          });
        }
        profile.lastDonationDate = d;
      }
    }

    if (preferredContactMethod !== undefined) {
      if (!PREFERRED_CONTACT_METHODS.includes(preferredContactMethod)) {
        return res.status(400).json({
          success: false,
          message: `Invalid preferred contact method. Supported: ${PREFERRED_CONTACT_METHODS.join(", ")}`
        });
      }
      profile.preferredContactMethod = preferredContactMethod;
    }

    if (profileStatus !== undefined) {
      if (!PROFILE_STATUSES.includes(profileStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid profile status. Supported: ${PROFILE_STATUSES.join(", ")}`
        });
      }
      profile.profileStatus = profileStatus;
    }

    await profile.save();

    return res.json({
      success: true,
      message: "Donor profile updated successfully.",
      data: {
        donor: profile.toOwnerProfile(req.user)
      }
    });
  } catch (err) {
    console.error("Update donor profile error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update donor profile."
    });
  }
}

/**
 * 4. Toggle / Update Availability Status
 * PATCH /api/v1/donors/me/availability
 */
export async function updateMyAvailability(req, res) {
  try {
    const { availabilityStatus } = req.body || {};

    if (!availabilityStatus || !AVAILABILITY_STATUSES.includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message: `availabilityStatus is required and must be either 'AVAILABLE' or 'UNAVAILABLE'.`
      });
    }

    const profile = await DonorProfile.findOne({ userId: req.user._id }).select("+lastDonationDate");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No donor profile found.",
        error: { code: "PROFILE_NOT_FOUND" }
      });
    }

    profile.availabilityStatus = availabilityStatus;
    await profile.save();

    return res.json({
      success: true,
      message: `Availability updated to ${availabilityStatus}.`,
      data: {
        availabilityStatus: profile.availabilityStatus,
        donor: profile.toOwnerProfile(req.user)
      }
    });
  } catch (err) {
    console.error("Update availability error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update donor availability."
    });
  }
}

/**
 * 5. Update Donor Consents with Audit History
 * PATCH /api/v1/donors/me/consent
 */
export async function updateMyConsent(req, res) {
  try {
    const { notificationConsent, contactSharingConsent, publicDiscoveryConsent } = req.body || {};

    if (
      notificationConsent === undefined &&
      contactSharingConsent === undefined &&
      publicDiscoveryConsent === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one consent parameter (notificationConsent, contactSharingConsent, publicDiscoveryConsent) is required."
      });
    }

    const profile = await DonorProfile.findOne({ userId: req.user._id }).select("+lastDonationDate");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No donor profile found.",
        error: { code: "PROFILE_NOT_FOUND" }
      });
    }

    const previousValues = {
      notificationConsent: profile.notificationConsent,
      contactSharingConsent: profile.contactSharingConsent,
      publicDiscoveryConsent: profile.publicDiscoveryConsent
    };

    if (notificationConsent !== undefined) {
      profile.notificationConsent = Boolean(notificationConsent);
    }
    if (contactSharingConsent !== undefined) {
      profile.contactSharingConsent = Boolean(contactSharingConsent);
    }
    if (publicDiscoveryConsent !== undefined) {
      profile.publicDiscoveryConsent = Boolean(publicDiscoveryConsent);
    }

    const newValues = {
      notificationConsent: profile.notificationConsent,
      contactSharingConsent: profile.contactSharingConsent,
      publicDiscoveryConsent: profile.publicDiscoveryConsent
    };

    // Maintain secure audit log for consent tracking
    profile.consentAuditLog.push({
      changedAt: new Date(),
      changedBy: req.user._id,
      previousValues,
      newValues,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || null,
      userAgent: req.headers["user-agent"] || null
    });

    await profile.save();

    return res.json({
      success: true,
      message: "Donor consents updated successfully.",
      data: {
        notificationConsent: profile.notificationConsent,
        contactSharingConsent: profile.contactSharingConsent,
        publicDiscoveryConsent: profile.publicDiscoveryConsent,
        donor: profile.toOwnerProfile(req.user)
      }
    });
  } catch (err) {
    console.error("Update consent error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update donor consents."
    });
  }
}

/**
 * 6. Public Donor Discovery & Search API
 * GET /api/v1/donors/search
 *
 * Query params:
 * - bloodGroup
 * - city
 * - pinCode
 * - availabilityStatus
 * - page
 * - limit
 */
export async function searchDonors(req, res) {
  try {
    const { bloodGroup, city, state, pinCode, availabilityStatus, page = 1, limit = 10 } = req.query;

    // Strict NoSQL injection defense: ensure all query inputs are strictly primitive strings
    const filter = {
      profileStatus: "ACTIVE",
      publicDiscoveryConsent: true // ONLY show donors who consented to public discovery
    };

    // If caller explicitly asks to exclude current user, exclude them (otherwise donors can see their own listing in directory)
    if (req.user?._id && req.query.excludeSelf === "true") {
      filter.userId = { $ne: req.user._id };
    }

    // Validate & apply bloodGroup filter
    if (bloodGroup) {
      if (typeof bloodGroup !== "string" || !BLOOD_GROUPS.includes(bloodGroup.trim())) {
        return res.status(400).json({
          success: false,
          message: `Invalid blood group filter. Supported values: ${BLOOD_GROUPS.join(", ")}`
        });
      }
      filter.bloodGroup = bloodGroup.trim();
    }

    // Validate & apply city filter (case-insensitive substring or match)
    if (city) {
      if (typeof city !== "string" || city.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "City filter must be a valid string."
        });
      }
      // Sanitized escaped regex for flexible search
      const escapedCity = city.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter["location.city"] = new RegExp(escapedCity, "i");
    }

    // Validate & apply state filter (case-insensitive substring or match)
    if (state) {
      if (typeof state !== "string" || state.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "State filter must be a valid string."
        });
      }
      const escapedState = state.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter["location.state"] = new RegExp(escapedState, "i");
    }

    // Validate & apply pinCode filter
    if (pinCode) {
      if (typeof pinCode !== "string" || !PIN_CODE_REGEX.test(pinCode.trim())) {
        return res.status(400).json({
          success: false,
          message: "PIN code must be a valid 6-digit Indian Postal Code."
        });
      }
      filter["location.pinCode"] = pinCode.trim();
    }

    // Validate & apply availabilityStatus filter
    if (availabilityStatus) {
      if (typeof availabilityStatus !== "string" || !AVAILABILITY_STATUSES.includes(availabilityStatus.trim())) {
        return res.status(400).json({
          success: false,
          message: `availabilityStatus filter must be one of: ${AVAILABILITY_STATUSES.join(", ")}`
        });
      }
      filter.availabilityStatus = availabilityStatus.trim();
    }

    // Pagination validation
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (parsedPage - 1) * parsedLimit;

    // Query with projection and population
    const [donors, total] = await Promise.all([
      DonorProfile.find(filter)
        .populate("userId", "fullName profileImage email phoneNumber")
        .sort({ availabilityStatus: 1, createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      DonorProfile.countDocuments(filter)
    ]);

    // Format public-safe responses (stripping private data, lastDonationDate, and unconsented contact details)
    const sanitizedDonors = donors.map((doc) => {
      const publicItem = {
        id: doc._id,
        bloodGroup: doc.bloodGroup,
        age: doc.age,
        location: {
          city: doc.location.city,
          district: doc.location.district,
          state: doc.location.state,
          pinCode: doc.location.pinCode
        },
        availabilityStatus: doc.availabilityStatus,
        preferredContactMethod: doc.preferredContactMethod,
        profileStatus: doc.profileStatus,
        createdAt: doc.createdAt
      };

      if (doc.userId && typeof doc.userId === "object") {
        publicItem.userId = doc.userId._id;
        publicItem.donor = {
          fullName: doc.userId.fullName || "Volunteer Donor",
          profileImage: doc.userId.profileImage || null
        };

        // Only share contact details if donor gave explicit consent
        if (doc.contactSharingConsent) {
          if (doc.preferredContactMethod === "EMAIL" && doc.userId.email) {
            publicItem.donor.email = doc.userId.email;
          }
          if (doc.preferredContactMethod === "PHONE" && doc.userId.phoneNumber) {
            publicItem.donor.phoneNumber = doc.userId.phoneNumber;
          }
        }
      }

      return publicItem;
    });

    const totalPages = Math.ceil(total / parsedLimit);

    return res.json({
      success: true,
      data: {
        donors: sanitizedDonors,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages,
          hasNextPage: parsedPage < totalPages,
          hasPrevPage: parsedPage > 1
        }
      }
    });
  } catch (err) {
    console.error("Search donors error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to search donors."
    });
  }
}
