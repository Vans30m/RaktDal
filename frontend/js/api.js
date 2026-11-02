/**
 * Centralized API Client Service for RaktDal
 *
 * - Uses dynamic configuration (window.RAKTDAL_API_URL or local/origin default)
 * - credentials: "include" for secure HttpOnly cookie transmission
 * - CSRF custom header injection ("X-Requested-With: XMLHttpRequest")
 * - Automatic token refresh with concurrency deduplication (prevents infinite refresh loops)
 * - Zero token exposure to JavaScript
 */

const getApiBase = () => {
  if (typeof window !== "undefined") {
    if (window.RAKTDAL_API_URL) return window.RAKTDAL_API_URL;
    if (window.location?.hostname === "127.0.0.1") {
      return "http://127.0.0.1:5000/api/v1";
    }
    if (window.location?.hostname === "localhost") {
      return "http://localhost:5000/api/v1";
    }
    return `${window.location?.origin || ""}/api/v1`;
  }
  return "http://localhost:5000/api/v1";
};

const API_BASE = getApiBase();

let refreshPromise = null;

export const api = {
  getBaseUrl() {
    return API_BASE;
  },

  getGoogleAuthUrl() {
    return `${API_BASE}/auth/google`;
  },

  /**
   * Unified HTTP Request Handler
   */
  async request(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers
    };

    if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body);
    }

    try {
      let response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        credentials: "include",
        headers
      });

      // Auto-refresh token if 401 Unauthorized encountered (excluding auth endpoints to prevent loops)
      const isAuthExempt = endpoint.startsWith("/auth/google") || endpoint === "/auth/refresh" || endpoint === "/auth/logout";
      if (response.status === 401 && !isAuthExempt) {
        // Concurrency Deduplication: Reuse single refresh request for multiple parallel 401 calls
        if (!refreshPromise) {
          refreshPromise = this.refreshSession().finally(() => {
            refreshPromise = null;
          });
        }

        const refreshSucceeded = await refreshPromise;
        if (refreshSucceeded) {
          // Retry original request once
          response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            credentials: "include",
            headers
          });
        }
      }

      return response;
    } catch (networkError) {
      console.error("Network or API communication failure:", networkError.message);
      throw networkError;
    }
  },

  /**
   * Refresh the access token using the HttpOnly refresh token cookie
   */
  async refreshSession() {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        credentials: "include"
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  register(data) {
    return this.request("/auth/register", { method: "POST", body: data });
  },

  login(data) {
    return this.request("/auth/login", { method: "POST", body: data });
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
  },
  getMe() {
    return this.request("/auth/me");
  },

  getSessions() {
    return this.request("/auth/sessions");
  },

  updateProfile(data) {
    return this.request("/auth/me", { method: "PATCH", body: data });
  },

  logout() {
    return this.request("/auth/logout", { method: "POST" });
  },

  logoutAll() {
    return this.request("/auth/logout-all", { method: "POST" });
  },

  // ==========================================
  // --- Phase 10: Donor Profiles & Discovery APIs ---
  // ==========================================

  createDonorProfile(data) {
    return this.request("/donors/profile", {
      method: "POST",
      body: data
    });
  },

  getMyDonorProfile() {
    return this.request("/donors/me");
  },

  updateMyDonorProfile(data) {
    return this.request("/donors/me", {
      method: "PATCH",
      body: data
    });
  },

  updateDonorAvailability(availabilityStatus) {
    return this.request("/donors/me/availability", {
      method: "PATCH",
      body: { availabilityStatus }
    });
  },

  updateDonorConsent(consents) {
    return this.request("/donors/me/consent", {
      method: "PATCH",
      body: consents
    });
  },

  searchDonors(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.append(key, val);
      }
    });
    const qs = query.toString();
    return this.request(qs ? `/donors/search?${qs}` : "/donors/search");
  },

  // ==========================================
  // --- Other Modules ---
  // ==========================================

  getAdminDashboard() {
    return this.request("/admin/stats");
  },

  getAdminStats() {
    return this.request("/admin/stats");
  },

  getAdminOrganizations(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/admin/organizations?${query}` : "/admin/organizations");
  },

  verifyOrganization(orgId, status, reason = "") {
    return this.request(`/admin/organizations/${orgId}/verify`, {
      method: "PATCH",
      body: { status, reason }
    });
  },

  getAdminUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/admin/users?${query}` : "/admin/users");
  },

  updateUserAccountStatus(userId, status, reason = "") {
    return this.request(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: { status, reason }
    });
  },

  getAdminBloodRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/admin/requests?${query}` : "/admin/requests");
  },

  getAdminFraudAlerts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/admin/fraud-alerts?${query}` : "/admin/fraud-alerts");
  },

  resolveFraudAlert(alertId, status, note = "") {
    return this.request(`/admin/fraud-alerts/${alertId}`, {
      method: "PATCH",
      body: { status, note }
    });
  },

  getAdminAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/admin/audit-logs?${query}` : "/admin/audit-logs");
  },

  // Blood Request APIs
  getBloodRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/requests?${query}` : "/requests";
    return this.request(endpoint);
  },

  getBloodRequestById(requestId) {
    return this.request(`/requests/${requestId}`);
  },

  getMyBloodRequests() {
    return this.request("/requests/my");
  },

  createBloodRequest(data) {
    return this.request("/requests", {
      method: "POST",
      body: data
    });
  },

  updateRequestStatus(requestId, status, note = "") {
    return this.request(`/requests/${requestId}/status`, {
      method: "PATCH",
      body: { status, note }
    });
  },

  verifyBloodRequest(requestId, status, note = "") {
    return this.request(`/requests/${requestId}/verify`, {
      method: "PATCH",
      body: { status, note }
    });
  },

  submitDonationResponse(requestId, data) {
    return this.request(`/requests/${requestId}/responses`, {
      method: "POST",
      body: data
    });
  },

  getRequestResponses(requestId) {
    return this.request(`/requests/${requestId}/responses`);
  },

  updateResponseStatus(responseId, status, reason = "") {
    return this.request(`/responses/${responseId}`, {
      method: "PATCH",
      body: { status, reason }
    });
  },

  // Reports & Analytics APIs
  getAdminReportsOverview(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/admin/reports/overview?${query}` : "/admin/reports/overview");
  },

  getAdminReportsRequests(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/admin/reports/requests?${query}` : "/admin/reports/requests");
  },

  getOrganizationReports(orgId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/reports/organizations/${orgId}?${query}` : `/reports/organizations/${orgId}`);
  },

  getPersonalReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `/reports/me/summary?${query}` : "/reports/me/summary");
  },

  getAdminExportCsvUrl(params = {}) {
    const query = new URLSearchParams(params).toString();
    const baseUrl = this.getBaseUrl();
    return `${baseUrl}/admin/reports/export?${query}`;
  }
};



export async function updateNavAuth() {
  const container = document.getElementById("authNavContainer");
  if (!container) return null;
  try {
    const res = await api.getMe();
    if (res.ok) {
      const data = await res.json();
      const user = data.data?.user;
      if (user) {
        container.innerHTML = `
          <a href="../index.html#/profile" class="button" style="padding:7px 14px; font-size:0.88rem;">
            ${user.fullName ? user.fullName.split(" ")[0] : "Profile"}
          </a>
        `;
        return user;
      }
    }
  } catch (e) {}
  return null;
}

export function setupPasswordToggle(inputSelector, buttonSelector) {
  const input = document.querySelector(inputSelector);
  const btn = document.querySelector(buttonSelector);
  if (input && btn) {
    btn.addEventListener("click", () => {
      const isPwd = input.type === "password";
      input.type = isPwd ? "text" : "password";
      btn.textContent = isPwd ? "Hide" : "Show";
    });
  }
}

export function evaluatePasswordStrength(password) {
  if (!password || password.length < 8) return { score: 1, text: "Weak" };
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const count = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
  if (password.length >= 12 && count >= 3) return { score: 4, text: "Strong" };
  if (password.length >= 8 && count >= 2) return { score: 3, text: "Good" };
  return { score: 2, text: "Fair" };
}
