import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import path from "path";
import { fileURLToPath } from "url";
import { isDatabaseConnected } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import campRoutes from "./routes/camp.routes.js";
import bloodRequestRoutes from "./routes/bloodRequest.routes.js";
import requestResponseRoutes from "./routes/requestResponse.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import locationRoutes from "./routes/location.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "../../frontend");


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://accounts.google.com",
        "https://translate.google.com",
        "https://translate.googleapis.com",
        "https://*.google.com",
        "https://*.gstatic.com"
      ],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://accounts.google.com",
        "https://translate.google.com",
        "https://translate.googleapis.com",
        "https://*.google.com",
        "https://*.gstatic.com"
      ],
      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://translate.googleapis.com",
        "https://translate.google.com",
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.gstatic.com",
        "http://localhost:*",
        "http://127.0.0.1:*"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://translate.googleapis.com",
        "https://translate.google.com",
        "https://*.google.com",
        "https://*.gstatic.com"
      ],
      styleSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://translate.googleapis.com",
        "https://translate.google.com",
        "https://*.google.com",
        "https://*.gstatic.com"
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://*.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:",
        "https://www.google.com",
        "https://translate.google.com",
        "https://translate.googleapis.com",
        "https://www.gstatic.com",
        "https://*.google.com",
        "https://*.gstatic.com"
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://translate.google.com",
        "https://translate.googleapis.com",
        "https://*.google.com"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: env.isProduction ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  originAgentCluster: false
}));
app.use(cookieParser());

// Allow configured FRONTEND_URL and common dev origins (both localhost and 127.0.0.1 on ports 3000, 5000, 5173, 5500, 8080)
const allowedOrigins = [
  env.frontendUrl,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or matching origins, or any localhost/127.0.0.1 dev port in non-production
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (!env.isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Blocked by CORS: ${origin}`));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// API Routes
app.get("/api/v1/health", (_req, res) => {
  const dbConnected = isDatabaseConnected();
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected ? "RaktDal API is healthy." : "Database unavailable.",
    database: dbConnected ? "connected" : "disconnected",
    environment: env.nodeEnv,
    uptime: process.uptime()
  });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/donors", donorRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/camps", campRoutes);
app.use("/api/v1/requests", bloodRequestRoutes);
app.use("/api/v1/responses", requestResponseRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/location", locationRoutes);

// Static Frontend Serving & SPA routing
app.use(express.static(frontendDir));

// Fallback error handler for API routes
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// SPA fallback: Return index.html for non-API GET requests
app.get("*", (req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(frontendDir, "index.html"), (err) => {
      if (err) next(err);
    });
  }
  next();
});

app.use((err, _req, res, _next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error." });
});

export default app;
