# RaktDal

**Blood Donation & Donor Coordination Platform**

RaktDal is planned as a pan-India platform to help people discover opted-in blood donors, blood banks, reported inventory and donation camps.

## Technology
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- Hosting target: Render

## Repository
- `frontend/` — browser application
- `backend/` — REST API
- `docs/` — project documentation

## Local development

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API health check is available at `http://localhost:5000/api/v1/health`.

### Frontend
Serve the `frontend/` directory using VS Code Live Server or another static file server. The default backend CORS origin is configured for `http://localhost:5500`; update `FRONTEND_URL` if your local server uses a different origin.

## Important
This is the initial project scaffold only. Authentication, donor discovery, requests, inventory, camps, notifications and admin workflows are not implemented yet. Do not use it for real blood coordination until the required safety, privacy and verification features are completed and tested.
