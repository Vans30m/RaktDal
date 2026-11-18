import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config(); // fallback to cwd .env

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "",
  frontendUrl: process.env.FRONTEND_URL || "https://raktdal.onrender.com",
  deployedUrl: "https://raktdal.onrender.com",

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/v1/auth/google/callback"
  },

  jwtSecret: process.env.JWT_SECRET || "rakt-dal-jwt-secret-key",
  accessExpiresIn: "15m", // Short-lived access token (15 mins)
  refreshExpiresHours: 1, // User session / refresh token valid for 1 hour (auto-removed after 1 hr)
  isProduction: process.env.NODE_ENV === "production",

  // Email Delivery Configuration
  emailFrom: process.env.EMAIL_FROM || "RaktDal <onboarding@resend.dev>",
  
  // Resend
  resendApiKey: process.env.RESEND_API_KEY || "",

  // Brevo
  brevoApiKey: process.env.BREVO_API_KEY || "",

  // Gmail SMTP
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || ""
};
