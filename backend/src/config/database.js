import mongoose from "mongoose";
import dns from "dns";
import { env } from "./env.js";

export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is not configured. Starting without a database connection.");
    return;
  }

  // Windows local router DNS frequently refuses Node.js SRV queries (querySrv ECONNREFUSED)
  // Fall back to reliable public DNS (Google / Cloudflare) for Atlas SRV resolution
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  } catch (e) {
    // Ignore if not supported in environment
  }

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected.");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

