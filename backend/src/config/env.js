import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5500",

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/v1/auth/google/callback"
  },

  jwtSecret: process.env.JWT_SECRET || "rakt-dal-jwt-secret-key",
  accessExpiresIn: "15m", // Short-lived access token (15 mins)
  refreshExpiresDays: 7, // Refresh token valid for 7 days
  isProduction: process.env.NODE_ENV === "production",

  // Email Delivery Configuration
  emailFrom: process.env.EMAIL_FROM || "RaktDal <onboarding@resend.dev>",
  
  // Resend
  resendApiKey: process.env.RESEND_API_KEY || "",

  // Gmail SMTP
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || ""
};
