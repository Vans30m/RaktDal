/**
 * Centralized Authentication State Manager for RaktDal
 *
 * - Maintains active user profile
 * - Coordinates login and logout transitions
 * - Enforces strict 1-hour maximum session duration per device
 * - Coordinates auto-logout on session expiration
 * - Provides event listeners for UI subscribers
 */

import { api } from "./api.js";
import { toast } from "./toast.js";

// Strict 1-hour session lifetime (in milliseconds)
const ONE_HOUR_MS = 60 * 60 * 1000;

class AuthStateManager {
  constructor() {
    this.user = null;
    this.loading = true;
    this.initialized = false;
    this.subscribers = new Set();
    this.sessionTimer = null;

    // Listen for tab focus / visibility changes to catch expired sessions even if background timer was throttled by OS
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && this.user) {
          this.checkSessionLifetime();
        }
      });
      window.addEventListener("focus", () => {
        if (this.user) {
          this.checkSessionLifetime();
        }
      });
    }
  }

  /**
   * Subscribe to authentication state updates
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    // Immediately invoke with current state
    callback(this.getState());
    return () => this.subscribers.delete(callback);
  }

  notify() {
    const state = this.getState();
    this.subscribers.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.error("Auth state subscriber error:", err);
      }
    });
  }

  isAuthenticated() {
    return Boolean(this.user);
  }

  getState() {
    return {
      user: this.user,
      isAuthenticated: Boolean(this.user),
      isAdmin: Boolean(this.user?.platformRoles?.includes("ADMIN")),
      loading: this.loading,
      initialized: this.initialized
    };
  }

  /**
   * Verify if the current session has exceeded the 1-hour duration
   */
  checkSessionLifetime() {
    if (!this.user) return false;
    const loginTimeStr = localStorage.getItem("raktdal_login_time");
    if (!loginTimeStr) return false;

    const loginTime = parseInt(loginTimeStr, 10);
    const elapsed = Date.now() - loginTime;

    if (elapsed >= ONE_HOUR_MS) {
      console.warn("[AUTH] Session exceeded 1 hour limit. Removing user login from device.");
      this.handleSessionExpired();
      return true;
    }
    return false;
  }

  /**
   * Starts or adjusts the client-side 1-hour auto-logout timer
   */
  startSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }

    let loginTimeStr = localStorage.getItem("raktdal_login_time");
    let loginTime = loginTimeStr ? parseInt(loginTimeStr, 10) : 0;

    if (!loginTime || isNaN(loginTime)) {
      loginTime = Date.now();
      localStorage.setItem("raktdal_login_time", loginTime.toString());
    }

    const elapsed = Date.now() - loginTime;
    const remaining = ONE_HOUR_MS - elapsed;

    if (remaining <= 0) {
      this.handleSessionExpired();
      return;
    }

    this.sessionTimer = setTimeout(() => {
      this.handleSessionExpired();
    }, remaining);
  }

  /**
   * Called when 1 hour expires: clears credentials from device and redirects
   */
  async handleSessionExpired() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }

    try {
      toast.show("Your login session has expired after 1 hour. Please sign in again.", "warning");
    } catch (e) {}

    await this.logout({ expired: true });
  }

  /**
   * Fetches current authenticated user profile from backend
   */
  async init() {
    // Check if 1 hour has already passed since recorded login
    const loginTimeStr = localStorage.getItem("raktdal_login_time");
    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      if (Date.now() - loginTime >= ONE_HOUR_MS) {
        await this.logout({ expired: true });
        this.loading = false;
        this.initialized = true;
        this.notify();
        return null;
      }
    }

    if (!this.initialized) {
      this.loading = true;
      this.notify();
    }

    try {
      const res = await api.getMe();
      if (res.ok) {
        const body = await res.json();
        this.user = body.data?.user || null;
        if (this.user) {
          sessionStorage.setItem("raktdal_auth_user", JSON.stringify(this.user));
          this.startSessionTimer();
        } else {
          this.clearLocalSession();
        }
      } else {
        // Backend rejected authentication or session expired: wipe credentials
        this.clearLocalSession();
      }
    } catch (err) {
      console.warn("Could not retrieve active session:", err.message);
      // If network offline and not expired, attempt cached session
      const saved = sessionStorage.getItem("raktdal_auth_user");
      if (saved && !this.checkSessionLifetime()) {
        try {
          this.user = JSON.parse(saved);
          this.startSessionTimer();
        } catch (e) {
          this.clearLocalSession();
        }
      } else {
        this.clearLocalSession();
      }
    } finally {
      this.loading = false;
      this.initialized = true;
      this.notify();
    }

    return this.user;
  }

  /**
   * Redirects browser to Google OAuth authorization endpoint
   */
  loginWithGoogle() {
    window.location.href = api.getGoogleAuthUrl();
  }

  clearLocalSession() {
    this.user = null;
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
    sessionStorage.removeItem("raktdal_auth_user");
    localStorage.removeItem("raktdal_login_time");
  }

  /**
   * Log out current user and remove login from device
   */
  async logout({ expired = false } = {}) {
    try {
      await api.logout();
    } catch (err) {
      console.warn("Logout API call failed, continuing with client state cleanup:", err);
    } finally {
      this.clearLocalSession();
      this.loading = false;
      this.notify();
      window.location.hash = expired ? "#/login?error=session_expired" : "#/login";
    }
  }

  /**
   * Set user data directly (e.g. after login or profile update)
   */
  setUser(userData) {
    this.user = userData;
    if (userData) {
      sessionStorage.setItem("raktdal_auth_user", JSON.stringify(userData));
      let loginTimeStr = localStorage.getItem("raktdal_login_time");
      if (!loginTimeStr) {
        localStorage.setItem("raktdal_login_time", Date.now().toString());
      }
      this.startSessionTimer();
    } else {
      this.clearLocalSession();
    }
    this.notify();
  }
}

export const authState = new AuthStateManager();
if (typeof window !== "undefined") {
  window.authState = authState;
}
