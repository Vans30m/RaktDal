/**
 * Main Application Bootstrap with i18n
 */
import { authState } from "./auth.js";
import { Router } from "./router.js";

// Initialize i18n, Router and Auth State
document.addEventListener("DOMContentLoaded", async () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 1. Initialize internationalization before rendering any UI
  
  // 2. Initialize router
  const router = new Router("app", "authNavContainer");
  window.router = router;

  // 3. Fetch initial auth session
  await authState.init();

  // 4. Start background notification polling with real-time pop-up toast alerts
  router.startNotificationPolling();
});
