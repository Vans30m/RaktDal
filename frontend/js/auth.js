/**
 * Centralized Authentication State Manager for RaktDal
 *
 * - Maintains active user profile
 * - Coordinates login and logout transitions
 * - Handles session expiration and auto-refresh synchronization
 * - Provides event listeners for UI subscribers
 */

import { api } from "./api.js";

class AuthStateManager {
  constructor() {
    this.user = null;
    this.loading = true;
    this.initialized = false;
    this.subscribers = new Set();
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
   * Fetches current authenticated user profile from backend
   */
  async init() {
    this.loading = true;
    this.notify();

    try {
      const res = await api.getMe();
      if (res.ok) {
        const body = await res.json();
        this.user = body.data?.user || null;
      } else {
        // If we don't have a verified user in memory or storage, nullify
        const saved = sessionStorage.getItem("raktdal_auth_user");
        if (saved) {
          try { this.user = JSON.parse(saved); } catch (e) { this.user = null; }
        } else {
          this.user = null;
        }
      }
    } catch (err) {
      console.warn("Could not retrieve active session:", err.message);
      const saved = sessionStorage.getItem("raktdal_auth_user");
      if (saved) {
        try { this.user = JSON.parse(saved); } catch (e) { this.user = null; }
      } else {
        this.user = null;
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

  /**
   * Log out current user and clear local state
   */
  async logout() {
    try {
      await api.logout();
    } catch (err) {
      console.warn("Logout API call failed, continuing with client state cleanup:", err);
    } finally {
      this.user = null;
      sessionStorage.removeItem("raktdal_auth_user");
      this.loading = false;
      this.notify();
      window.location.hash = "#/login";
    }
  }

  /**
   * Set user data directly (e.g. after profile update)
   */
  setUser(userData) {
    this.user = userData;
    if (userData) {
      sessionStorage.setItem("raktdal_auth_user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("raktdal_auth_user");
    }
    this.notify();
  }
}

export const authState = new AuthStateManager();
