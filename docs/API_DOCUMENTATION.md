# API Documentation & Authorization Architecture

Base path: `/api/v1`.

---

## 1. Authentication & Session Architecture

RaktDal utilizes **Google OAuth 2.0 / OpenID Connect** as its sole identity provider, paired with short-lived access JWTs and database-backed refresh token rotation.

- **Access Token:** Short-lived (15 minutes), signed with `JWT_SECRET`, carried in an `HttpOnly`, `SameSite=None/Lax`, `Secure` cookie or `Authorization: Bearer <token>` header.
- **Refresh Token:** Long-lived (7 days), single-use rotation, stored in MongoDB as deterministic SHA-256 hashes (`refreshTokenHash`) grouped under a `tokenFamilyId`.
- **Session Revocation:** Logout, password changes, or account suspension immediately mark sessions as revoked (`isRevoked: true`).
- **CSRF Protection:** Authenticated state-changing operations (`POST`, `PATCH`, `DELETE`) require the `X-Requested-With` or `X-CSRF-Token` custom header.

---

## 2. Platform Roles

Platform roles define system-wide administrative and general privileges. Roles are managed exclusively on the backend and are never trusted from client inputs:
- `USER`: Standard donor, blood recipient, or community member.
- `ADMIN`: Platform administrator with full access to the administrative control plane, audit logs, and automatic bypass authority for resource ownership checks.

---

## 3. Account Status Lifecycle

Every `User` record maintains an `accountStatus` field:
- `ACTIVE`: Full access to authorized endpoints according to assigned roles.
- `SUSPENDED`: Access is denied with `HTTP 403 Forbidden` (`ACCOUNT_SUSPENDED`). Active sessions are automatically revoked.
- `DEACTIVATED`: Access is denied with `HTTP 403 Forbidden` (`ACCOUNT_DEACTIVATED`). Active sessions are automatically revoked.

---

## 4. Centralized Security Middlewares

All authorization and security middlewares are centralized in `backend/src/middleware/auth.middleware.js`:

| Middleware | Parameters | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `authenticate` | None | Validates access token signature and expiration; verifies session revocation status; validates `accountStatus === 'ACTIVE'`; revokes sessions on suspended accounts; attaches `req.user` and `req.session`. | `401 Unauthorized` / `403 Forbidden` |
| `authorize` | `...allowedRoles` | Verifies that `req.user.platformRoles` contains at least one of the specified roles (e.g. `authorize("ADMIN")`). | `401 Unauthorized` / `403 Forbidden` |
| `requireOwnership` | `getOwnerIdFromRequest` | Compares target resource owner ID with `req.user._id`. Prevents Insecure Direct Object Reference (IDOR) attacks. Platform `ADMIN` users bypass this check. | `403 Forbidden` (`NOT_RESOURCE_OWNER`) |
| `requireVerifiedOrganization` | `getOrgIdFromRequest` | Confirms that the target organization is verified (`isVerified === true`) before allowing publication of donation camps or blood inventory. | `403 Forbidden` (`UNVERIFIED_ORGANIZATION`) |
| `preventSelfRoleElevation` | None | Intercepts user update payloads and denies any non-admin request that attempts to alter `platformRoles` or `roles`. | `403 Forbidden` (`ROLE_ELEVATION_DENIED`) |
| `logAdminAction` | `actionName` | Securely audit-logs sensitive administrative actions (recording admin email, ID, action, route, IP, timestamp) without exposing credentials or tokens. | N/A (Pass-through logger) |

---

## 5. Endpoints & Permission Matrix

| Method | Endpoint | Description | Auth Required | Permissions Enforced |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/auth/google` | Initiates Google OAuth 2.0 PKCE flow | No | Public |
| `GET` | `/api/v1/auth/google/callback` | Google OAuth callback (state + PKCE verified) | No | Public (valid state cookie required) |
| `POST` | `/api/v1/auth/refresh` | Refresh token rotation with reuse detection | Cookie | Valid non-revoked refresh token cookie |
| `POST` | `/api/v1/auth/logout` | Revokes current session & clears auth cookies | Yes / Cookie | Active session required |
| `GET` | `/api/v1/auth/me` | Fetches authenticated user's profile | Yes | Any authenticated user (`ACTIVE`) |
| `PATCH` | `/api/v1/auth/me` | Updates user's own profile | Yes | Resource Owner + `preventSelfRoleElevation` |
| `GET` | `/api/v1/auth/sessions` | Lists active sessions for current user | Yes | Resource Owner |
| `GET` | `/api/v1/auth/admin/dashboard` | Administrative control plane | Yes | `ADMIN` only + `logAdminAction` |
| `GET` | `/api/v1/health` | Service health status check | No | Public |

---

## 6. Frontend Architecture & Google OAuth Integration

The frontend is built using standard **HTML5, CSS3, and Vanilla JavaScript (ES Modules)** following a Single Page Application (SPA) architecture with hash-based routing:

- **State Management (`frontend/js/auth.js`)**:
  - `AuthStateManager` (`authState`): Single source of truth for the current user's authentication state, roles, and session lifecycle.
  - Subscribable pattern notifying navigation and views on state transitions.
- **API Client Service (`frontend/js/api.js`)**:
  - Uses `credentials: "include"` for transmitting secure `HttpOnly` cookies.
  - Automatically injects `X-Requested-With: XMLHttpRequest` custom CSRF header.
  - Dynamically resolves backend base URL from `window.RAKTDAL_API_URL` or default `localhost:5000` / origin.
  - **Deduplicated Token Refresh**: Multiple concurrent 401 Unauthorized responses share a single refresh request promise to prevent race conditions and infinite loops.
  - Zero token exposure to JavaScript (tokens are never stored in `localStorage` or `sessionStorage`).
- **SPA Router (`frontend/js/router.js`)**:
  - Handles client-side hash routes: `#/`, `#/requests`, `#/requests/create`, `#/requests/:id`, `#/requests/my`, `#/login`, `#/auth/callback`, `#/profile`, `#/admin`.
  - Implements route guards for protected donor pages and administrative dashboards.
  - Manages the user profile dropdown in the top navigation bar with name, email, avatar, role badges, and logout trigger.

---

## 7. Phase 11 — Blood Requests & Responses API Reference

### 7.1 Blood Requests Endpoints

| Method | Endpoint | Description | Auth Required | Permissions Enforced |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/requests` | Create new blood request | Yes | `authenticate` + `verifyCsrf` (Individual `USER` or Verified Org `ADMIN`) |
| `GET` | `/api/v1/requests` | Discover & filter active blood requests | No | Public (privacy projection masks patient data) |
| `GET` | `/api/v1/requests/my` | List current user's submitted blood requests | Yes | `authenticate` (Returns full unmasked view) |
| `GET` | `/api/v1/requests/:requestId` | Get blood request details | Optional | Public (masked) or Requester/Platform Admin (unmasked) |
| `PATCH` | `/api/v1/requests/:requestId/status` | Update request status (`FULFILLED`, `CANCELLED`) | Yes | `authenticate` + `verifyCsrf` (Requester Owner or Platform `ADMIN`) |
| `PATCH` | `/api/v1/requests/:requestId/verify` | Platform Admin verification (`VERIFIED`, `REJECTED`) | Yes | `authenticate` + `authorize("ADMIN")` + `verifyCsrf` + `logAdminAction` |

### 7.2 Request Responses Endpoints

| Method | Endpoint | Description | Auth Required | Permissions Enforced |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/requests/:requestId/responses` | Submit offer to donate blood for request | Yes | `authenticate` + `verifyCsrf` (Self-response blocked, duplicates blocked) |
| `GET` | `/api/v1/requests/:requestId/responses` | List responses submitted for a request | Yes | `authenticate` (Request Creator or Platform `ADMIN`) |
| `PATCH` | `/api/v1/responses/:responseId` | Update response status (`ACCEPTED`, `DECLINED`, `WITHDRAWN`) | Yes | `authenticate` + `verifyCsrf` (Responder or Request Creator) |

### 7.3 Request Lifecycle State Machine

```
[ PENDING_VERIFICATION ]
      │ (Admin verify / Auto)
      ▼
   [ ACTIVE ] ─────────────► [ CANCELLED ] (By Requester)
      │
      │ (First Donor Response)
      ▼
[ RESPONSES_RECEIVED ] ────► [ FULFILLED ] (Requester confirms fulfillment)
      │
      └────────────────────► [ EXPIRED ] (Required-by deadline passes)
```

- Responses do **not** automatically fulfill a request. Fulfillment requires explicit requester confirmation.
- Privacy Guarantee: Unauthenticated and general public consumers receive `toPublicView()` with masked patient references (`C*** P***`) and stripped clinical verification notes.
- Donor Consent Guarantee: Responders must explicitly set `contactSharingConsent: true` before their verified phone number and email are visible in `sharedContactInfo`.

---

## 8. Phase 15 — Admin Dashboard & Verification Management

All endpoints under `/api/v1/admin` are strictly reserved for users possessing the platform `ADMIN` role (`platformRoles: ["ADMIN"]`). Organization `ADMIN` users are prohibited from accessing platform administration endpoints unless they are independently granted the platform `ADMIN` role.

### 8.1 Administrative Endpoints Reference

| Method | Endpoint | Description | Auth Required | Permissions Enforced |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/stats` | Real-time platform metrics, user counts, verification queues | Yes | Platform `ADMIN` only |
| `GET` | `/api/v1/admin/organizations` | Paginated organization verification queue with status filters | Yes | Platform `ADMIN` only |
| `PATCH` | `/api/v1/admin/organizations/:orgId/verify` | Approve or Reject organization (`status`, `reason`) | Yes | Platform `ADMIN` only + `verifyCsrf` (Mandatory rejection reason) |
| `GET` | `/api/v1/admin/users` | Directory of registered users with search & account status filters | Yes | Platform `ADMIN` only |
| `PATCH` | `/api/v1/admin/users/:userId/status` | Suspend or reactivate user accounts (`status`, `reason`) | Yes | Platform `ADMIN` only + `verifyCsrf` (Self-suspension blocked) |
| `GET` | `/api/v1/admin/requests` | Moderation queue of all blood requests across all statuses | Yes | Platform `ADMIN` only |
| `GET` | `/api/v1/admin/fraud-alerts` | View open fraud flags and suspicious rapid activity alerts | Yes | Platform `ADMIN` only |
| `PATCH` | `/api/v1/admin/fraud-alerts/:alertId` | Update alert status (`INVESTIGATING`, `RESOLVED`, `DISMISSED`) | Yes | Platform `ADMIN` only + `verifyCsrf` |
| `GET` | `/api/v1/admin/audit-logs` | Immutable audit log trail of all administrative actions & decisions | Yes | Platform `ADMIN` only |

### 8.2 Organization Verification Lifecycle

```
[ PENDING ] ──────► [ APPROVED ] (Grants publishing privileges, sets isVerified: true)
     │
     └────────────► [ REJECTED ] (Requires mandatory reason, sets isVerified: false)
```

- **Conflict of Interest Protection**: An admin cannot verify their own registered organization.
- **Privacy Enforcement**: Private government licenses and verification documents are never exposed in public profile projections (`toPublicProfile()`).

---

## 9. Phase 16 — Reports & Analytics Reference

### 9.1 Reporting Endpoints

| Method | Endpoint | Description | Auth Required | Permissions Enforced |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/reports/overview` | Executive platform analytics, time-series data & demand trends | Yes | Platform `ADMIN` only |
| `GET` | `/api/v1/admin/reports/requests` | Detailed request analytics with blood group & urgency filters | Yes | Platform `ADMIN` only |
| `GET` | `/api/v1/admin/reports/export` | Download filtered requests report as anti-formula injection CSV | Yes | Platform `ADMIN` only |
| `GET` | `/api/v1/reports/organizations/:orgId` | Organization-scoped activity, request counts & fulfillment stats | Yes | Platform `ADMIN` or authorized Organization `ADMIN` |
| `GET` | `/api/v1/reports/me/summary` | Personal contribution, created requests & donation response history | Yes | Authenticated `USER` (scoped strictly to own records) |

### 9.2 Analytics Rules & Protections

- **Anti-CSV Formula Injection (CWE-1236)**: Cells starting with `=`, `+`, `-`, `@`, `\t`, or `\r` are sanitized with single-quote escaping (`'`).
- **Privacy Guarantee**: Aggregate reports never expose private donor telephone numbers, email addresses, or patient IP numbers.
- **Fulfillment Calculation Formula**:
  $$\text{Fulfillment Rate (\%)} = \frac{\text{Fulfilled Requests}}{\text{Total Requests} - \text{Cancelled Requests}} \times 100$$
- **Demo Data Segregation**: Controlled by `excludeDemo=true` (default), ensuring demo data accounts and requests do not skew real production analytics.





---

## 10. Phase 10 � Donor Profiles & Discovery Reference

### 10.1 Donor Profile & Discovery Endpoints

| Method | Endpoint | Description | Auth Required | Permissions Enforced |
| :--- | :--- | :--- | :--- | :--- |
| POST | /api/v1/donors/profile | Create authenticated donor profile (1 per account) | Yes | Authenticated USER + erifyCsrf |
| GET | /api/v1/donors/me | Retrieve authenticated donor's own profile | Yes | Resource Owner (eq.user._id) |
| PATCH | /api/v1/donors/me | Update donor profile (location, age, contact method) | Yes | Resource Owner + erifyCsrf |
| PATCH | /api/v1/donors/me/availability | Quick-toggle availability status (AVAILABLE/UNAVAILABLE) | Yes | Resource Owner + erifyCsrf |
| PATCH | /api/v1/donors/me/consent | Update consent preferences (publicDiscovery, 
otifications, contactSharing) | Yes | Resource Owner + erifyCsrf + Audit Logged |
| GET | /api/v1/donors/search | Search active opted-in donors by bloodGroup, city, pinCode | No | Public (Scoped strictly to publicDiscoveryConsent: true and profileStatus: ACTIVE) |

### 10.2 Privacy & Security Protections
- **Zero Exposure of Private Data**: lastDonationDate is private and never exposed publicly. Phone number and email are hidden unless contactSharingConsent: true is explicitly granted.
- **Independent Consents**: Public discovery, urgent notifications, and contact sharing are separate permissions.
- **Audit Logging**: Every consent change generates an immutable entry in consentAuditLog with timestamp, user ID, IP address, and user agent.
- **Compound Database Indexes**:
  - { profileStatus: 1, publicDiscoveryConsent: 1, bloodGroup: 1, "location.city": 1, availabilityStatus: 1 }
  - { profileStatus: 1, publicDiscoveryConsent: 1, bloodGroup: 1, "location.pinCode": 1, availabilityStatus: 1 }
  - { profileStatus: 1, publicDiscoveryConsent: 1, "location.city": 1, "location.pinCode": 1 }
- **Medical Disclaimer**: Self-reported donor availability is never treated as medical eligibility; suitability is always determined by certified professionals at collection centers.
