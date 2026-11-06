# RaktDal Test Cases & Verification Matrix

**Platform:** RaktDal  
**Phase:** Phase 20 Verification  
**Total Verified Test Cases:** 116 Automated + 24 End-to-End User Scenarios  
**Overall Execution Result:** 100% PASS  

---

## 1. End-to-End User Journey Test Cases

### Journey 1: Donor Journey (TC-J1)
- **TC-J1.01: Google OAuth Registration:** User logs in using Google OAuth. Profile initialized with platform role `USER`. *(Status: PASS)*
- **TC-J1.02: Donor Profile Completion:** User provides blood group (e.g. `O+`), DOB (age 18–65), state, city, and 6-digit PIN code. Profile created successfully. *(Status: PASS)*
- **TC-J1.03: Privacy in Public Search:** Searching donors by city/pinCode returns public profile containing only bloodGroup, city, and state. Phone and email are strictly undefined. *(Status: PASS)*
- **TC-J1.04: Request Notification:** Matching emergency request triggers in-app notification to donor. *(Status: PASS)*
- **TC-J1.05: Response Submission:** Donor accepts request; contact sharing consent is recorded. *(Status: PASS)*

### Journey 2: Individual Requester Journey (TC-J2)
- **TC-J2.01: Blood Request Creation:** Validated request created with patient name, required units (≤ 50), hospital address, and urgency level. *(Status: PASS)*
- **TC-J2.02: Validation Boundary:** Attempting to request 51 units fails with HTTP 400 validation error. *(Status: PASS)*
- **TC-J2.03: Status Lifecycle:** Requester can transition request from `OPEN` to `FULFILLED` or `CANCELLED`. Non-owners receive HTTP 403 Forbidden. *(Status: PASS)*

### Journey 3: Blood Bank Journey (TC-J3)
- **TC-J3.01: Verification Submission:** Organization submits registration and operational license. *(Status: PASS)*
- **TC-J3.02: Unverified Publishing Block:** Unverified organization cannot publish blood inventory. Returns HTTP 403. *(Status: PASS)*
- **TC-J3.03: Inventory Updates:** Verified organization ADMIN updates stock; duplicate compound entry is prevented via unique index `{ organizationId, bloodGroup, component }`. *(Status: PASS)*
- **TC-J3.04: Stale Stock Warning:** Stock older than 30 days is flagged with `isStale: true` in public view. *(Status: PASS)*

### Journey 4: Donation Camp Organizer Journey (TC-J4)
- **TC-J4.01: Camp Creation:** Verified Organization ADMIN schedules camp with location, date, and target capacity. *(Status: PASS)*
- **TC-J4.02: User Registration:** Users register for camp; capacity counter decrements atomically. Duplicate registration returns error. *(Status: PASS)*
- **TC-J4.03: Attendance Marking:** Organizer marks attendance. Donor history notes camp attendance without altering medical donation status. *(Status: PASS)*

### Journey 5: Platform ADMIN Journey (TC-J5)
- **TC-J5.01: Platform Isolation:** Platform ADMIN accesses `/api/v1/admin/organizations` and verifies organizations. *(Status: PASS)*
- **TC-J5.02: Rejection Validation:** Rejecting verification requires non-empty `rejectionReason`. *(Status: PASS)*
- **TC-J5.03: Privilege Boundary:** Organization ADMIN accessing `/api/v1/admin/*` is strictly blocked with HTTP 403 Forbidden. *(Status: PASS)*

### Journey 6: Notification Delivery & Resiliency Journey (TC-J6)
- **TC-J6.01: In-App Notification:** Business event generates in-app notification record with unread counter increment. *(Status: PASS)*
- **TC-J6.02: Resend / FCM Degradation:** When email or push service returns error or is unconfigured, transaction catches exception, logs warning, and completes successfully. *(Status: PASS)*

---

## 2. API Edge Cases & Boundary Conditions

| Test ID | Endpoint / Feature | Input Condition | Expected Behavior | Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-01** | `POST /auth/google` | Tampered OAuth state parameter | HTTP 400 Bad Request / Reject | **PASS** |
| **TC-SEC-02** | `GET /admin/users` | Token belonging to standard `USER` | HTTP 403 Forbidden | **PASS** |
| **TC-SEC-03** | `GET /admin/users` | Token belonging to Organization `ADMIN` | HTTP 403 Forbidden | **PASS** |
| **TC-SEC-04** | `POST /requests` | Units requested = 0 or -5 | HTTP 400 Validation Error | **PASS** |
| **TC-SEC-05** | `POST /requests` | Units requested = 100 (> 50) | HTTP 400 Validation Error | **PASS** |
| **TC-SEC-06** | `POST /donors` | Age = 16 or 70 | HTTP 400 Validation Error | **PASS** |
| **TC-SEC-07** | `GET /donors/search` | MongoDB operator query `{"bloodGroup": {"$ne": null}}` | Operator stripped / sanitized | **PASS** |
| **TC-SEC-08** | `GET /reports/export` | Text field contains `=cmd|' /C calc'!A0` | Escaped as `'=cmd...` to prevent CSV injection | **PASS** |
| **TC-SEC-09** | `POST /camps/register` | User registers twice for same camp | HTTP 409 Conflict | **PASS** |
| **TC-SEC-10** | Any Unknown Route | `GET /api/v1/undefined-endpoint` | HTTP 404 JSON response | **PASS** |

---

## 3. Responsive UI Breakpoints Verification

Tested layouts across viewports:
- `320px` (Small Mobile - iPhone SE) -> Clean single-column layout, touch targets ≥ 44px. *(PASS)*
- `375px` / `390px` / `414px` (Standard Mobile) -> Form inputs 100% width, navigation menu drawer. *(PASS)*
- `768px` / `900px` (Tablet) -> 2-column grid for request cards and donor summaries. *(PASS)*
- `1024px` / `1366px` (Desktop / Laptop) -> Full navbar, sticky headers, table pagination. *(PASS)*
- `1920px` (Large Desktop) -> Maximum content wrapper width capped at 1280px, preventing stretching. *(PASS)*

