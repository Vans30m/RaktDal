<div align="center">

<img src="frontend/assets/logo-removebg.png" alt="RaktDal Logo" width="90" />

# RaktDal

### *Connecting voluntary blood donors with patients who need them most.*

**A technology-driven platform for blood donation, emergency coordination, and donor discovery across India.**

<br/>

[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square)](LICENSE)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=flat-square&logo=node.js&logoColor=white)](backend/package.json)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS%20SPA-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](frontend/)
[![Auth](https://img.shields.io/badge/Auth-Google%20OAuth%202.0%20%2B%20JWT-4285F4?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/identity)
[![Tests](https://img.shields.io/badge/Tests-116%20Passing-success?style=flat-square&logo=checkmarx&logoColor=white)](backend/tests/)

</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Security](#security)
- [Multilingual Support](#multilingual-support)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Medical Disclaimer](#medical-disclaimer)
- [License](#license)

---

## About the Project

Every year, thousands of patients in India face life-threatening situations due to unavailability of compatible blood at the right time. Hospitals struggle to locate willing donors quickly. Donors remain unaware of nearby emergencies. Blood banks lack a unified way to broadcast their needs.

**RaktDal** was built to solve this coordination problem.

RaktDal is a pan-India blood donation and emergency coordination platform that connects:

- **Voluntary blood donors** who want to help
- **Patients and families** seeking compatible blood urgently
- **Hospitals and blood banks** managing requests and inventory
- **Donation camp organizers** running community drives

The platform prioritizes **donor privacy**, **consent-based participation**, and **verified information** — ensuring that every connection made through RaktDal is responsible, secure, and effective.

> *"Donate Blood. Share Hope. Save Lives."*

---

## Key Features

### 🔐 Authentication & Accounts

| Feature | Details |
|---|---|
| Email Registration & Login | Full account lifecycle with secure password hashing (Argon2) |
| OTP Email Verification | 6-digit time-limited OTP, SHA-256 hashed server-side |
| Google SSO (OAuth 2.0 + PKCE) | One-click sign-in with verified Google accounts |
| Multi-Device Session Management | View and revoke active sessions across devices |
| Password Reset via Email | Secure tokenized reset flow |
| JWT Auth with Token Rotation | Access + refresh tokens with family revocation on reuse detection |

### 🩸 Donor Discovery

| Feature | Details |
|---|---|
| Donor Registration & Profile | Blood group, location, age, consent & availability settings |
| Donor Availability Toggle | Real-time toggle between Available / Unavailable |
| Search by City, PIN Code & Blood Group | Multi-filter donor discovery |
| Privacy-Conscious Discovery | Contact info never publicly exposed; opt-in consent required |
| Profile Health Score | Completion indicator for donor profile quality |
| Donor Dashboard | Centralized hub for donor stats, availability, and history |

### 📋 Blood Request Coordination

| Feature | Details |
|---|---|
| Create Blood Requests | Specify blood group, component, units, hospital, urgency level |
| Public Request Listings | Browse emergency and scheduled requirements |
| My Requests Dashboard | Manage personal requests, track fulfillment status |
| Donor Response System | Donors accept/decline requests; requesters track responses |
| Urgency Classification | CRITICAL / URGENT / STANDARD priority levels |

### 🏥 Blood Banks & Donation Camps

| Feature | Details |
|---|---|
| Licensed Blood Bank Directory | Verified blood banks with contact details and location |
| Component-Level Inventory | Track whole blood, plasma, platelets, etc. |
| Donation Camp Listings | Public camps by verified organizations with slot tracking |
| Camp Registration | Register to donate at a specific camp; manage registrations |
| Organization Profiles | Verified organizational accounts for hospitals and blood banks |

### 🔔 Notifications & Communication

| Feature | Details |
|---|---|
| In-App Notifications | Real-time alerts for blood requests, responses, and system events |
| WebSocket Real-Time Updates | Live push via `ws` for instant notification delivery |
| Email Notifications | Transactional emails via Nodemailer (SMTP) or Resend API |
| Notification Preferences | Granular control over which events trigger notifications |
| Notification History | Paginated notification inbox with read/unread states |

### 🛡️ Administration

| Feature | Details |
|---|---|
| Admin Dashboard | Platform oversight, stats, and moderation tools |
| User & Organization Verification | Manual verification workflows for trusted accounts |
| Fraud Alert System | Flagging and review of suspicious activity |
| Audit Logging | Detailed audit trail for sensitive admin operations |
| Role-Based Access Control | USER / DONOR / ADMIN roles with scoped permissions |

### 🌐 Additional

| Feature | Details |
|---|---|
| Multilingual Interface | 6 Indian languages: English, Hindi, Bengali, Marathi, Telugu, Tamil |
| Progressive Web App | Installable, offline-capable, service worker enabled |
| Privacy Policy, Terms & Disclaimer | Full legal pages built into the platform |
| Help & FAQ | Searchable FAQ with accordion interface |
| Contact Page | Dedicated support contact interface |

---

## Screenshots

> Screenshots from the live development build.

<table>
  <tr>
    <td align="center"><strong>Donor Profile Hub</strong></td>
    <td align="center"><strong>Blood Requests</strong></td>
  </tr>
  <tr>
    <td>Donor profile dashboard with availability toggle, profile health score, and stats.</td>
    <td>Browse emergency and scheduled blood requirements with urgency indicators.</td>
  </tr>
  <tr>
    <td align="center"><strong>Blood Banks</strong></td>
    <td align="center"><strong>Donation Camps</strong></td>
  </tr>
  <tr>
    <td>Directory of verified licensed blood banks with contact info and location.</td>
    <td>Discover and register for upcoming blood donation drives near you.</td>
  </tr>
  <tr>
    <td align="center"><strong>My Requests</strong></td>
    <td align="center"><strong>User Profile</strong></td>
  </tr>
  <tr>
    <td>Personal request management with fulfillment tracking and donor responses.</td>
    <td>Account dashboard with sessions, verification status, and profile details.</td>
  </tr>
</table>

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Custom design system, responsive layouts, animations |
| **Vanilla JavaScript (ES Modules)** | SPA logic, DOM rendering, state management |
| **Hash-based Router** | Client-side navigation without a framework (`#/route`) |
| **Web App Manifest + Service Worker** | PWA installability and offline caching |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime (v18+) |
| **Express.js v4** | HTTP server and REST API framework |
| **Mongoose v8** | MongoDB ODM with schema validation |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Argon2** | Secure password hashing (PHC winner) |
| **jsonwebtoken** | JWT-based access and refresh token management |
| **google-auth-library** | Google OAuth 2.0 / OpenID Connect + PKCE |
| **nodemailer** | SMTP email delivery for OTP and notifications |
| **resend** | Alternative transactional email provider |
| **ws** | WebSocket server for real-time notifications |
| **helmet** | Security headers and CSP configuration |
| **cors** | Cross-Origin Resource Sharing control |
| **cookie-parser** | HTTP-only cookie handling |
| **dotenv** | Environment variable management |

### Development & Testing

| Tool | Purpose |
|---|---|
| **Node.js built-in test runner** | 116 automated tests (`node --test`) |
| **nodemon** | Auto-restart dev server on file changes |
| **live-server** | Static file server for frontend development |
| **Git + GitHub** | Version control and collaboration |

---

## Architecture

RaktDal follows a **decoupled client-server architecture** with a Vanilla JS SPA frontend communicating with an Express.js REST API backend.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Vanilla JS Single-Page App                 │   │
│   │                                                         │   │
│   │  router.js → views/*.js → api.js → auth.js → toast.js  │   │
│   │                    Hash-based routing (#/route)         │   │
│   └───────────────────────┬─────────────────────────────────┘   │
└───────────────────────────│─────────────────────────────────────┘
                            │  REST API calls + WebSocket (ws://)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXPRESS.JS BACKEND (:5000)                    │
│                                                                 │
│   app.js ──► Routes ──► Controllers ──► Services ──► Models    │
│                                                                 │
│   /api/v1/auth        /api/v1/donors      /api/v1/requests      │
│   /api/v1/camps       /api/v1/notifications  /api/v1/admin      │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│   │  Auth Layer  │  │  Rate Limiter│  │  Helmet / CORS     │   │
│   │  JWT + Argon2│  │  (in-memory) │  │  Security Headers  │   │
│   └──────────────┘  └──────────────┘  └────────────────────┘   │
└───────┬─────────────────────┬──────────────────────┬────────────┘
        │                     │                      │
        ▼                     ▼                      ▼
┌──────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│  MongoDB     │   │  Google OAuth    │   │  Email Service      │
│  Atlas       │   │  2.0 (PKCE)      │   │  Nodemailer / Resend│
│  (Mongoose)  │   │                  │   │  (OTP + Notify)     │
└──────────────┘   └──────────────────┘   └─────────────────────┘
```

**Data Models:** `User` · `Session` · `DonorProfile` · `BloodRequest` · `RequestResponse` · `DonationCamp` · `CampRegistration` · `Organization` · `Notification` · `NotificationPreference` · `EmailOtp` · `PasswordResetToken` · `AuditLog` · `FraudAlert`

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local instance or MongoDB Atlas cluster)
- **Git**
- A Google Cloud Console project with OAuth 2.0 credentials
- An SMTP email account (Gmail app password) or a [Resend](https://resend.com) API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/RaktDal.git
cd RaktDal

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in all required values (see Environment Variables below)

# 4. Start the backend server
npm run dev        # development (auto-restarts with nodemon)
# or
npm start          # production
```

```bash
# 5. Serve the frontend (in a separate terminal from repo root)
npx live-server frontend --port=5500 --host=127.0.0.1
# Then open: http://127.0.0.1:5500/index.html
```

### Running Tests

```bash
# Run all 116 backend tests from the repo root
npm test --prefix backend
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory using `.env.example` as the template:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

# Frontend Origin (for CORS)
FRONTEND_URL=http://localhost:5500

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# JWT
JWT_SECRET=your-jwt-secret-key-change-in-production

# Email — Option A: Gmail SMTP
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-google-app-password

# Email — Option B: Resend (alternative)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=RaktDal <onboarding@resend.dev>
```

> **Never commit your `.env` file.** It is listed in `.gitignore`.

---

## Project Structure

```
RaktDal/
│
├── frontend/                        # Vanilla JS Single-Page Application
│   ├── index.html                   # App shell (single HTML entry point)
│   ├── assets/
│   │   └── logo-removebg.png        # Brand logo
│   ├── css/
│   │   └── styles.css               # Complete design system & all page styles
│   └── js/
│       ├── router.js                # Hash-based SPA router with route guards
│       ├── api.js                   # Centralized API client (fetch wrapper)
│       ├── auth.js                  # Auth state management & token refresh
│       ├── app.js                   # App initialization & global listeners
│       ├── home.js                  # Homepage logic
│       ├── donor.js                 # Donor-specific helpers
│       ├── realtime.js              # WebSocket client for live notifications
│       ├── icons.js                 # SVG icon library
│       ├── toast.js                 # Toast notification system
│       └── views/                   # Page view modules (render + data fetch)
│           ├── auth.views.js        # Login, register, OTP, profile pages
│           ├── request.views.js     # Blood request listing and management
│           ├── camp.views.js        # Donation camp views
│           ├── info.views.js        # Static pages: Privacy, Terms, Help, etc.
│           ├── notification.views.js # Notifications inbox & settings
│           └── admin.views.js       # Admin dashboard views
│
├── backend/                         # Node.js / Express REST API
│   ├── package.json
│   ├── .env.example                 # Environment variable template
│   └── src/
│       ├── server.js                # HTTP + WebSocket server entry point
│       ├── app.js                   # Express app setup, middleware, routes
│       ├── config/
│       │   ├── database.js          # MongoDB connection
│       │   └── env.js               # Environment config validation
│       ├── controllers/             # Route handler logic
│       │   ├── auth.controller.js
│       │   ├── donor.controller.js
│       │   ├── bloodRequest.controller.js
│       │   ├── camp.controller.js
│       │   ├── notification.controller.js
│       │   ├── requestResponse.controller.js
│       │   ├── reports.controller.js
│       │   └── admin.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js   # JWT verification & role guards
│       │   └── rateLimiter.js       # In-memory sliding window rate limiter
│       ├── models/                  # Mongoose schemas
│       │   ├── User.js              ├── Session.js
│       │   ├── DonorProfile.js      ├── BloodRequest.js
│       │   ├── RequestResponse.js   ├── DonationCamp.js
│       │   ├── CampRegistration.js  ├── Organization.js
│       │   ├── Notification.js      ├── NotificationPreference.js
│       │   ├── EmailOtp.js          ├── PasswordResetToken.js
│       │   ├── AuditLog.js          └── FraudAlert.js
│       ├── routes/                  # Express route definitions
│       ├── services/                # Business logic layer
│       │   ├── googleAuth.service.js
│       │   ├── email.service.js
│       │   ├── notification.service.js
│       │   ├── realtime.service.js
│       │   ├── camp.service.js
│       │   ├── admin.service.js
│       │   ├── reports.service.js
│       │   └── eventDispatcher.service.js
│       └── utils/
│           ├── otp.js               # OTP generation and verification
│           ├── security.js          # Security helpers
│           └── response.js          # Standardized API response formatter
│
├── backend/tests/                   # 116 automated backend tests
│   ├── auth.test.js
│   ├── auth_session.test.js
│   ├── google_oauth.test.js
│   ├── otp.test.js
│   ├── password_reset.test.js
│   ├── rbac.test.js
│   ├── security_audit.test.js
│   ├── donor_phase10.test.js
│   ├── blood_request.test.js
│   ├── camp_phase13.test.js
│   ├── notification_phase14.test.js
│   ├── admin_phase15.test.js
│   ├── reports_phase16.test.js
│   └── phase19_readiness.test.js
│
├── docs/                            # Technical documentation
│   ├── API_DOCUMENTATION.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── SECURITY_AUDIT.md
│   ├── TESTING_STRATEGY.md
│   ├── PRODUCTION_READINESS.md
│   └── openapi.yaml
│
├── .gitignore
├── LICENSE                          # Apache License 2.0
└── README.md
```

---

## API Reference

All API endpoints are prefixed with `/api/v1`.

| Module | Base Path | Access | Description |
|---|---|---|---|
| Health | `/health` | Public | Server liveness and system status |
| Authentication | `/auth` | Public / Session | Registration, login, Google OAuth, OTP, sessions |
| Donors | `/donors` | Mixed | Donor registration, profile, search, availability |
| Blood Requests | `/requests` | Authenticated | Create, browse, manage blood requests |
| Request Responses | `/requests/:id/responses` | Authenticated | Donor response management |
| Organizations | `/organizations` | Mixed | Blood bank profiles and inventory |
| Donation Camps | `/camps` | Mixed | Camp listings, management, registrations |
| Notifications | `/notifications` | Authenticated | In-app notification inbox and preferences |
| Reports | `/reports` | Admin | Analytics and administrative reports |
| Administration | `/admin` | Admin only | User management, verification, moderation |

> Full API documentation: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)  
> OpenAPI specification: [`docs/openapi.yaml`](docs/openapi.yaml)

---

## Security

RaktDal implements defense-in-depth across all layers:

| Layer | Mechanism |
|---|---|
| **Password Storage** | Argon2id hashing (PHC winner; resistant to GPU/ASIC attacks) |
| **Authentication Tokens** | Short-lived JWT access tokens + rotating refresh tokens |
| **Token Reuse Detection** | Refresh token family revocation on reuse — detects session theft |
| **Google Auth** | OAuth 2.0 with PKCE; ID token verified server-side via Google's library |
| **OTP Security** | 6-digit OTP hashed with SHA-256; time-limited expiry |
| **Session Management** | Per-device sessions; individual and bulk session revocation |
| **Rate Limiting** | In-memory sliding-window limiter on auth and sensitive routes |
| **CSRF Protection** | `X-Requested-With` header validation on state-changing requests |
| **Security Headers** | Helmet.js with strict Content Security Policy (CSP) |
| **CORS Policy** | Explicit origin allowlist; no wildcard production origins |
| **Input Validation** | Mongoose schema-level type and constraint enforcement |
| **NoSQL Injection Prevention** | Sanitized query construction; schema-defined paths only |
| **Role-Based Access Control** | USER / DONOR / ADMIN roles enforced at middleware level |
| **Audit Logging** | Tamper-evident audit log for all sensitive admin operations |
| **Fraud Detection** | FraudAlert model for flagging and reviewing suspicious patterns |
| **Donor Privacy** | Contact info never publicly exposed; explicit opt-in consent required |

> Security audit documentation: [`docs/SECURITY_AUDIT.md`](docs/SECURITY_AUDIT.md)

---

## Multilingual Support

RaktDal supports six Indian languages across the entire interface:

| Language | Code | Script |
|---|---|---|
| English | `en` | Latin |
| Hindi | `hi` | Devanagari |
| Bengali | `bn` | Bengali |
| Marathi | `mr` | Devanagari |
| Telugu | `te` | Telugu |
| Tamil | `ta` | Tamil |

Language selection is available in the navigation bar and persists across sessions.

---

## Roadmap

RaktDal is developed in structured milestones:

| Phase | Focus Area | Status |
|---|---|---|
| 1 | Requirements, database design & monorepo setup | ✅ Complete |
| 2 | Google OAuth 2.0, session lifecycle & user roles | ✅ Complete |
| 3 | Email OTP verification & password reset | ✅ Complete |
| 4 | Donor profiles, search & privacy consent | ✅ Complete |
| 5 | Blood requests, urgency levels & status tracking | ✅ Complete |
| 6 | Donor response system & request coordination | ✅ Complete |
| 7 | Blood bank directory & organization profiles | ✅ Complete |
| 8 | Donation camp management & registrations | ✅ Complete |
| 9 | In-app notifications & WebSocket real-time delivery | ✅ Complete |
| 10 | Admin dashboard, verification & fraud detection | ✅ Complete |
| 11 | Multilingual support (6 languages) | ✅ Complete |
| 12 | PWA support (manifest + service worker) | ✅ Complete |
| 13 | Comprehensive security audit & 116 automated tests | ✅ Complete |
| 14 | Frontend UI redesign — premium red/navy design system | ✅ Complete |
| 15 | Production deployment on Render | 🔄 In Progress |
| 16 | Mobile app (React Native) | 📋 Planned |
| 17 | Real-time blood inventory for banks | 📋 Planned |
| 18 | SMS notifications & hospital API integration | 📋 Planned |

---

## Contributing

Contributions are welcome. Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Make** focused, well-tested changes
4. **Run tests** before committing: `npm test --prefix backend`
5. **Commit** with a clear message: `git commit -m "feat: describe your changes"`
6. **Push** to your fork: `git push origin feature/your-feature-name`
7. **Open** a Pull Request describing what changed and why

**Guidelines:**
- Follow the existing code style and naming conventions
- Keep changes modular and focused on one concern
- Never commit credentials, `.env` files, or secrets
- Ensure all 116 existing tests continue to pass

---

## Medical Disclaimer

RaktDal is a **blood donation coordination platform**, not a medical service provider.

- Blood availability information is reported by participating organizations and is not guaranteed in real time.
- Donor participation does not guarantee that a donation will occur.
- Blood compatibility, donor eligibility, and transfusion suitability must be assessed by qualified medical professionals.
- Always coordinate directly with authorized hospitals and licensed blood banks for clinical decisions.

---

## License

This project is licensed under the **Apache License 2.0**.

See the [LICENSE](LICENSE) file for the full license text.

---

<div align="center">

**Made with ❤️ for a healthier India.**

*RaktDal — Every connection can save a life.*

</div>
