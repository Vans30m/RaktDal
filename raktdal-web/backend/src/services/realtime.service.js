import { WebSocketServer } from "ws";
import { verifyAccessToken } from "../utils/security.js";

class RealtimeNotificationService {
  constructor() {
    this.wss = null;
    // Map: userId (string) -> Set of active WebSocket connections
    this.userSockets = new Map();
  }

  initialize(httpServer) {
    this.wss = new WebSocketServer({ server: httpServer, path: "/ws/notifications" });

    this.wss.on("connection", (ws, req) => {
      let authenticatedUserId = null;

      try {
        // Parse token from cookies or query string (?token=...)
        const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
        let token = url.searchParams.get("token");

        if (!token && req.headers.cookie) {
          const match = req.headers.cookie.match(/accessToken=([^;]+)/);
          if (match) token = match[1];
        }

        if (token) {
          const decoded = verifyAccessToken(token);
          if (decoded && decoded.id) {
            authenticatedUserId = String(decoded.id);
          }
        }
      } catch (err) {
        // Token invalid
      }

      ws.userId = authenticatedUserId;

      if (authenticatedUserId) {
        if (!this.userSockets.has(authenticatedUserId)) {
          this.userSockets.set(authenticatedUserId, new Set());
        }
        this.userSockets.get(authenticatedUserId).add(ws);
      }

      // Handle ping/pong heartbeat and auth identification message
      ws.isAlive = true;
      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (rawMessage) => {
        try {
          const data = JSON.parse(rawMessage.toString());
          if (data.type === "AUTHENTICATE" && data.token) {
            const decoded = verifyAccessToken(data.token);
            if (decoded && decoded.id) {
              const prevId = ws.userId;
              if (prevId && this.userSockets.has(prevId)) {
                this.userSockets.get(prevId).delete(ws);
              }
              const newId = String(decoded.id);
              ws.userId = newId;
              if (!this.userSockets.has(newId)) {
                this.userSockets.set(newId, new Set());
              }
              this.userSockets.get(newId).add(ws);
              ws.send(JSON.stringify({ type: "AUTHENTICATED", userId: newId }));
            }
          }
        } catch (e) {
          // ignore non-json
        }
      });

      ws.on("close", () => {
        if (ws.userId && this.userSockets.has(ws.userId)) {
          const sockets = this.userSockets.get(ws.userId);
          sockets.delete(ws);
          if (sockets.size === 0) {
            this.userSockets.delete(ws.userId);
          }
        }
      });
    });

    // Heartbeat every 30 seconds to clean up dead connections
    setInterval(() => {
      if (!this.wss) return;
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  /**
   * Broadcast a real-time notification to an online user
   */
  sendToUser(userId, notificationPayload) {
    if (!userId) return;
    const uidStr = String(userId);
    const sockets = this.userSockets.get(uidStr);
    if (!sockets || sockets.size === 0) return;

    const message = JSON.stringify({
      type: "NOTIFICATION",
      data: notificationPayload
    });

    sockets.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(message);
      }
    });
  }
}

export const realtimeNotifications = new RealtimeNotificationService();

