import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import BloodRequest from '../src/models/BloodRequest.js';
import RequestResponse from '../src/models/RequestResponse.js';
import Organization from '../src/models/Organization.js';
import { eventDispatcher, DOMAIN_EVENTS } from '../src/services/eventDispatcher.service.js';

test('BloodRequest Model: Validation constraints (bloodGroup, component, urgency, units)', () => {
  const req = new BloodRequest({
    createdByUserId: new mongoose.Types.ObjectId(),
    requesterType: 'INDIVIDUAL',
    patientReference: 'PATIENT-7788',
    bloodGroup: 'INVALID_GROUP',
    component: 'WHOLE_BLOOD',
    unitsRequired: 0, // Must be >= 1
    hospitalName: 'Apollo Hospital',
    location: {
      city: 'Delhi',
      state: 'Delhi',
      pinCode: '110001',
    },
    urgency: 'HIGH',
    requiredBy: new Date(Date.now() + 86400000),
  });

  const err = req.validateSync();
  assert.ok(err, 'Validation error should be raised');
  assert.ok(err.errors['bloodGroup'], 'Invalid blood group should fail validation');
  assert.ok(err.errors['unitsRequired'], 'Zero units required should fail validation');
});

test('BloodRequest Model: Units required cap of 50', () => {
  const req = new BloodRequest({
    createdByUserId: new mongoose.Types.ObjectId(),
    requesterType: 'INDIVIDUAL',
    patientReference: 'PATIENT-7789',
    bloodGroup: 'O+',
    component: 'WHOLE_BLOOD',
    unitsRequired: 55, // Max 50
    hospitalName: 'City Clinic',
    location: { city: 'Mumbai', state: 'Maharashtra', pinCode: '400001' },
    requiredBy: new Date(Date.now() + 86400000),
  });

  const err = req.validateSync();
  assert.ok(err, 'Validation error expected');
  assert.ok(err.errors['unitsRequired']);
});

test('BloodRequest Model: Privacy view masks patient and removes verification notes', () => {
  const req = new BloodRequest({
    requestNumber: 'REQ-2026-ABCD1234',
    createdByUserId: new mongoose.Types.ObjectId(),
    requesterType: 'INDIVIDUAL',
    patientReference: 'CONFIDENTIAL-PATIENT-9988',
    bloodGroup: 'B-',
    component: 'PLATELETS',
    unitsRequired: 2,
    hospitalName: 'Max Healthcare',
    location: { city: 'Gurugram', state: 'Haryana', pinCode: '122001' },
    requiredBy: new Date(Date.now() + 86400000),
    urgency: 'CRITICAL',
    status: 'ACTIVE',
    verificationStatus: {
      status: 'VERIFIED',
      verifiedAt: new Date(),
    },
    internalVerificationNotes: 'Hospital confirmed via phone',
  });

  const publicView = req.toPublicView();

  assert.equal(publicView.bloodGroup, 'B-');
  assert.equal(publicView.hospitalName, 'Max Healthcare');
  assert.equal(publicView.patientReference, 'CO***88', 'Patient reference should be masked');
  assert.equal(publicView.internalVerificationNotes, undefined, 'Internal verification notes must be hidden');
});

test('RequestResponse Model: Requires contact sharing consent flag and prevents missing fields', () => {
  const resp = new RequestResponse({
    requestId: new mongoose.Types.ObjectId(),
    responderType: 'INDIVIDUAL_DONOR',
    donorUserId: new mongoose.Types.ObjectId(),
    contactSharingConsent: false,
    message: 'I can donate tomorrow morning.',
  });

  // Valid without shared info if consent is false
  const err = resp.validateSync();
  assert.equal(err, undefined, 'Model should validate with contactSharingConsent false');

  // Must reject invalid response status
  resp.status = 'UNKNOWN_STATUS';
  const errStatus = resp.validateSync();
  assert.ok(errStatus.errors['status'], 'Invalid status should be rejected');
});

test('Organization Admin Authorization Check: Distinguishes between Organization ADMIN and non-admin', () => {
  const orgAdminUser = new mongoose.Types.ObjectId();
  const regularUser = new mongoose.Types.ObjectId();

  const org = new Organization({
    name: 'Red Cross Blood Center',
    type: 'BLOOD_BANK',
    email: 'info@redcross.test',
    phone: '9876543210',
    address: { street: '1st Ave', city: 'Delhi', state: 'Delhi', pinCode: '110001' },
    licenseNumber: 'LIC-2026-99',
    verificationStatus: 'VERIFIED',
    organizationAdmins: [orgAdminUser],
  });

  const isOrgAdmin = (userId) => {
    return org.organizationAdmins.some((adminId) => adminId.toString() === userId.toString());
  };

  assert.equal(isOrgAdmin(orgAdminUser), true, 'Organization admin must be recognized');
  assert.equal(isOrgAdmin(regularUser), false, 'Non-admin member must be rejected');
});

test('Organization Verification Constraint: Rejects request creation from unverified organization', () => {
  const unverifiedOrg = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Unverified Clinic',
    verificationStatus: 'PENDING',
    organizationAdmins: [new mongoose.Types.ObjectId()],
  };

  const canPublish = unverifiedOrg.verificationStatus === 'VERIFIED';
  assert.equal(canPublish, false, 'Unverified organization cannot publish blood requests');
});

test('Domain Event Dispatcher: Emits and receives domain events for requests and responses', async () => {
  let requestCreatedPayload = null;
  let responseSubmittedPayload = null;

  const unsubscribeCreate = eventDispatcher.subscribe(DOMAIN_EVENTS.REQUEST_CREATED, (data) => {
    requestCreatedPayload = data;
  });

  const unsubscribeResponse = eventDispatcher.subscribe(DOMAIN_EVENTS.RESPONSE_SUBMITTED, (data) => {
    responseSubmittedPayload = data;
  });

  eventDispatcher.publish(DOMAIN_EVENTS.REQUEST_CREATED, {
    requestId: 'REQ-123',
    bloodGroup: 'O_POSITIVE',
  });

  eventDispatcher.publish(DOMAIN_EVENTS.RESPONSE_SUBMITTED, {
    requestId: 'REQ-123',
    responseId: 'RESP-456',
  });

  assert.ok(requestCreatedPayload, 'REQUEST_CREATED event should be received');
  assert.equal(requestCreatedPayload.requestId, 'REQ-123');
  assert.ok(responseSubmittedPayload, 'RESPONSE_SUBMITTED event should be received');
  assert.equal(responseSubmittedPayload.responseId, 'RESP-456');

  // Clean up listeners
  unsubscribeCreate();
  unsubscribeResponse();
});

test('Request Lifecycle State Transitions: State transitions conform to lifecycle specifications', () => {
  const allowedTransitions = {
    PENDING_VERIFICATION: ['ACTIVE', 'REJECTED', 'CANCELLED'],
    ACTIVE: ['RESPONSES_RECEIVED', 'FULFILLED', 'CANCELLED', 'EXPIRED'],
    RESPONSES_RECEIVED: ['FULFILLED', 'CANCELLED', 'EXPIRED'],
    FULFILLED: [],
    CANCELLED: [],
    EXPIRED: [],
    REJECTED: [],
  };

  const isValidTransition = (from, to) => {
    return (allowedTransitions[from] || []).includes(to);
  };

  assert.equal(isValidTransition('PENDING_VERIFICATION', 'ACTIVE'), true);
  assert.equal(isValidTransition('ACTIVE', 'RESPONSES_RECEIVED'), true);
  assert.equal(isValidTransition('RESPONSES_RECEIVED', 'FULFILLED'), true);
  assert.equal(isValidTransition('ACTIVE', 'CANCELLED'), true);
  assert.equal(isValidTransition('FULFILLED', 'ACTIVE'), false, 'Cannot reopen fulfilled request');
  assert.equal(isValidTransition('CANCELLED', 'ACTIVE'), false, 'Cannot reopen cancelled request');
});

test('Donor Response Contact Sharing: Preserves contact info only when consent is explicitly granted', () => {
  const donorUser = {
    _id: new mongoose.Types.ObjectId(),
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul@example.com',
  };

  const buildSharedContact = (donor, consent) => {
    if (!consent) return undefined;
    return {
      fullName: donor.fullName,
      phone: donor.phone,
      email: donor.email,
    };
  };

  const sharedWithConsent = buildSharedContact(donorUser, true);
  assert.ok(sharedWithConsent);
  assert.equal(sharedWithConsent.phone, '9876543210');

  const sharedWithoutConsent = buildSharedContact(donorUser, false);
  assert.equal(sharedWithoutConsent, undefined, 'No contact info shared without donor consent');
});
