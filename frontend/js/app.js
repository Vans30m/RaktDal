/**
 * Main Application Bootstrap with i18n
 */
import { i18n } from "./i18n/i18n.js";
import { authState } from "./auth.js";
import { Router } from "./router.js";

// Initialize i18n, Router and Auth State
document.addEventListener("DOMContentLoaded", async () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 1. Initialize internationalization before rendering any UI
  await i18n.init();

  // 2. Initialize router
  const router = new Router("app", "authNavContainer");

  // 3. Fetch initial auth session
  await authState.init();
});
