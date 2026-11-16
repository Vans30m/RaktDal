/**
 * Main Application Bootstrap with i18n
 */
import { authState } from "./auth.js";
import { Router } from "./router.js";
import { realtimeClient } from "./realtime.js";
import { languageManager } from "./languageContext.js";

// Initialize i18n, Router and Auth State
document.addEventListener("DOMContentLoaded", async () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 1. Initialize full-page Google translation engine & background observer
  languageManager.init();
  
  // 2. Initialize router
  const router = new Router("app", "authNavContainer");
  window.router = router;

  // 3. Fetch initial auth session
  await authState.init();

  // 4. Connect real-time WebSocket for instant alert popups and background sync
  authState.subscribe((state) => {
    if (state.isAuthenticated) {
      realtimeClient.connect();
      router.startNotificationPolling();
      router.refreshNotificationBadge();
    } else {
      realtimeClient.disconnect();
    }
  });
});
