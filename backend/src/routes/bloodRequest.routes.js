/**
 * Blood Request Routes
 *
 * Endpoints:
 *   POST   /api/v1/requests                    - Create blood request
 *   GET    /api/v1/requests                    - List / discover blood requests (public / filtered)
 *   GET    /api/v1/requests/my                 - Get current user's submitted requests
 *   GET    /api/v1/requests/:requestId         - Get blood request details
 *   PATCH  /api/v1/requests/:requestId/status  - Requester updates status (CANCELLED / FULFILLED)
 *   PATCH  /api/v1/requests/:requestId/verify  - Platform ADMIN verifies/rejects request
 *
 * Responses sub-routes:
 *   POST   /api/v1/requests/:requestId/responses - Submit donation response
 *   GET    /api/v1/requests/:requestId/responses - Get responses for request (authorized)
 */

import express from 'express';
import {
  createBloodRequest,
  getBloodRequests,
  getBloodRequestById,
  getMyBloodRequests,
  updateRequestStatus,
  verifyBloodRequest,
  deleteBloodRequest,
} from '../controllers/bloodRequest.controller.js';
import {
  createResponse,
  getRequestResponses,
  updateResponseStatus,
} from '../controllers/requestResponse.controller.js';
import {
  authenticate,
  authorize,
  logAdminAction,
} from '../middleware/auth.middleware.js';
import { verifyCsrf } from '../utils/security.js';

const router = express.Router();

// --- Request Discovery & Creation ---

// POST /api/v1/requests - Create request
router.post('/', authenticate, verifyCsrf, createBloodRequest);

// GET /api/v1/requests - Filter / discover requests
router.get('/', getBloodRequests);

// POST /api/v1/requests/seed - Seed sample blood requests
router.post('/seed', async (req, res) => {
  try {
    const BloodRequest = (await import("../models/BloodRequest.js")).default;
    const User = (await import("../models/User.js")).default;
    
    // Find or create a demo user to own seed requests
    let demoUser = await User.findOne({ email: "demouser@raktdal.org" });
    if (!demoUser) {
      demoUser = await User.create({
        fullName: "RaktDal Health Coordinator",
        email: "demouser@raktdal.org",
        role: "USER",
        isEmailVerified: true
      });
    }

    const sampleRequests = [
      {
        hospitalName: "Apollo Hospital",
        location: { city: "Delhi", district: "New Delhi", state: "Delhi", pinCode: "110001" },
        bloodGroup: "O+",
        component: "WHOLE_BLOOD",
        unitsRequired: 3,
        urgency: "CRITICAL",
        patientReference: "IPD-8821",
        description: "Emergency surgical requirement for trauma patient in ICU."
      },
      {
        hospitalName: "Fortis Memorial Research Institute",
        location: { city: "Gurugram", district: "Gurugram", state: "Haryana", pinCode: "122002" },
        bloodGroup: "B+",
        component: "PLATELETS",
        unitsRequired: 2,
        urgency: "URGENT",
        patientReference: "ONCO-409",
        description: "Platelet support needed for ongoing chemotherapy patient."
      },
      {
        hospitalName: "Tata Memorial Hospital",
        location: { city: "Mumbai", district: "Mumbai", state: "Maharashtra", pinCode: "400012" },
        bloodGroup: "AB+",
        component: "PACKED_RED_CELLS",
        unitsRequired: 4,
        urgency: "STANDARD",
        patientReference: "SURG-110",
        description: "Scheduled cardiac bypass procedure requiring typed units."
      },
      {
        hospitalName: "Postgraduate Institute of Medical Education & Research (PGIMER)",
        location: { city: "Chandigarh", district: "Chandigarh", state: "Chandigarh", pinCode: "160012" },
        bloodGroup: "O-",
        component: "WHOLE_BLOOD",
        unitsRequired: 2,
        urgency: "CRITICAL",
        patientReference: "EMERG-55",
        description: "Rare O-negative emergency delivery transfusion."
      },
      {
        hospitalName: "KIMS Hospitals",
        location: { city: "Hyderabad", district: "Hyderabad", state: "Telangana", pinCode: "500003" },
        bloodGroup: "A+",
        component: "PLASMA",
        unitsRequired: 3,
        urgency: "STANDARD",
        patientReference: "MED-302",
        description: "Fresh Frozen Plasma for severe dengue recovery."
      },
      {
        hospitalName: "Christian Medical College (CMC)",
        location: { city: "Vellore", district: "Vellore", state: "Tamil Nadu", pinCode: "632004" },
        bloodGroup: "A-",
        component: "WHOLE_BLOOD",
        unitsRequired: 2,
        urgency: "URGENT",
        patientReference: "WARD-7A",
        description: "Orthopedic trauma replacement units needed urgently."
      },
      {
        hospitalName: "Manipal Hospital",
        location: { city: "Bengaluru", district: "Bengaluru", state: "Karnataka", pinCode: "560017" },
        bloodGroup: "B-",
        component: "PACKED_RED_CELLS",
        unitsRequired: 1,
        urgency: "STANDARD",
        patientReference: "IP-908",
        description: "Scheduled knee arthroplasty scheduled for tomorrow morning."
      },
      {
        hospitalName: "Medanta - The Medicity",
        location: { city: "Lucknow", district: "Lucknow", state: "Uttar Pradesh", pinCode: "226030" },
        bloodGroup: "AB-",
        component: "PLATELETS",
        unitsRequired: 3,
        urgency: "URGENT",
        patientReference: "ICU-B3",
        description: "Single donor platelets required for thrombocytopenia."
      }
    ];

    let createdCount = 0;
    const now = Date.now();

    for (let i = 0; i < sampleRequests.length; i++) {
      const s = sampleRequests[i];
      const reqNum = `REQ-${new Date().getFullYear()}-${String(1000 + i + Math.floor(Math.random() * 8000))}`;
      
      await BloodRequest.create({
        requestNumber: reqNum,
        createdByUserId: demoUser._id,
        requesterType: "INDIVIDUAL",
        patientReference: s.patientReference,
        bloodGroup: s.bloodGroup,
        component: s.component,
        unitsRequired: s.unitsRequired,
        unitsFulfilled: 0,
        hospitalName: s.hospitalName,
        location: s.location,
        requiredBy: new Date(now + (i + 1) * 24 * 60 * 60 * 1000),
        expiresAt: new Date(now + (i + 5) * 24 * 60 * 60 * 1000),
        urgency: s.urgency,
        description: s.description,
        status: "ACTIVE",
        verificationStatus: {
          status: "APPROVED",
          history: [{ action: "CREATED", timestamp: new Date(), note: "System seeded active sample request" }]
        }
      });
      createdCount++;
    }

    return res.json({ success: true, message: `Successfully seeded ${createdCount} active blood requests!` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/requests/my - Logged-in user's requests
router.get('/my', authenticate, getMyBloodRequests);

// GET /api/v1/requests/:requestId - Request details
router.get('/:requestId', getBloodRequestById);

// DELETE /api/v1/requests/:requestId - Requester deletes their own request
router.delete('/:requestId', authenticate, verifyCsrf, deleteBloodRequest);

// PATCH /api/v1/requests/:requestId/status - Requester status change (cancel/fulfill)
router.patch('/:requestId/status', authenticate, verifyCsrf, updateRequestStatus);

// PATCH /api/v1/requests/:requestId/verify - Platform ADMIN verification
router.patch(
  '/:requestId/verify',
  authenticate,
  authorize('ADMIN'),
  verifyCsrf,
  logAdminAction('VERIFY_BLOOD_REQUEST'),
  verifyBloodRequest
);

// --- Response Sub-routes ---

// POST /api/v1/requests/:requestId/responses - Offer donation / respond to request
router.post('/:requestId/responses', authenticate, verifyCsrf, createResponse);

// GET /api/v1/requests/:requestId/responses - View responses for a request
router.get('/:requestId/responses', authenticate, getRequestResponses);

export default router;
