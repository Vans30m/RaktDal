/**
 * Main Application Bootstrap
 */
import { authState } from "./auth.js";
import { Router } from "./router.js";

// Initialize Router and Auth State
document.addEventListener("DOMContentLoaded", async () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Initialize router
  const router = new Router("app", "authNavContainer");

  // Fetch initial auth session
  await authState.init();
});
