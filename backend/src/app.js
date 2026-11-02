import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import donorRoutes from "./routes/donor.routes.js";

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
app.use("/api/v1/donors", donorRoutes);

// Dynamically load future colleague routes if available (Phase 11: bloodRequest, requestResponse, admin, reports)
async function registerColleagueRoutes() {
  const optionalModules = [
    { path: "/api/v1/requests", file: "./routes/bloodRequest.routes.js" },
    { path: "/api/v1/responses", file: "./routes/requestResponse.routes.js" },
    { path: "/api/v1/admin", file: "./routes/admin.routes.js" },
    { path: "/api/v1/reports", file: "./routes/reports.routes.js" }
  ];

  for (const mod of optionalModules) {
    try {
      const routeModule = await import(mod.file);
      if (routeModule?.default) {
        app.use(mod.path, routeModule.default);
      }
    } catch {
      // Colleague route file not yet present in repository; skipped safely without crashing
    }
  }
}
registerColleagueRoutes();

// Fallback error handlers
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, _req, res, _next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error." });
});

export default app;
