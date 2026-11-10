/**
 * Real-Time WebSocket Notification Client for RaktDal
 */
import { toast } from "./toast.js";
import { notificationViews } from "./views/notification.views.js";

class RealtimeNotificationClient {
  constructor() {
    this.ws = null;
    this.reconnectTimer = null;
    this.isConnected = false;
  }

  getWsUrl() {
    if (typeof window === "undefined") return "";
    const loc = window.location;
    const protocol = loc.protocol === "https:" ? "wss:" : "ws:";
    
    // Check if development frontend
    if (loc.hostname === "localhost" || loc.hostname === "127.0.0.1") {
      return `${protocol}//127.0.0.1:5000/ws/notifications`;
    }
    return `${protocol}//${loc.host}/ws/notifications`;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = this.getWsUrl();
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "NOTIFICATION" && payload.data) {
            const notif = payload.data;

            // Trigger instant real-time Toast popup!
            toast.show({
              title: notif.title || "🚨 Emergency Blood Alert",
              message: notif.message || "New urgent blood requirement alert received.",
              type: notif.priority === "URGENT" ? "urgent" : "info",
              duration: 9000
            });

            // Update header bell counter
            if (window.router?.refreshNotificationBadge) {
              window.router.refreshNotificationBadge();
            }

            // Auto-refresh notification list if user is on the notification screen
            if (window.location.hash.startsWith("#/notifications")) {
              if (window.router?.renderNotifications) {
                window.router.renderNotifications();
              }
            }
          }
        } catch (err) {
          console.error("[WS MESSAGE ERROR]", err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        // Auto-reconnect with exponential backoff
        if (!this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
          }, 4000);
        }
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (err) {
      console.warn("WebSocket connection failure:", err);
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}

export const realtimeClient = new RealtimeNotificationClient();

