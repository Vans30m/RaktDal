import express from "express";
import {
  authenticate,
  requireVerifiedOrganization,
  requireOrganizationAdmin
} from "../middleware/auth.middleware.js";
import {
  getCamps,
  getCampDetails,
  createCamp,
  getOrganizationCamps,
  publishCamp,
  registerForCamp,
  cancelMyRegistration,
  getMyRegistration,
  getMyRegistrationsList,
  getCampRegistrations,
  markAttendance,
  submitCampReport
} from "../controllers/camp.controller.js";

const router = express.Router();

// --- Public Discovery ---
router.get("/", getCamps);
router.get("/my-registrations", authenticate, getMyRegistrationsList);

// POST /api/v1/camps/seed - Seed sample camps if none exist (Development & Demo utility)
router.post("/seed", async (req, res) => {
  try {
    const { DonationCamp } = await import("../models/DonationCamp.js");
    const { Organization } = await import("../models/Organization.js");
    const { User } = await import("../models/User.js");

    let demoOrg = await Organization.findOne({ name: "Red Cross Blood Care Society" });
    if (!demoOrg) {
      let demoAdmin = await User.findOne({ email: "demouser@raktdal.org" });
      if (!demoAdmin) {
        demoAdmin = await User.create({
          fullName: "RaktDal Health Coordinator",
          email: "demouser@raktdal.org",
          platformRoles: ["USER"],
          isEmailVerified: true
        });
      }
      demoOrg = await Organization.create({
        name: "Red Cross Blood Care Society",
        type: "NGO",
        isVerified: true,
        verificationStatus: "APPROVED",
        verifiedAt: new Date(),
        contactEmail: "contact@redcrosscamps.org",
        phoneNumber: "+91 98765 43210",
        address: {
          street: "14 Sansad Marg",
          city: "New Delhi",
          state: "Delhi",
          pinCode: "110001"
        },
        organizationAdmins: [demoAdmin._id]
      });
    }

    const sampleCamps = [
      {
        title: "Rotary & Red Cross Community Blood Donation Camp",
        description: "Join us in saving lives! Clean, hygienic donation stations set up with certified medical professionals. Donors will receive certificates and refreshments.",
        venueName: "Community Center Hall, Sector 17",
        address: "Sector 17 Plaza, Near Fountain",
        location: { city: "Chandigarh", state: "Punjab", pinCode: "160017" },
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000),
        capacity: 100,
        registrationCount: 18,
        status: "PUBLISHED",
        additionalInstructions: "Please carry a valid government photo ID (Aadhaar / Voter ID / Driving License) and ensure you are well hydrated."
      },
      {
        title: "Youth Lifesavers Blood Drive - Delhi University",
        description: "Annual voluntary blood donation drive organized in association with Rotary Blood Bank. Dedicated team of AIIMS doctors on site.",
        venueName: "North Campus Sports Complex",
        address: "University Enclave, North Campus",
        location: { city: "Delhi", state: "Delhi", pinCode: "110007" },
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
        registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        capacity: 150,
        registrationCount: 42,
        status: "PUBLISHED",
        additionalInstructions: "Age 18-65 and weight > 45kg required. Donor refreshments and digital donor badges provided."
      },
      {
        title: "Apollo Metro Blood Drive & Health Camp",
        description: "Community blood drive and complimentary basic health screening (hemoglobin, BP, blood group typing) for all donors.",
        venueName: "Apollo Hospital Auditorium",
        address: "Mathura Road, Sarita Vihar",
        location: { city: "Delhi", state: "Delhi", pinCode: "110076" },
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
        registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        capacity: 80,
        registrationCount: 15,
        status: "PUBLISHED",
        additionalInstructions: "Free hemoglobin and blood typing test for all volunteer participants."
      }
    ];

    let createdCount = 0;
    for (const sc of sampleCamps) {
      const exists = await DonationCamp.findOne({ title: sc.title });
      if (!exists) {
        await DonationCamp.create({
          ...sc,
          organizationId: demoOrg._id
        });
        createdCount++;
      }
    }

    return res.json({ success: true, message: `Successfully seeded ${createdCount} camps.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:campId", getCampDetails);

// --- User Camp Registrations ---
router.post("/:campId/register", authenticate, registerForCamp);
router.delete("/:campId/register", authenticate, cancelMyRegistration);
router.get("/:campId/registrations/me", authenticate, getMyRegistration);

// --- Organization Camp Management ---
router.post(
  "/organizations/:organizationId/camps",
  authenticate,
  requireOrganizationAdmin(req => req.params.organizationId),
  createCamp
);

router.get(
  "/organizations/:organizationId/camps",
  authenticate,
  requireOrganizationAdmin(req => req.params.organizationId),
  getOrganizationCamps
);

router.post("/:campId/publish", authenticate, publishCamp);
router.get("/:campId/registrations", authenticate, getCampRegistrations);
router.patch("/:campId/registrations/:registrationId/attendance", authenticate, markAttendance);
router.post("/:campId/report", authenticate, submitCampReport);

export default router;

