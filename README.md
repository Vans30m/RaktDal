# 🩸 RaktDal – Blood Donation & Donor Coordination Platform

<p align="center">
  <strong>Every Connection Can Save a Life.</strong>
</p>

<p align="center">
  A technology-driven platform connecting blood donors, people in need of blood, hospitals, blood banks, and donation camp organizers across India.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange" alt="Project Status" />
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-blue" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green" alt="Backend" />
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen" alt="Database" />
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License" />
</p>

---

## About RaktDal

**RaktDal** is a pan-India blood donation and donor coordination platform designed to make blood donation connections easier, faster, and more organized.

Finding suitable blood donors during emergencies can be challenging. RaktDal aims to bridge the gap between people seeking blood, willing donors, hospitals, verified blood banks, and donation camp organizers through a centralized digital platform.

The platform provides tools for donor discovery, blood request coordination, blood bank inventory visibility, donation camp management, and organizational collaboration.

RaktDal focuses on responsible coordination, donor privacy, consent-based participation, and reliable information sharing.

> **Our Vision:** Build a connected community where technology helps people find opportunities to donate blood and coordinate blood donation support responsibly.

---

## Key Features

### 1. Donor Management
- Donor registration and profile management.
- Blood group information.
- City and PIN code-based location details.
- Donor availability management.
- Notification and discovery preferences.
- Consent-based donor participation.

### 2. Donor Discovery
- Search participating donors by city.
- Search using PIN code.
- Filter by blood group.
- Filter by donor availability.
- Privacy-conscious donor discovery.
- Pagination for search results.

### 3. Blood Request Coordination
- Create blood requests.
- Specify required blood group and component.
- Provide hospital and location information.
- Notify eligible, opted-in participating donors.
- Allow donors to independently accept or decline requests.
- Track request responses and status changes.

### 4. Blood Bank & Inventory Management
- Verified blood bank organization profiles.
- Manage blood inventory.
- Track blood components and quantities.
- Display reported stock information.
- Maintain inventory update timestamps.
- Track inventory history.

### 5. Donation Camp Management
- Create and manage donation camps.
- Publish camp information.
- Manage registrations.
- Track attendance.
- Publish camp reports.

### 6. Notifications
- In-app notifications.
- Email notifications.
- Push notification support where configured.
- Notification preferences.
- Consent-based communication.

### 7. Administration & Verification
- User and organization verification.
- Organization management.
- Blood request monitoring.
- Donation camp oversight.
- Fraud reporting and review.
- Audit logs.
- Administrative dashboards.

### 8. Multilingual Support
RaktDal supports six Indian languages:

| Language | Code |
|---|---|
| English | en |
| Hindi | hi |
| Bengali | bn |
| Marathi | mr |
| Telugu | te |
| Tamil | ta |

### 9. Progressive Web App
- Installable application experience.
- Responsive mobile interface.
- App-like standalone display.
- Offline access to permitted public application resources.
- Service worker and caching support.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 |
| Styling | CSS3 |
| Frontend Logic | Vanilla JavaScript |
| Routing | Hash-based SPA Routing |
| Backend | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | Google OAuth 2.0 / OpenID Connect |
| API Architecture | RESTful APIs |
| PWA | Web App Manifest & Service Worker |
| Version Control | Git & GitHub |
| Deployment | Render |

### Architecture

RaktDal follows a **Modular Monolith Architecture**.

The Express backend serves both the frontend and backend APIs through a single application server.

```text
                    RAKTDAL
                       |
              User / Web Browser
                       |
                Express Server
                  Port 5500
                       |
              +--------+--------+
              |                 |
          Frontend           Backend
              |                 |
         HTML / CSS / JS    REST APIs
              |                 |
         SPA Router       Controllers
                                |
                            Services
                                |
                             Models
                                |
                         MongoDB Atlas
```

This architecture keeps the application organized while avoiding the unnecessary complexity of microservices.

---

## Project Structure

```text
RaktDal/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── router.js
│   │   ├── donor.js
│   │   ├── home.js
│   │   ├── views/
│   │   └── i18n/
│   │       ├── i18n.js
│   │       └── locales/
│   └── pages/
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── tests/
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       └── utils/
│
├── docs/
│   ├── architecture.md
│   ├── database-design.md
│   ├── api-documentation.md
│   └── phase-19-testing-security-performance-report.md
│
├── .gitignore
└── README.md
```

---

## Getting Started

Follow these instructions to run RaktDal locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) – LTS version recommended (Node >= 18).
- npm – Included with Node.js.
- [Git](https://git-scm.com/).
- MongoDB Atlas account.
- Google Cloud project with OAuth credentials configured.

### 1. Clone the repository

```bash
git clone https://github.com/Vans30m/RaktDal.git
cd RaktDal
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` directory (see `backend/.env.example` for reference):

```env
NODE_ENV=development
PORT=5500

MONGODB_URI=your_mongodb_atlas_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_oauth_callback_url

SESSION_SECRET=your_session_secret
CORS_ALLOWLIST=http://localhost:5500
```

> **Important:** Never commit your actual `.env` file or expose database credentials, OAuth secrets, session secrets, or API keys.

### 4. Start the application

From the `backend/` directory:

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

The Express server serves both the frontend static assets/SPA and the API endpoints.

Open your browser:

**http://localhost:5500**

No separate frontend development server is required.

### 5. Health Check

Test the backend health endpoint:

```text
GET http://localhost:5500/api/v1/health
```

### 6. Running Tests

Execute the backend automated test suite:

```bash
npm test --prefix backend
```

---

## API Architecture

RaktDal uses RESTful APIs with a common version prefix:

```text
/api/v1
```

| Module | Endpoint Group | Auth | Notes |
|---|---|---|---|
| Health | `/api/v1/health` | Public | Connectivity & system status |
| Authentication | `/api/v1/auth` | Public / Session | Google OAuth & session management (rate-limited) |
| Donors | `/api/v1/donors` | Mixed | Registration, profile, search (rate-limited) |
| Blood Requests | `/api/v1/requests` | Authenticated | Create, track, and coordinate blood requests |
| Organizations | `/api/v1/organizations` | Mixed | Blood bank profiles & inventory visibility |
| Donation Camps | `/api/v1/camps` | Mixed | Camp listings, management & registrations |
| Notifications | `/api/v1/notifications` | Authenticated | In-app notification management |
| Administration | `/api/v1/admin` | Admin only | Verification, moderation & oversight |

---

## Security & Privacy

RaktDal treats donor privacy and data security as essential requirements.

Security principles include:

- Google OAuth-based authentication with ID token & PKCE verification.
- Secure session management with HTTP-only, SameSite cookies.
- Role-based access control (User, Admin, Organization).
- Input validation and sanitization with Mongoose schemas.
- In-memory sliding-window rate limiting on sensitive routes.
- Helmet-configured Content Security Policy (CSP).
- Restricted access to sensitive verification documents.
- Privacy-conscious donor discovery (opt-in consent required).
- Explicit donor consent for communication and contact sharing.
- Audit logging for sensitive administrative operations.

### Donor Privacy

- Donor contact information is never exposed publicly.
- Donors control their discovery and notification preferences.
- Contact details are shared only with appropriate authorization and consent.
- Private donor information is never stored in public caches.

---

## Development Roadmap

RaktDal is developed in structured milestones:

| Area | Scope & Description |
|---|---|
| Requirements & Architecture | Database design, API design & unified monorepo setup |
| Authentication & Users | Google OAuth 2.0 / OpenID Connect, session lifecycle & roles |
| Donor Profiles & Discovery | Location filtering, PIN code search & privacy consent |
| Blood Requests & Matching | Emergency coordination, donor notifications & status tracking |
| Blood Banks & Camps | Inventory tracking, camp drives & volunteer registrations |
| Multilingual Support | 6-language i18n support across all interface views |
| Testing & Optimization | Comprehensive security audit, rate limiting & 100+ automated tests |
| Production Deployment | Production release on Render with automated health monitoring |

---

## Team

RaktDal is being developed by a three-member team.

The project uses a collaborative development approach with Git and GitHub.

Team responsibilities include:
- Frontend development & UI design.
- Backend and API development.
- Database design and integration.
- Authentication and security.
- Testing, QA and deployment.

### Contribution Guidelines

Contributions should follow these practices:

1. Create a separate feature branch.
2. Keep changes focused and modular.
3. Follow existing coding conventions.
4. Test changes before committing (`npm test --prefix backend`).
5. Avoid committing credentials or sensitive data.
6. Submit changes through pull requests.
7. Review changes before merging into the main branch.

Example:

```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "feat: describe your changes"
git push origin feature/your-feature-name
```

---

## Important Medical Disclaimer

RaktDal is a blood donation coordination platform, not a medical service provider.

- The platform does not independently guarantee real-time blood availability.
- Blood inventory information is reported by participating organizations.
- Donor participation does not guarantee donation.
- Blood compatibility, donor eligibility, and transfusion suitability must be assessed by qualified medical professionals.
- Users should coordinate directly with authorized hospitals and blood banks for medical decisions.

RaktDal is designed to facilitate responsible coordination and information sharing.

---

## Future Vision

Our long-term vision is to build a reliable digital ecosystem for blood donation coordination across India.

We aim to make it easier for people to discover participating donors, connect with verified organizations, coordinate blood requests, and discover donation opportunities.

Through technology, collaboration, and responsible data practices, RaktDal hopes to strengthen the blood donation community.

<p align="center">
  <strong>Donate Blood. Share Hope. Save Lives.</strong>
</p>

<p align="center">
  Made with ❤️ for a healthier India.
</p>

---

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for the full license text and terms.
