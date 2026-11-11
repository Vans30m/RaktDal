<div align="center">

# RaktDal

### Pan-India Blood Donation & Emergency Donor Coordination Platform

[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-SPA-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Google OAuth 2.0](https://img.shields.io/badge/Google_OAuth-2.0%20%7C%20PKCE-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity)
[![Electron](https://img.shields.io/badge/Electron-33.x-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org)
[![Tests](https://img.shields.io/badge/Tests-116%20Passed%20(100%25)-success?style=for-the-badge&logo=node.js&logoColor=white)](#automated-testing--qa-architecture)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)](LICENSE)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

**RaktDal** is an enterprise-grade, privacy-by-design voluntary blood donation, blood bank inventory tracking, and emergency coordination platform across India — accessible as a responsive Single Page Application (SPA) with PWA support and as a native desktop executable via Electron.

[Live Demo](https://raktdal.onrender.com) · [Report a Bug](https://github.com/Vans30m/RaktDal/issues) · [License](LICENSE)

</div>

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Database Models & Schemas](#database-models--schemas)
- [API Reference](#api-reference)
- [Authentication Flow & Session Lifecycle](#authentication-flow--session-lifecycle)
- [Privacy-by-Design & Security Controls](#privacy-by-design--security-controls)
- [Multilingual & Localization Engine](#multilingual--localization-engine)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
- [Deployment (Render)](#deployment-render)
- [Desktop App Build (Electron)](#desktop-app-build-electron)
- [Automated Testing & QA Architecture](#automated-testing--qa-architecture)
- [Medical Disclaimer](#medical-disclaimer)
- [License](#license)

---

## System Overview

**Problem Solved:** Every year, thousands of patients in India face life-threatening emergencies due to delays in finding compatible blood donors. Hospital blood banks maintain fragmented stock logs, emergency requests rely on unverified social media forwarding, and willing donors remain unaware of critical needs within their radius.

**Core Mission:** Connect voluntary blood donors, emergency requesters, authorized blood banks, and community donation camp organizers through a unified, privacy-protected real-time system.

**Target Audience:** Voluntary blood donors across all Indian states, emergency patient families, verified blood banks, and healthcare camp organizers.

**Architecture Paradigm:** Monorepo containing the web platform (`raktdal-web/`) and desktop wrapper (`electron/`):
- `raktdal-web/frontend/` → Pure HTML5, CSS3, Vanilla JavaScript Hash SPA (zero external bundler required)
- `raktdal-web/backend/` → Express 4 Modular Monolith + Mongoose ODM (MongoDB Atlas)
- `electron/` → Native desktop shell generating Windows installers (`.exe`) and portable executables

---

## Architecture

```
+----------------------------------------------------------------------+
|                         CLIENT LAYER                                 |
|                                                                      |
|   +-----------------------------+   +-----------------------------+  |
|   |   Vanilla JS Hash SPA       |   |  Electron Desktop App       |  |
|   |   (HTML5 + Modular CSS)     |   |  (Desktop Window Shell)     |  |
|   |   8-Language i18n Engine    |   |  raktdal.onrender.com       |  |
|   |   Hash-based Routing (#/)   |   +-----------------------------+  |
|   |   PWA Offline Support       |                                    |
|   +------------+----------------+                                    |
+----------------+-----------------------------------------------------+
                 |  HTTPS REST / JSON (SameSite=None Cookies / Bearer)
                 v
+----------------------------------------------------------------------+
|                    API LAYER (Express 4 Modular Monolith)            |
|                                                                      |
|  +----------+ +----------+ +----------+ +----------+ +----------+  |
|  |  /auth   | | /donors  | |/requests | |  /camps  | |/inventory|  |
|  +----------+ +----------+ +----------+ +----------+ +----------+  |
|  +----------+ +----------+ +----------+                             |
|  |  /admin  | | /reports | | /notify  |                             |
|  +----------+ +----------+ +----------+                             |
|                                                                      |
|  Middleware Chain:                                                   |
|  [Helmet CSP] -> [CORS] -> [cookieParser] -> [rateLimiter]           |
|  -> [express.json] -> [express-mongo-sanitize] -> [verifyCsrf]       |
|  -> [authenticateSession] -> [authorizePlatformRole / authorizeOrg] |
+---------+------------------------------------------------------------+
          |
    +-----+--------------------------------------------------+
    |                   INTEGRATION LAYER                    |
    |                                                        |
    |  +------------------+  +------------------+            |
    |  | Google OAuth 2.0 |  | Resend / SMTP    |            |
    |  | (OpenID + PKCE)  |  | (Email Fallback) |            |
    |  +------------------+  +------------------+            |
    |  +------------------+  +------------------+            |
    |  | FCM Push API     |  | Event Dispatcher |            |
    |  | (Degradable)     |  | (Domain Events)  |            |
    |  +------------------+  +------------------+            |
    +-------------------------+------------------------------+
                              |
                              v
              +-------------------------------+
              |    DATABASE (MongoDB Atlas)   |
              |   14 Mongoose Schema Models   |
              |   Compound & Geo-Spatial Index|
              +-------------------------------+
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| HTML5 / CSS3 | Modern | Semantic layout & accessible components |
| Vanilla JavaScript | ES2022+ | Reactive SPA state, DOM patching, and routing |
| Hash-based Router | Custom | Client-side routing (`#/`, `#/find-blood`, `#/profile`, `#/camps`) |
| i18n Translation Engine | Custom | Client-side translation across 8 languages without page reloads |
| Google Fonts | Plus Jakarta Sans | Typography & interface aesthetics |
| Fetch API Client | Native | Automatic token refreshing, CSRF headers, and concurrency deduplication |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | `24.x` | High-performance server runtime |
| Express.js | `^4.21.2` | REST API routing and middleware framework |
| Mongoose | `^8.9.5` | ODM for MongoDB Atlas data validation & schemas |
| Google Auth Library | `^11.3.2` | Google OAuth 2.0 / OpenID Connect ID token verification |
| Argon2 | `^0.45.1` | OWASP-standard password hashing algorithm |
| JSONWebToken | `^9.0.3` | Signed short-lived JWT access tokens |
| Helmet | `^8.0.0` | HTTP security headers (CSP, HSTS, X-Frame-Options) |
| Cookie-Parser | `^1.4.7` | Secure HttpOnly cookie parsing |
| CORS | `^2.8.5` | Cross-Origin Resource Sharing control |
| Resend / Nodemailer | `^6.37.0` | Multi-provider transactional email delivery |
| Dotenv | `^16.4.7` | Environment variable management |

### Database

| Technology | Host | Purpose |
|---|---|---|
| MongoDB Atlas | Multi-region Cloud | Document storage, geo-spatial discovery, compound index deduplication |

### Desktop Packaging

| Tool | Version | Purpose |
|---|---|---|
| Electron | `^33.2.1` | Native cross-platform desktop window shell |
| `electron-builder` | `^25.1.8` | Windows NSIS installer and portable `.exe` builder |

---

## Directory Structure

```
RaktDal/
├── LICENSE
├── README.md
├── docs/
│   ├── TESTING_STRATEGY.md        # Testing methodology & quality gates
│   ├── TEST_CASES.md              # 6 complete end-to-end user journeys
│   ├── SECURITY_AUDIT.md          # OWASP Top 10 evaluation
│   ├── BUG_REPORT.md              # Historical bug fix & regression log
│   └── PRODUCTION_READINESS.md    # Deployment runbook & checklist
├── electron/
│   ├── main.js                    # Electron main process & secure navigation
│   ├── preload.js                 # Isolated renderer preload
│   ├── package.json               # Desktop dependencies & packaging config
│   └── dist/                      # Packaged Windows binaries (.exe)
└── raktdal-web/                   # Web application platform
    ├── frontend/
    │   ├── index.html             # Single entrypoint HTML & dynamic head
    │   ├── assets/
    │   │   └── logo-removebg.png  # Brand logo
    │   ├── css/
    │   │   └── styles.css         # Responsive styling (320px to 1920px)
    │   └── js/
    │       ├── app.js             # Bootstrap & initial state loader
    │       ├── api.js             # API client with token auto-refresh
    │       ├── auth.js            # Reactive authentication state manager
    │       ├── router.js          # Client-side hash router & route guards
    │       ├── donor.js           # Donor profile & discovery views
    │       ├── home.js            # Landing page views & animations
    │       ├── toast.js           # Non-blocking notification toasts
    │       ├── icons.js           # SVG icon catalog
    │       └── views/
    │           ├── admin.views.js # Admin dashboard & organization verification
    │           ├── auth.views.js  # Login, registration, OTP & reset views
    │           ├── camp.views.js  # Donation camp management views
    │           ├── request.views.js # Blood request & response views
    │           └── notification.views.js # In-app notification inbox
    └── backend/
        ├── package.json           # Backend scripts & runtime dependencies
        ├── .env.example           # Sanitized environment template
        ├── src/
        │   ├── app.js             # Express app setup, CSP & static serving
        │   ├── server.js          # HTTP server bootstrap & graceful shutdown
        │   ├── config/
        │   │   ├── database.js    # MongoDB Atlas connection lifecycle
        │   │   └── env.js         # Validated environment configuration
        │   ├── controllers/       # Business logic controllers
        │   ├── middleware/        # Auth, RBAC, Rate-Limiting & CSRF middleware
        │   ├── models/            # 14 Mongoose document schemas
        │   ├── routes/            # REST endpoint definitions
        │   ├── services/          # OAuth, email, notifications & events
        │   └── utils/             # Crypto, OTP, and response helpers
        └── tests/                 # 16 automated test suites (116 tests)
```

---

## Database Models & Schemas

The database layer utilizes **14 distinct Mongoose schemas** in MongoDB Atlas with strict schema-level validation constraints:

| Model | Collection | Primary Responsibility |
|---|---|---|
| `User` | `users` | Identity, email, Google Subject ID (`sub`), platform roles (`USER`, `ADMIN`), account status |
| `Session` | `sessions` | Active device sessions, hashed refresh tokens, IP address, user-agent |
| `DonorProfile` | `donors` | Blood group, geo-coordinates, city, PIN code, availability status, donation cooldowns |
| `BloodRequest` | `bloodrequests` | Patient name, hospital, units needed (capped at 50), urgency level, request lifecycle |
| `RequestResponse` | `requestresponses` | Donor responses, contact-sharing consent flag, response status |
| `Organization` | `organizations` | Blood banks and hospital profiles, license records, verification status |
| `DonationCamp` | `donationcamps` | Camp title, venue, dates, registration target capacity, camp status |
| `CampRegistration`| `campregistrations` | User camp registration records, attendance tracking |
| `Notification` | `notifications` | In-app notification items, unread counters, notification category |
| `NotificationPreference` | `notificationpreferences` | User-defined notification channel toggles |
| `AuditLog` | `auditlogs` | Immutable administrative audit trails with actor and IP logging |
| `FraudAlert` | `fraudalerts` | Reported listings, risk scores, moderation status |
| `EmailOtp` | `emailotps` | 6-digit numeric OTPs with SHA-256 hashing and expiration for MFA |
| `PasswordResetToken` | `passwordresettokens` | Single-use high-entropy password reset tokens |

---

## API Reference

All REST endpoints reside under the `/api/v1` namespace.

> **Authentication:** Via HttpOnly `accessToken` / `refreshToken` cookies or `Authorization: Bearer <token>`. State-mutating requests require `X-Requested-With: XMLHttpRequest` (CSRF defense).

### Health & System Status

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service uptime, database connectivity status, and environment |

### Authentication - `/api/v1/auth/`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/auth/google` | Generates PKCE code challenge and redirects to Google OAuth consent |
| `GET` | `/api/v1/auth/google/callback` | Exchanges authorization code, verifies ID token, establishes session |
| `GET` | `/api/v1/auth/me` | Returns authenticated user profile, permissions, and roles |
| `POST` | `/api/v1/auth/register` | Registers local account and dispatches 6-digit verification OTP |
| `POST` | `/api/v1/auth/verify-email` | Validates 6-digit email OTP and activates account |
| `POST` | `/api/v1/auth/login` | Local credential verification (Argon2) and session creation |
| `POST` | `/api/v1/auth/refresh` | Rotates refresh token and issues fresh short-lived access token |
| `POST` | `/api/v1/auth/logout` | Revokes current session and clears authentication cookies |
| `POST` | `/api/v1/auth/logout-all` | Revokes all active sessions across all devices for the user |
| `POST` | `/api/v1/auth/forgot-password` | Dispatches rate-limited single-use password reset token |
| `POST` | `/api/v1/auth/reset-password` | Resets password via verified token and revokes all active sessions |

### Donors & Discovery - `/api/v1/donors/`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/donors/search` | Location & blood group search. Strips all PII via `toPublicDiscovery()` |
| `GET` | `/api/v1/donors/me` | Retrieves full private profile for the authenticated donor |
| `POST` | `/api/v1/donors` | Creates donor profile with age bounds (18–65) and 6-digit PIN code |
| `PUT` | `/api/v1/donors/me` | Updates donor contact preferences, city, and location details |
| `PATCH` | `/api/v1/donors/availability` | Toggles donor availability status (`AVAILABLE`, `UNAVAILABLE`) |

### Blood Requests - `/api/v1/requests/`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/requests` | Public search for open emergency blood requests |
| `POST` | `/api/v1/requests` | Creates blood request (capped at 50 units for clinical safety) |
| `GET` | `/api/v1/requests/:id` | Detailed request view with patient information |
| `PATCH` | `/api/v1/requests/:id/status` | Owner/Admin status transition (`OPEN` → `FULFILLED` / `CANCELLED`) |
| `POST` | `/api/v1/requests/:id/respond` | Donor response submission with contact sharing consent |

### Donation Camps - `/api/v1/camps/`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/camps` | Discover upcoming verified community donation drives |
| `POST` | `/api/v1/camps` | Organization ADMIN camp creation with date & capacity bounds |
| `POST` | `/api/v1/camps/:id/register` | User camp registration (atomic capacity decrements) |
| `PATCH` | `/api/v1/camps/:id/attendance`| Marks attendance without altering medical donation status |

### Administration & Moderation - `/api/v1/admin/`

> **Authorization:** Strictly restricted to Platform `ADMIN`. Organization ADMIN receives HTTP 403.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/organizations` | Reviews pending blood bank and hospital verification applications |
| `PATCH`| `/api/v1/admin/organizations/:id` | Approves or rejects verification (mandatory rejection reason) |
| `GET` | `/api/v1/admin/audit-logs` | Immutable audit trail inspection with pagination |
| `PATCH`| `/api/v1/admin/users/:id/status` | Moderates user account status (suspension/activation) |

---

## Authentication Flow & Session Lifecycle

```
[User Browser]                      [Backend API]                    [Google OAuth]
      |                                   |                                 |
      |--- Click "Sign in with Google" -->|                                 |
      |                                   |--- Generate State & PKCE ------>|
      |                                   |    (Set oauth cookies)          |
      |<-- Redirect to Google Consent ----|                                 |
      |                                                                     |
      |----------------------- Enter Credentials -------------------------->|
      |                                                                     |
      |<-- Redirect with Code & State ----|                                 |
      |                                   |                                 |
      |--- GET /auth/google/callback ---->|                                 |
      |    (Carries state & code)         |--- Exchange Code + Verifier --->|
      |                                   |<-- Return ID Token (claims) ----|
      |                                   |                                 |
      |                                   |-- Verify Claims (sub, email)    |
      |                                   |-- Create Session & Tokens       |
      |                                   |-- Set HttpOnly Secure Cookies   |
      |<-- Redirect to /index.html#/profile                                 |
      |                                                                     |
      |--- GET /api/v1/auth/me ---------->|                                 |
      |    (Automatic session init)       |-- Returns User Profile JSON     |
```

### Security Properties
- **PKCE (Proof Key for Code Exchange):** S256 challenge generation prevents authorization code injection.
- **State Nonce Verification:** Cryptographically random single-use state prevents CSRF login replay.
- **Refresh Token Rotation:** Every refresh invalidates the previous refresh token. Reuse detection immediately revokes the entire token family.

---

## Privacy-by-Design & Security Controls

| Threat / Standard | Control Mechanism in RaktDal |
|---|---|
| **PII Data Leakage** | `toPublicDiscovery()` transform method strips phone numbers, emails, and street addresses from all public donor search results. |
| **Medical Boundary Protection** | Zero automated medical eligibility or clinical compatibility decisions are made by software. Clear disclaimers enforced. |
| **Insecure Direct Object References (IDOR)** | Explicit ownership checks (`resource.userId.equals(req.user._id)`) enforce that users can only modify their own data. |
| **Strict Role Separation** | Strict two-role platform model (`USER` and `ADMIN`). Organization administrators cannot access platform-wide endpoints. |
| **NoSQL Injection Defense** | `express-mongo-sanitize` strips `$` and `.` operators from request bodies, parameters, and query strings. |
| **Cross-Site Scripting (XSS)** | Enforced via Helmet HTTP headers (strict Content-Security-Policy) and DOM text encoding. |
| **Cross-Site Request Forgery (CSRF)** | State-changing requests enforce SameSite cookies and custom header verification (`X-Requested-With`). |
| **Formula Injection (CWE-1236)** | CSV export generator prepends a single quote (`'`) to any cell value beginning with `=`, `+`, `-`, or `@`. |

---

## Multilingual & Localization Engine

RaktDal features an integrated client-side localization system supporting **8 major Indian languages** without requiring page reloads or external translation APIs:

| Language | Code | Native Script |
|---|---|---|
| **English** | `en` | English |
| **Hindi** | `hi` | हिन्दी |
| **Bengali** | `bn` | বাংলা |
| **Marathi** | `mr` | मराठी |
| **Telugu** | `te` | తెలుగు |
| **Tamil** | `ta` | தமிழ் |
| **Punjabi** | `pa` | ਪੰਜਾਬੀ |
| **Gujarati** | `gu` | ગુજરાતી |

Language preference is persisted in `localStorage` (`raktdal_lang`) and applied reactively across all navigation headers, forms, status badges, and emergency request cards.

---

## Environment Configuration

### Backend: `raktdal-web/backend/.env`

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | Required | Port for Express server | `5000` (or `10000` on Render) |
| `NODE_ENV` | Required | Runtime environment | `development` or `production` |
| `MONGODB_URI` | Required | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/raktdal` |
| `FRONTEND_URL` | Required | Origin for CORS and redirects | `https://raktdal.onrender.com` |
| `GOOGLE_CLIENT_ID` | Required | OAuth 2.0 Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Required | OAuth 2.0 Client Secret | `GOCSPX-xxxx` |
| `GOOGLE_CALLBACK_URL` | Required | OAuth Callback URL | `https://raktdal.onrender.com/api/v1/auth/google/callback` |
| `JWT_SECRET` | Required | 256-bit secret for signing access tokens | High-entropy random 32+ character string |
| `RESEND_API_KEY` | Optional | API key for Resend email service | `re_xxxx` |
| `EMAIL_FROM` | Optional | Sender email identity | `RaktDal <notifications@yourdomain.org>` |
| `SMTP_USER` / `SMTP_PASS` | Optional | Gmail SMTP fallback credentials | `user@gmail.com` |

---

## Local Development Setup

### Prerequisites
- **Node.js:** `v20.x` or `v24.x`
- **npm:** `v10.x` or later
- **MongoDB:** MongoDB Atlas cluster or local MongoDB instance

### Step 1: Clone the Repository
```bash
git clone https://github.com/Vans30m/RaktDal.git
cd RaktDal
```

### Step 2: Configure Environment
Navigate to the backend directory and set up `.env`:
```bash
cd raktdal-web/backend
cp .env.example .env
# Edit .env with your MONGODB_URI and Google OAuth credentials
```

### Step 3: Install Dependencies & Run Tests
```bash
npm install
npm test
# -> Executes all 116 tests across 16 test suites
```

### Step 4: Start the Development Server
```bash
npm run dev
# -> Server running on port 5000 (serves both API and frontend SPA)
```

Open **`http://localhost:5000`** in your browser.

---

## Deployment (Render)

RaktDal is architected to deploy cleanly on Render as a **single unified Web Service** that simultaneously serves the static frontend SPA and the Express REST API.

### Render Web Service Configuration

| Setting | Value |
|---|---|
| **Name** | `raktdal` |
| **Region** | `Singapore` (or nearest region) |
| **Branch** | `main` |
| **Root Directory** | `raktdal-web/backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node src/server.js` |
| **Instance Type** | `Free` |

### Render Environment Variables
Add the required keys in the Render dashboard:
- `NODE_ENV=production`
- `PORT=10000`
- `MONGODB_URI=<your-atlas-uri>`
- `FRONTEND_URL=https://raktdal.onrender.com`
- `GOOGLE_CALLBACK_URL=https://raktdal.onrender.com/api/v1/auth/google/callback`
- `GOOGLE_CLIENT_ID=<your-google-client-id>`
- `GOOGLE_CLIENT_SECRET=<your-google-client-secret>`
- `JWT_SECRET=<your-high-entropy-jwt-secret>`

---

## Desktop App Build (Electron)

The standalone desktop executable is configured inside `electron/` using `electron-builder`.

```bash
cd electron

# Install desktop dependencies
npm install

# Run desktop app locally in development
npm start

# Build Windows installer and portable binary (.exe)
npm run build:win
```

### Generated Binaries (Output to `electron/dist/`):
1. **`RaktDal Setup 1.0.0.exe`** — Full Windows installer with desktop and Start Menu shortcuts.
2. **`RaktDal 1.0.0.exe`** — Portable executable that runs instantly on double-click without installation.

---

## Automated Testing & QA Architecture

RaktDal maintains a zero-dependency automated unit, integration, and security test suite powered by Node.js's native test runner (`node --test`). Tests utilize in-memory mock structures and deterministic cryptography, executing with zero network delays or external database dependencies.

### Running the Test Suite

```bash
cd raktdal-web/backend
npm test
```

### Test Coverage & Suite Breakdown

| Suite / Test File | Focus Areas & Security Controls | Assertions | Status |
|---|---|:---:|:---:|
| `tests/auth.test.js` | Access token JWT signing, expiration claims, tamper rejection, Argon2 hashing | 7 | **100% Pass** |
| `tests/auth_session.test.js` | Refresh token hashing, token family rotation, reuse detection logic, multi-device revocation | 7 | **100% Pass** |
| `tests/google_oauth.test.js` | PKCE S256 challenge, OAuth state nonce validation, token audience/issuer validation, account linking | 12 | **100% Pass** |
| `tests/rbac.test.js` | Role-based authorization (`USER` vs `ADMIN`), privilege separation, ownership verification, role tampering defense | 10 | **100% Pass** |
| `tests/donor_phase10.test.js` | Schema validation (age 18–65), Indian PIN code regex, `toPublicDiscovery()` PII concealment, NoSQL injection defense | 8 | **100% Pass** |
| `tests/blood_request.test.js` | 50-unit safety cap, urgency levels, state machine lifecycle transitions, duplicate donor response prevention | 9 | **100% Pass** |
| `tests/camp_phase13.test.js` | Camp capacity bounds, registration deadline enforcement, compound unique index deduplication, attendance vs donation separation | 8 | **100% Pass** |
| `tests/notification_phase14.test.js`| Notification type validation, user isolation, idempotency key deduplication, email fallback | 7 | **100% Pass** |
| `tests/admin_phase15.test.js` | Platform ADMIN privilege isolation, mandatory rejection reasons, document concealment, audit log immutability | 6 | **100% Pass** |
| `tests/reports_phase16.test.js` | Date range parsing, Anti-Formula Injection (CWE-1236) escaping (`=`, `+`, `-`, `@`), fulfillment rates | 5 | **100% Pass** |
| `tests/security_audit.test.js` | Insecure Direct Object References (IDOR), rate limiting middleware, XSS headers, 404 error integrity | 4 | **100% Pass** |
| `tests/otp.test.js` | 6-digit cryptographic OTP generation, SHA-256 hashing, expiration, attempt limiting lockout | 7 | **100% Pass** |
| `tests/password_reset.test.js` | High-entropy random reset tokens, credential reuse prevention, session revocation on password change | 7 | **100% Pass** |
| `tests/frontend_auth.test.js` | Base URL resolution, concurrency deduplication on token refresh, route guard mapping | 4 | **100% Pass** |
| `tests/phase19_readiness.test.js` | Production audit verification, rate limiter boundaries, route sanitization | 4 | **100% Pass** |
| `tests/health.test.js` | API runner availability and health response | 1 | **100% Pass** |
| **TOTAL** | **Enterprise Test Suite (Unit, Integration & Security)** | **116** | **116 / 116 (100%)** |

- **Execution Runtime:** ~3.2 seconds
- **Test Results:** 116 Passing, 0 Failing, 0 Skipped

---

## Medical Disclaimer

RaktDal is a **voluntary blood donor coordination and emergency request platform**, not a licensed healthcare provider, diagnostic laboratory, or blood bank.

- Blood stock information is reported directly by participating institutions and is intended solely for informational coordination.
- Registration on RaktDal does not guarantee donor availability or actual transfusion occurrence.
- Blood compatibility, donor physical eligibility, infectious disease screenings, and transfusion safety must always be evaluated by certified medical professionals.
- In critical medical emergencies, always coordinate directly with emergency medical services, licensed hospital blood banks, and official emergency helplines.

---

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for complete terms and permissions.

```
Copyright 2026 RaktDal Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

---

<div align="center">

**Dedicated to saving lives across India.**

*RaktDal — Every connection can save a life.*

[Live Platform](https://raktdal.onrender.com) · [GitHub Repository](https://github.com/Vans30m/RaktDal)

</div>
