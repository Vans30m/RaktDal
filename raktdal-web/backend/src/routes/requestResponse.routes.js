/**
 * Request Response standalone routes
 *
 * Endpoints:
 *   GET   /api/v1/responses/my         - Get logged-in user's submitted donation offers
 *   PATCH /api/v1/responses/:responseId - Update response status (CONFIRMED / REJECTED / WITHDRAWN)
 */

import express from 'express';
import { updateResponseStatus, getMyResponses } from '../controllers/requestResponse.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { verifyCsrf } from '../utils/security.js';

const router = express.Router();

router.get('/my', authenticate, getMyResponses);
router.patch('/:responseId', authenticate, verifyCsrf, updateResponseStatus);

export default router;
