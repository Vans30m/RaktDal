import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { realtimeNotifications } from "./services/realtime.service.js";

async function startServer() {
  try {
    await connectDatabase();
    const server = http.createServer(app);

    // Initialize WebSocket real-time notification engine
    realtimeNotifications.initialize(server);

    server.listen(env.port, () => {
      console.log(`RaktDal API & WebSocket listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start RaktDal API:", error);
    process.exit(1);
  }
}

startServer();
