import { DonationCamp } from "../models/DonationCamp.js";
import { CampRegistration } from "../models/CampRegistration.js";
import { Organization } from "../models/Organization.js";
import { eventDispatcher } from "./eventDispatcher.service.js";

export class CampService {
  /**
   * Search and filter published camps for public visitors
   */
  static async searchPublishedCamps({
    city,
    state,
    pinCode,
    status,
    startDate,
    page = 1,
    limit = 20
  }) {
    const query = {};

    if (status && status !== "ALL") {
      query.status = status;
    } else {
      query.status = { $in: ["PUBLISHED", "ONGOING", "COMPLETED"] };
    }

    if (city) {
      query["location.city"] = new RegExp(`^${city.trim()}$`, "i");
    }
    if (state) {
      query["location.state"] = new RegExp(`^${state.trim()}$`, "i");
    }
    if (pinCode) {
      query["location.pinCode"] = pinCode.trim();
    }
    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }

    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 20));

    const [camps, total] = await Promise.all([
      DonationCamp.find(query)
        .populate("organizationId", "name type isVerified contactEmail phoneNumber")
        .sort({ startDate: 1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      DonationCamp.countDocuments(query)
    ]);

    const sanitized = camps.map(camp => {
      const publicData = camp.toPublicProfile();
      if (camp.organizationId) {
        publicData.organizer = {
          name: camp.organizationId.name,
          type: camp.organizationId.type,
          isVerified: camp.organizationId.isVerified
        };
      }
      return publicData;
    });

    return {
      camps: sanitized,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  /**
   * Get single camp details by ID
   */
  static async getCampById(campId) {
    const camp = await DonationCamp.findById(campId).populate(
      "organizationId",
      "name type isVerified contactEmail phoneNumber"
    );
    if (!camp) return null;

    const publicData = camp.toPublicProfile();
    if (camp.organizationId) {
      publicData.organizer = {
        name: camp.organizationId.name,
        type: camp.organizationId.type,
        isVerified: camp.organizationId.isVerified
      };
    }
    return publicData;
  }

  /**
   * Create a new Donation Camp draft
   */
  static async createCamp(organizationId, campData, creatorUserId) {
    const org = await Organization.findById(organizationId);
    if (!org) {
      throw new Error("Organization not found.");
    }

    const isOrgAdmin = org.organizationAdmins?.some(
      id => id.toString() === creatorUserId.toString()
    );
    if (!isOrgAdmin) {
      throw new Error("Access denied. You are not an authorized Organization ADMIN.");
    }

    // Validate dates
    const start = new Date(campData.startDate);
    const end = new Date(campData.endDate);
    const deadline = new Date(campData.registrationDeadline);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(deadline.getTime())) {
      throw new Error("Invalid dates provided.");
    }
    if (start >= end) {
      throw new Error("Camp end date must be strictly after the start date.");
    }
    if (deadline > end) {
      throw new Error("Registration deadline cannot be after the camp ends.");
    }

    const camp = await DonationCamp.create({
      ...campData,
      organizationId,
      status: "DRAFT"
    });

    return camp;
  }

  /**
   * Publish a Donation Camp
   * Enforces verified organization constraint and valid forward dates
   */
  static async publishCamp(campId, user) {
    const camp = await DonationCamp.findById(campId);
    if (!camp) {
      throw new Error("Camp not found.");
    }

    const org = await Organization.findById(camp.organizationId);
    if (!org) {
      throw new Error("Organizer organization not found.");
    }

    // Platform ADMIN or Organization ADMIN
    const isPlatformAdmin = user.platformRoles?.includes("ADMIN");
    const isOrgAdmin = org.organizationAdmins?.some(
      id => id.toString() === user._id.toString()
    );

    if (!isPlatformAdmin && !isOrgAdmin) {
      throw new Error("Access denied. Unauthorized to publish this camp.");
    }

    if (!org.isVerified) {
      throw new Error("Pending or unverified organizations cannot publish donation camps.");
    }

    if (new Date() >= new Date(camp.endDate)) {
      throw new Error("Cannot publish a camp whose end date has already passed.");
    }

    camp.status = "PUBLISHED";
    await camp.save();

    await eventDispatcher.emit("camp.published", {
      campId: camp._id,
      title: camp.title,
      location: camp.location,
      startDate: camp.startDate
    });

    return camp;
  }

  /**
   * Atomic user registration with capacity concurrency protection
   */
  static async registerUserForCamp(campId, userId, registrationData = {}) {
    const camp = await DonationCamp.findById(campId);
    if (!camp) {
      throw new Error("Camp not found.");
    }

    if (camp.status !== "PUBLISHED" && camp.status !== "ONGOING") {
      throw new Error(`Camp is not open for registration (Current status: ${camp.status}).`);
    }

    if (new Date() > new Date(camp.registrationDeadline)) {
      throw new Error("Registration deadline for this camp has passed.");
    }

    const { donorName, donorPhone, bloodGroup, preferredSlot, notes } = registrationData;

    // Check existing registration
    const existing = await CampRegistration.findOne({ campId, userId });
    if (existing) {
      if (existing.registrationStatus === "REGISTERED") {
        throw new Error("You are already registered for this donation camp.");
      }
      // Re-activating previously cancelled registration
      const updatedCamp = await DonationCamp.findOneAndUpdate(
        { _id: campId, $expr: { $lt: ["$registrationCount", "$capacity"] } },
        { $inc: { registrationCount: 1 } },
        { new: true }
      );
      if (!updatedCamp) {
        throw new Error("Donation camp has reached maximum capacity.");
      }

      existing.registrationStatus = "REGISTERED";
      existing.attendanceStatus = "NOT_MARKED";
      existing.registeredAt = new Date();
      existing.cancelledAt = null;
      if (donorName) existing.donorName = donorName;
      if (donorPhone) existing.donorPhone = donorPhone;
      if (bloodGroup) existing.bloodGroup = bloodGroup;
      if (preferredSlot) existing.preferredSlot = preferredSlot;
      if (notes) existing.notes = notes;
      await existing.save();

      return existing;
    }

    // Concurrency safe conditional capacity increment
    const updatedCamp = await DonationCamp.findOneAndUpdate(
      { _id: campId, $expr: { $lt: ["$registrationCount", "$capacity"] } },
      { $inc: { registrationCount: 1 } },
      { new: true }
    );

    if (!updatedCamp) {
      throw new Error("Donation camp has reached maximum capacity.");
    }

    try {
      const registration = await CampRegistration.create({
        campId,
        userId,
        registrationStatus: "REGISTERED",
        attendanceStatus: "NOT_MARKED",
        donorName: donorName || null,
        donorPhone: donorPhone || null,
        bloodGroup: bloodGroup || null,
        preferredSlot: preferredSlot || null,
        notes: notes || ""
      });

      await eventDispatcher.emit("camp.registered", {
        campId,
        userId,
        campTitle: camp.title,
        venueName: camp.venueName,
        address: camp.address,
        city: camp.location?.city,
        state: camp.location?.state,
        pinCode: camp.location?.pinCode,
        startDate: camp.startDate,
        endDate: camp.endDate,
        preferredSlot: preferredSlot || "All-day",
        donorName: donorName || null,
        bloodGroup: bloodGroup || null
      });

      return registration;
    } catch (err) {
      // Rollback increment if duplicate constraint violated
      await DonationCamp.findByIdAndUpdate(campId, { $inc: { registrationCount: -1 } });
      throw err;
    }
  }

  /**
   * Cancel own registration safely
   */
  static async cancelRegistration(campId, userId, reason = null) {
    const registration = await CampRegistration.findOne({ campId, userId });
    if (!registration || registration.registrationStatus !== "REGISTERED") {
      throw new Error("No active registration found for this camp.");
    }

    registration.registrationStatus = "CANCELLED";
    registration.cancelledAt = new Date();
    registration.cancellationReason = reason;
    await registration.save();

    await DonationCamp.findByIdAndUpdate(campId, {
      $inc: { registrationCount: -1 }
    });

    return registration;
  }

  /**
   * Organizer marks attendance
   */
  static async markAttendance({ campId, registrationId, status, organizerUser }) {
    if (!["ATTENDED", "ABSENT", "NOT_MARKED"].includes(status)) {
      throw new Error("Invalid attendance status. Must be ATTENDED, ABSENT, or NOT_MARKED.");
    }

    const registration = await CampRegistration.findOne({ _id: registrationId, campId });
    if (!registration) {
      throw new Error("Registration record not found.");
    }

    registration.attendanceStatus = status;
    if (status === "ATTENDED") {
      registration.checkInAt = new Date();
      registration.checkedInBy = organizerUser._id;
    }

    await registration.save();
    return registration;
  }

  /**
   * Organizer submits post-camp completion report
   */
  static async submitCampReport(campId, reportData, organizerUser) {
    const camp = await DonationCamp.findById(campId);
    if (!camp) {
      throw new Error("Camp not found.");
    }

    const {
      totalRegistrations,
      totalAttendees,
      totalAbsentees,
      organizerReportedDonations,
      summary,
      observations
    } = reportData;

    camp.report = {
      totalRegistrations: Number(totalRegistrations) || 0,
      totalAttendees: Number(totalAttendees) || 0,
      totalAbsentees: Number(totalAbsentees) || 0,
      organizerReportedDonations: Number(organizerReportedDonations) || 0,
      summary: summary || "",
      observations: observations || "",
      submittedAt: new Date()
    };

    camp.status = "COMPLETED";
    await camp.save();

    return camp;
  }
}

