import { Router } from "express";
import {
  getOrganizationReports,
  getPersonalReports
} from "../controllers/reports.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// 1. Personal activity reports (any authenticated user)
router.get("/me/summary", authenticate, getPersonalReports);

// 2. Organization-scoped reports (requires authentication; authorization checked in service)
router.get("/organizations/:organizationId", authenticate, getOrganizationReports);

export default router;
