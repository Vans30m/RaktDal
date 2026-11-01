import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(helmet());
app.use(cookieParser());

// Strict CORS: Explicit origin (never wildcard *), credentials true, custom CSRF header allowed
app.use(cors({
  origin: env.frontendUrl,
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

// Fallback error handlers
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, _req, res, _next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error." });
});

export default app;
