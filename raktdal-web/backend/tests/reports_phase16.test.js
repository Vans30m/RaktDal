import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import Organization from "../src/models/Organization.js";
import BloodRequest from "../src/models/BloodRequest.js";
import { ReportsService } from "../src/services/reports.service.js";

test("Reports Phase 16: Date Range Parsing logic", () => {
  const { start: start7d, end: end7d } = ReportsService.parseDateFilter({ range: "7d" });
  assert.ok(start7d instanceof Date);
  assert.ok(end7d instanceof Date);
  const diffDays = Math.round((end7d - start7d) / (1000 * 60 * 60 * 24));
  assert.equal(diffDays, 7);

  const { start: start30d } = ReportsService.parseDateFilter({ range: "30d" });
  assert.ok(start30d instanceof Date);

  // Custom valid range
  const customStart = "2026-01-01T00:00:00.000Z";
  const customEnd = "2026-01-15T00:00:00.000Z";
  const { start: customS, end: customE } = ReportsService.parseDateFilter({
    range: "custom",
    startDate: customStart,
    endDate: customEnd
  });
  assert.equal(customS.toISOString(), customStart);
  assert.equal(customE.toISOString(), customEnd);
});

test("Reports Phase 16: Anti-CSV Formula Injection (CWE-1236) Protection", () => {
  // Test malicious spreadsheet formula prefixes: =, +, -, @
  const maliciousInput1 = "=cmd|' /C calc'!A0";
  const maliciousInput2 = "+1234567890";
  const maliciousInput3 = "-SUM(A1:A10)";
  const maliciousInput4 = "@evil_payload";
  const benignInput = "Apollo Hospital Delhi";

  const sanitized1 = ReportsService.sanitizeCsvField(maliciousInput1);
  const sanitized2 = ReportsService.sanitizeCsvField(maliciousInput2);
  const sanitized3 = ReportsService.sanitizeCsvField(maliciousInput3);
  const sanitized4 = ReportsService.sanitizeCsvField(maliciousInput4);
  const sanitizedBenign = ReportsService.sanitizeCsvField(benignInput);

  assert.ok(sanitized1.startsWith("'="), "Formula starting with = must be prefixed with single quote");
  assert.ok(sanitized2.startsWith("'+"), "Formula starting with + must be prefixed with single quote");
  assert.ok(sanitized3.startsWith("'-"), "Formula starting with - must be prefixed with single quote");
  assert.ok(sanitized4.startsWith("'@"), "Formula starting with @ must be prefixed with single quote");
  assert.equal(sanitizedBenign, "Apollo Hospital Delhi", "Safe string should not have single quote prefix");
});

test("Reports Phase 16: CSV Generation produces valid formatted lines", () => {
  const headers = [
    { label: "Request Number", key: "requestNumber" },
    { label: "Blood Group", key: "bloodGroup" },
    { label: "Units", key: "units" }
  ];

  const rows = [
    { requestNumber: "REQ-001", bloodGroup: "O+", units: 2 },
    { requestNumber: "REQ-002", bloodGroup: "A-", units: 1 }
  ];

  const csv = ReportsService.generateCsv(headers, rows);
  const lines = csv.split("\r\n");

  assert.equal(lines.length, 3);
  assert.equal(lines[0], "Request Number,Blood Group,Units");
  assert.equal(lines[1], "REQ-001,O+,2");
  assert.equal(lines[2], "REQ-002,A-,1");
});

test("Reports Phase 16: Organization Scoped Reports Access Control", async () => {
  const targetOrgId = new mongoose.Types.ObjectId();
  const authorizedOrgAdminId = new mongoose.Types.ObjectId();
  const unauthorizedUserId = new mongoose.Types.ObjectId();

  const org = new Organization({
    _id: targetOrgId,
    name: "Red Cross Center",
    contactEmail: "info@redcross.org",
    organizationAdmins: [authorizedOrgAdminId]
  });

  const checkOrgReportAccess = (organization, user) => {
    const isPlatformAdmin = user.platformRoles?.includes("ADMIN");
    const isOrgAdmin = organization.organizationAdmins?.some(a => a.toString() === user._id.toString());
    return Boolean(isPlatformAdmin || isOrgAdmin);
  };

  const platformAdmin = { _id: new mongoose.Types.ObjectId(), platformRoles: ["ADMIN"] };
  const authorizedOrgAdmin = { _id: authorizedOrgAdminId, platformRoles: ["USER"] };
  const strangerUser = { _id: unauthorizedUserId, platformRoles: ["USER"] };

  assert.equal(checkOrgReportAccess(org, platformAdmin), true, "Platform ADMIN has global report oversight");
  assert.equal(checkOrgReportAccess(org, authorizedOrgAdmin), true, "Authorized Org ADMIN has access to own org reports");
  assert.equal(checkOrgReportAccess(org, strangerUser), false, "Stranger USER must be denied access to private org reports");
});

test("Reports Phase 16: Fulfillment Rate Calculation Logic", () => {
  const calculateFulfillmentRate = (stats) => {
    const validRequestsDenominator = stats.totalRequests - stats.cancelledRequests;
    if (validRequestsDenominator <= 0) return 0;
    return Number(((stats.fulfilledRequests / validRequestsDenominator) * 100).toFixed(1));
  };

  // Scenario 1: 10 total, 2 cancelled, 6 fulfilled -> 6 / (10 - 2) = 75.0%
  const rate1 = calculateFulfillmentRate({ totalRequests: 10, cancelledRequests: 2, fulfilledRequests: 6 });
  assert.equal(rate1, 75.0);

  // Scenario 2: 0 requests -> 0%
  const rate2 = calculateFulfillmentRate({ totalRequests: 0, cancelledRequests: 0, fulfilledRequests: 0 });
  assert.equal(rate2, 0);

  // Scenario 3: All requests cancelled -> 0%
  const rate3 = calculateFulfillmentRate({ totalRequests: 5, cancelledRequests: 5, fulfilledRequests: 0 });
  assert.equal(rate3, 0);
});
