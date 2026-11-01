# API Documentation

Base path: `/api/v1`.

## Authentication & Role-Based Access Control (RBAC)

### 1. Platform & Organization Roles

- **Platform Roles** (Stored on `User.platformRoles`):
  - `USER`: Standard donor / recipient user.
  - `ADMIN`: Platform administrator with full access to the control plane and bypass authority for resource ownership checks.
- **Organization Roles** (Stored in `OrganizationMembership.orgRole`):
  - `OWNER`: Full administrative control of an organization.
  - `ADMIN`: Organizational administrator.
  - `MANAGER`: Coordinator / camp manager.
  - `STAFF`: Standard operational staff.

---

### 2. Authorization & Security Middlewares

All middlewares reside centrally in `backend/src/middleware/auth.middleware.js`:

| Middleware | Description |
| :--- | :--- |
| `authenticate` | Verifies short-lived access JWT (via cookie or header); fetches user; rejects suspended/inactive accounts; attaches `req.user`. |
| `authorize(...roles)` | Restricts endpoints to designated platform roles (e.g. `authorize("ADMIN")`). Never trusts client-supplied roles. |
| `requireOwnership(fn)` | Enforces resource ownership matching `req.user._id` (with ADMIN bypass). |
| `requireOrgRole(fn, ...roles)` | Verifies active membership in an organization with permitted role (`OWNER`, `ADMIN`, `MANAGER`, `STAFF`). |
| `requireVerifiedOrganization(fn)` | Ensures unverified organizations cannot publish camps or public donation requests. |
| `preventSelfRoleElevation` | Rejects any self-update attempt by non-admins that includes `platformRoles` or `roles`. |

---

### 3. Endpoints Matrix

| Method | Endpoint | Description | Auth Required | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | User Registration with default `USER` role | No | Public |
| `POST` | `/api/v1/auth/login` | Login with email & password (Argon2 verified) | No | Requires verified email |
| `POST` | `/api/v1/auth/forgot-password` | Requests password reset (safe generic response) | No | Rate limited |
| `POST` | `/api/v1/auth/reset-password` | Resets password with token & revokes all sessions | No | Token verified |
| `POST` | `/api/v1/auth/refresh` | Refresh token rotation with reuse detection | Cookie | Public with cookie |
| `POST` | `/api/v1/auth/logout` | Revokes current session & clears cookies | Cookie | Session |
| `GET` | `/api/v1/auth/me` | Logged-in profile | Yes | Any authenticated user |
| `PATCH` | `/api/v1/auth/me` | Updates profile (`preventSelfRoleElevation` enforced) | Yes | Resource Owner |
| `GET` | `/api/v1/auth/sessions` | Lists active sessions | Yes | Resource Owner |
| `GET` | `/api/v1/auth/admin/dashboard` | Administrative control plane | Yes | `ADMIN` only |
| `POST` | `/api/v1/auth/verify-email` | Verifies 6-digit email OTP | Optional | 5 attempts max |
| `POST` | `/api/v1/auth/resend-otp` | Sends fresh OTP via Resend | Optional | 60s cooldown |
| `GET` | `/api/v1/auth/google` | Initiates Google OAuth Sign-In | No | Public |
| `GET` | `/api/v1/auth/google/callback` | Google OAuth callback | No | Public |
