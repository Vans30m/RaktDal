import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import bloodRequestRoutes from "./routes/bloodRequest.routes.js";
import requestResponseRoutes from "./routes/requestResponse.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const app = express();

app.use(helmet());
app.use(cookieParser());

// Allow configured FRONTEND_URL and common dev origins (both localhost and 127.0.0.1)
const allowedOrigins = [
  env.frontendUrl,
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5000"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Blocked by CORS: ${origin}`));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// API Routes
app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "RaktDal API is running.", environment: env.nodeEnv });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/requests", bloodRequestRoutes);
app.use("/api/v1/responses", requestResponseRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/reports", reportsRoutes);

// Fallback error handlers
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, _req, res, _next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error." });
});

export default app;
