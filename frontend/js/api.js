/**
 * Centralized API Client Service
 */
const API_BASE = window.RAKTDAL_API_URL || (
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api/v1"
    : `${window.location.origin}/api/v1`
);

export const api = {
  getBaseUrl() {
    return API_BASE;
  },

  async request(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers
    };

    if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: "include",
      headers
    });

    // Auto-refresh token if expired (401) on protected calls
    const isAuthCall = endpoint === "/auth/login" || endpoint === "/auth/register" || endpoint === "/auth/refresh" || endpoint === "/auth/me";
    if (response.status === 401 && !isAuthCall) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        credentials: "include"
      });

      if (refreshRes.ok) {
        return fetch(`${API_BASE}${endpoint}`, {
          ...options,
          credentials: "include",
          headers
        });
      }
    }

    return response;
  },

  register(data) {
    return this.request("/auth/register", { method: "POST", body: data });
  },

  login(data) {
    return this.request("/auth/login", { method: "POST", body: data });
  },

  logout() {
    return this.request("/auth/logout", { method: "POST" });
  },

  getMe() {
    return this.request("/auth/me");
  },

  getSessions() {
    return this.request("/auth/sessions");
  },

  verifyEmail(data) {
    return this.request("/auth/verify-email", { method: "POST", body: data });
  },

  resendOtp(data) {
    return this.request("/auth/resend-otp", { method: "POST", body: data });
  },

  forgotPassword(data) {
    return this.request("/auth/forgot-password", { method: "POST", body: data });
  },

  resetPassword(data) {
    return this.request("/auth/reset-password", { method: "POST", body: data });
  }
};

/**
 * Shared utility to update the navigation bar based on user login state
 */
export async function updateNavAuth(containerId = "authNavContainer", isSubfolder = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const prefix = isSubfolder ? "" : "pages/";
  const homePrefix = isSubfolder ? "../index.html" : "index.html";

  try {
    const res = await api.getMe();
    if (res.ok) {
      const data = await res.json();
      const user = data.data.user;
      container.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
          <a href="${prefix}profile.html" style="display:flex; align-items:center; gap:8px; font-weight:600;">
            ${user.profileImage ? `<img src="${user.profileImage}" alt="" style="width:28px; height:28px; border-radius:50%;">` : ""}
            <span>${user.fullName.split(" ")[0]}</span>
          </a>
          <button id="globalNavLogoutBtn" class="button button-outline" style="padding:6px 12px; font-size:0.85rem;">Sign out</button>
        </div>
      `;
      document.getElementById("globalNavLogoutBtn")?.addEventListener("click", async () => {
        await api.logout();
        window.location.href = `${prefix}login.html`;
      });
      return user;
    }
  } catch (e) {
    // Not logged in
  }

  container.innerHTML = `
    <div style="display:flex; gap:10px;">
      <a class="button button-outline" href="${prefix}login.html" style="padding:7px 14px; font-size:0.88rem;">Sign in</a>
      <a class="button" href="${prefix}register.html" style="padding:7px 14px; font-size:0.88rem;">Register</a>
    </div>
  `;
  return null;
}


/**
 * Shared Password Strength Calculator
 */
export function evaluatePasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "#e2e8f0" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 25, label: "Weak", color: "#ef4444" };
  if (score === 2) return { score: 50, label: "Fair", color: "#f59e0b" };
  if (score === 3) return { score: 75, label: "Good", color: "#3b82f6" };
  return { score: 100, label: "Strong", color: "#10b981" };
}

/**
 * Shared Password Visibility Toggle
 */
export function setupPasswordToggle(inputId, toggleBtnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(toggleBtnId);
  if (!input || !btn) return;

  btn.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "Hide" : "Show";
  });
}
