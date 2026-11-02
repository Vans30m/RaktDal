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

// GET /api/v1/requests/my - Logged-in user's requests
router.get('/my', authenticate, getMyBloodRequests);

// GET /api/v1/requests/:requestId - Request details
router.get('/:requestId', getBloodRequestById);

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
