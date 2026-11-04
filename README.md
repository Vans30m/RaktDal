# RaktDal – Pan‑India Blood Donation Platform

[!NOTE] This README reflects recent changes and UI improvements.

## Project Overview
RaktDal is a web platform that connects blood donors with recipients across India. It provides:
- Donor registration and profile management
- Blood‑request creation and matching
- Blood‑bank inventory tracking
- Donation camp organization
- Real‑time in‑app notifications
- Multi‑language support (English, Hindi, Bengali, Marathi, Telugu, Tamil)

The application is built with **Vanilla JS** on the frontend and **Node.js/Express** with **MongoDB Atlas** on the backend.

## Setup & Installation
```bash
# Clone the repository (if you haven't already)
git clone <repo‑url>
cd RaktDal

# Ensure you have Node.js >= 18
node -v

# Install dependencies
npm install   # installs root dev tools (e.g., nodemon)
npm install --prefix backend   # backend dependencies
npm install --prefix frontend  # frontend dependencies (if any)
```

Create a `.env` file in `backend/` (see `backend/.env.example` for required variables):
- `PORT` – port for the Express server (default 5500)
- `MONGODB_URI` – MongoDB Atlas connection string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` – for OAuth login
- `SESSION_SECRET` – secret for signed cookies
- `CORS_ALLOWLIST` – comma‑separated list of allowed origins

## Running the Application
```bash
# Development (auto‑restart with nodemon)
npm run dev --prefix backend

# Production (single‑server mode)
npm start --prefix backend   # runs node backend/src/server.js
```
The server now serves static assets, the SPA, and a health‑check endpoint.

## New Features
- **In‑memory sliding‑window rate limiter** (`backend/src/middleware/rateLimiter.js`) applied to auth, password‑reset and public donor‑search routes.
- **Static asset serving & SPA fallback** – Express now serves `frontend/` files and rewrites unknown routes to `index.html` for hash‑based routing.
- **Helmet CSP enhancements** – CSP now includes Google OAuth domains, Google Fonts, and required script sources.
- **Health‑check endpoint** (`GET /api/v1/health`) returns `200` when DB connectivity is healthy, otherwise `503`.
- **Unified UI styling** – donor registration, blood‑request creation, and profile edit pages now share a common layout and card‑based design.
- **Security audit** – comprehensive report generated under `docs/phase-19-testing-security-performance-report.md`.

## API Overview
Base URL: `http://localhost:5500/api/v1`

| Category | Endpoints | Auth | Rate‑limited |
|---|---|---|---|
| Auth | `POST /auth/google`, `GET /auth/callback`, `POST /auth/logout` | No | ✅ (login & callback) |
| Donor | `GET /donors/:id`, `POST /donors`, `PUT /donors/:id` | Yes | ✅ (public search) |
| Request | `POST /requests`, `GET /requests/:id`, `PATCH /requests/:id` | Yes | – |
| Bank | `POST /banks`, `GET /banks/:id` | Admin only | – |
| Camp | `POST /camps`, `GET /camps`, `PUT /camps/:id` | Org admin | – |
| Notification | `GET /notifications`, `PATCH /notifications/:id` | Yes | – |

All responses follow the standard `{ success: boolean, data?: any, error?: string }` JSON format.

## Testing
```bash
# Run the backend test suite (108 tests passing)
npm test --prefix backend
```
The suite includes the new audit tests located in `backend/tests/phase19_readiness.test.js`.

## Security & Audits
A full production‑readiness audit was performed (see `docs/phase-19-testing-security-performance-report.md`). Highlights:
- Robust Google OAuth validation (state, PKCE, ID‑token verification)
- Strict role‑based access control (user, admin, organization)
- NoSQL‑injection and XSS mitigations via Mongoose schemas and Helmet
- Secure cookies (`httpOnly`, `sameSite=strict`)
- Rate limiting to mitigate abuse
- CSP configured to allow only required external resources

## Deployment
The app can be deployed as a single Express server (e.g., Render, Railway, or any Node host). Ensure the following environment variables are set in the target environment:
- `PORT`
- `MONGODB_URI`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`
- `CORS_ALLOWLIST`

Static files are served from `frontend/`; no separate web server is required.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Install dependencies and run tests (`npm test --prefix backend`).
4. Follow the existing linting rules (`npm run lint`).
5. Submit a Pull Request.

## License
[MIT License](LICENSE)