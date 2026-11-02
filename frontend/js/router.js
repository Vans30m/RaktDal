/**
 * Centralized Hash Router and Route Protection for RaktDal
 *
 * Supported Routes:
 * - `#/` or empty: Landing Homepage (Public)
 * - `#/login`: Google Sign-In Page (Guest only; redirects authenticated users to profile)
 * - `#/auth/callback`: OAuth Callback handler (Validates session, handles success/error)
 * - `#/profile`: Donor Profile & Active Sessions (Authenticated only)
 * - `#/admin`: Admin Dashboard (Requires platformRole "ADMIN")
 * - `#/find-blood`: Donor & blood directory (Public)
 * - `#/blood-banks`: Verified blood bank listings (Public)
 * - `#/camps`: Blood donation drives (Public)
 */

import { authState } from "./auth.js";
import { api } from "./api.js";
import { donorViews } from "./donor.js";
import { homeViews } from "./home.js";

// Template for Google Login button SVG
const GOOGLE_ICON_SVG = `
  <svg viewBox="0 0 24 24" style="width:20px; height:20px; flex-shrink:0;">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
`;

export class Router {
  constructor(appContainerId = "app", navContainerId = "authNavContainer") {
    this.appContainer = document.getElementById(appContainerId);
    this.navContainer = document.getElementById(navContainerId);
    this.isMenuOpen = false;
    this.isMobileNavOpen = false;

    // Listen to hash changes and auth state changes
    window.addEventListener("hashchange", () => {
      this.handleRoute();
      this.updateActiveNav();
      this.closeMobileNav();
    });

    authState.subscribe((state) => {
      this.renderNav(state);
      this.handleRoute();
    });

    // Close user dropdown menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu-wrapper") && this.isMenuOpen) {
        this.closeUserMenu();
      }
      if (this.isMobileNavOpen && !e.target.closest("#mainNav") && !e.target.closest("#mobileNavToggle")) {
        this.closeMobileNav();
      }
    });

    // Header scroll appearance treatment
    window.addEventListener("scroll", () => {
      const header = document.getElementById("siteHeader");
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    }, { passive: true });

    // Setup mobile nav hamburger toggle
    this.setupMobileNav();
  }

  setupMobileNav() {
    const toggleBtn = document.getElementById("mobileNavToggle");
    const mainNav = document.getElementById("mainNav");
    if (toggleBtn && mainNav) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.isMobileNavOpen = !this.isMobileNavOpen;
        mainNav.classList.toggle("mobile-open", this.isMobileNavOpen);
        toggleBtn.setAttribute("aria-expanded", this.isMobileNavOpen ? "true" : "false");
      });

      // Close mobile menu when selecting any link
      mainNav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => this.closeMobileNav());
      });
    }
  }

  closeMobileNav() {
    this.isMobileNavOpen = false;
    const mainNav = document.getElementById("mainNav");
    const toggleBtn = document.getElementById("mobileNavToggle");
    if (mainNav) mainNav.classList.remove("mobile-open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
  }

  updateActiveNav() {
    const { path } = this.getRouteInfo();
    const navLinks = document.querySelectorAll("#mainNav a");
    navLinks.forEach(link => {
      const route = link.getAttribute("data-route");
      if (route === path || (route !== "/" && path.startsWith(route))) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  /**
   * Parse current hash path and query parameters
   */
  getRouteInfo() {
    const rawHash = window.location.hash || "#/";
    const [pathWithHash, queryString] = rawHash.split("?");
    const path = pathWithHash.replace(/^#/, "") || "/";
    const params = new URLSearchParams(queryString || "");
    return { path, params };
  }

  /**
   * Render top navbar according to auth state
   */
  renderNav(state) {
    if (!this.navContainer) return;

    if (state.loading && !state.initialized) {
      this.navContainer.innerHTML = `
        <div style="font-size:0.85rem; color:var(--text-muted);">Checking session...</div>
      `;
      return;
    }

    if (state.isAuthenticated && state.user) {
      const u = state.user;
      const initial = (u.fullName || "User").charAt(0).toUpperCase();

      this.navContainer.innerHTML = `
        <div class="user-menu-wrapper">
          <button id="userMenuTrigger" class="user-menu-trigger" aria-haspopup="true" aria-expanded="${this.isMenuOpen}">
            ${u.profileImage ? `<img src="${u.profileImage}" class="user-nav-avatar" alt="">` : `<div class="user-nav-avatar">${initial}</div>`}
            <span>${u.fullName.split(" ")[0]}</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">▼</span>
          </button>

          <div id="userMenuDropdown" class="user-menu-dropdown ${this.isMenuOpen ? "show" : ""}" role="menu">
            <div class="user-menu-header">
              <div class="user-menu-name">${u.fullName}</div>
              <div class="user-menu-email">${u.email}</div>
              <div style="margin-top:6px;">
                <span class="badge ${u.accountStatus === "ACTIVE" ? "badge-active" : ""}">${u.accountStatus}</span>
                ${state.isAdmin ? `<span class="badge" style="background:#e0f2fe; color:#0369a1; margin-left:4px;">ADMIN</span>` : ""}
              </div>
            </div>

            <div class="user-menu-items">
              <a href="#/profile" class="user-menu-item">
                <span>👤</span> Profile & Sessions
              </a>
              <a href="#/requests/my" class="user-menu-item">
                <span>🩸</span> My Blood Requests
              </a>
              ${state.isAdmin ? `
                <a href="#/admin" class="user-menu-item" style="color:#0369a1; font-weight:600;">
                  <span>🛡️</span> Admin Dashboard
                </a>
              ` : ""}
              <button id="userMenuLogoutBtn" class="user-menu-item logout">
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById("userMenuTrigger")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleUserMenu();
      });

      document.getElementById("userMenuLogoutBtn")?.addEventListener("click", () => {
        this.closeUserMenu();
        authState.logout();
      });
    } else {
      this.navContainer.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <a href="#/login" class="button button-outline" style="padding:7px 14px; font-size:0.88rem;">
            Sign in
          </a>
          <a href="#/register" class="button" style="padding:7px 14px; font-size:0.88rem;">
            Register
          </a>
        </div>
      `;
    }
  }

    toggleUserMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const dropdown = document.getElementById("userMenuDropdown");
    const trigger = document.getElementById("userMenuTrigger");
    if (dropdown) dropdown.classList.toggle("show", this.isMenuOpen);
    if (trigger) trigger.setAttribute("aria-expanded", this.isMenuOpen);
  }

  closeUserMenu() {
    this.isMenuOpen = false;
    const dropdown = document.getElementById("userMenuDropdown");
    const trigger = document.getElementById("userMenuTrigger");
    if (dropdown) dropdown.classList.remove("show");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }

  /**
   * Route Dispatcher with Guards
   */
  async handleRoute() {
    if (!this.appContainer) return;
    const { path, params } = this.getRouteInfo();

    // Toggle default footer visibility based on whether on landing page
    const defaultFooter = document.getElementById("defaultSiteFooter");
    if (defaultFooter) {
      defaultFooter.style.display = path === "/" ? "none" : "block";
    }

    this.updateActiveNav();
    const state = authState.getState();

    // Wait for initial auth inspection to complete before running guards
    if (state.loading && !state.initialized) {
      this.renderLoader("Verifying identity...");
      return;
    }

    // Route Guards
    if ((path === "/profile" || path === "/requests/create" || path === "/requests/my" || path === "/donor/dashboard" || path === "/donor/register" || path === "/donor/edit" || path === "/donor/availability" || path === "/donor/consent") && !state.isAuthenticated) {
      window.location.hash = "#/login?error=auth_required";
      return;
    }

    if (path === "/admin") {
      if (!state.isAuthenticated) {
        window.location.hash = "#/login?error=admin_required";
        return;
      }
      if (!state.isAdmin) {
        this.renderForbidden();
        return;
      }
    }

    if (path === "/login" && state.isAuthenticated) {
      window.location.hash = "#/profile";
      return;
    }

    // View Mapping
    if (path === "/requests/create") {
      this.renderCreateBloodRequest();
      return;
    }

    if (path === "/requests/my") {
      this.renderMyBloodRequests();
      return;
    }

    if (path.startsWith("/requests/")) {
      const requestId = path.replace("/requests/", "");
      this.renderBloodRequestDetail(requestId);
      return;
    }

        // Phase 10: Donor Profiles & Discovery Routes
    if (path === "/find-blood" || path === "/donors") {
      donorViews.renderDonorSearch(this.appContainer, params);
      return;
    }
    if (path === "/donor/dashboard") {
      donorViews.renderDonorDashboard(this.appContainer);
      return;
    }
    if (path === "/donor/register") {
      donorViews.renderCreateProfile(this.appContainer);
      return;
    }
    if (path === "/donor/edit") {
      donorViews.renderEditProfile(this.appContainer);
      return;
    }
    if (path === "/donor/availability") {
      donorViews.renderAvailabilitySettings(this.appContainer);
      return;
    }
    if (path === "/donor/consent") {
      donorViews.renderConsentSettings(this.appContainer);
      return;
    }

    switch (path) {
      case "/":
        this.renderHome();
        break;
      case "/requests":
        this.renderBloodRequests(params);
        break;
      case "/login":
        this.renderLogin(params);
        break;
      case "/register":
        this.renderRegister(params);
        break;
      case "/auth/callback":
        this.renderAuthCallback(params);
        break;
      case "/profile":
        this.renderProfile();
        break;
      case "/admin":
        this.renderAdminDashboard();
        break;
      case "/blood-banks":
        this.renderPlaceholderPage(
          "Blood Bank Directory",
          "Directory listings for authorized regional blood banks and storage facilities across India. Real-time API integration with national portal coming soon.",
          "🏥",
          "Find Participating Donors",
          "#/find-blood"
        );
        break;
      case "/camps":
        this.renderPlaceholderPage(
          "Blood Donation Camps",
          "Scheduled public donation drives organized by colleges, hospitals, and verified community partners across India.",
          "⛺",
          "Register as Donor",
          "#/donor/register"
        );
        break;
      case "/about":
        this.renderPlaceholderPage(
          "About RaktDal",
          "RaktDal is a Pan-India blood donor coordination and emergency request platform built to streamline the voluntary blood donation network with strict privacy controls.",
          "❤️"
        );
        break;
      case "/how-it-works":
        this.renderPlaceholderPage(
          "How RaktDal Works",
          "RaktDal connects donors and healthcare coordinators using verified profiles, location-indexed discovery, and direct request-response communication.",
          "⚙️"
        );
        break;
      case "/contact":
        this.renderPlaceholderPage(
          "Contact RaktDal",
          "For technical assistance, organization onboarding, or general queries, please reach out to our platform support team.",
          "✉️"
        );
        break;
      case "/privacy":
        this.renderPlaceholderPage(
          "Privacy Policy",
          "RaktDal strictly protects donor personal data. Phone numbers, emails, and last donation history are never revealed without explicit donor consent.",
          "🛡️"
        );
        break;
      case "/terms":
        this.renderPlaceholderPage(
          "Terms and Conditions",
          "RaktDal is a voluntary coordination platform. Users agree to provide truthful information and adhere to responsible community standards.",
          "📜"
        );
        break;
      case "/disclaimer":
        this.renderPlaceholderPage(
          "Medical Disclaimer",
          "RaktDal is a coordination platform. Availability and medical suitability must always be confirmed by qualified medical professionals. RaktDal does not verify blood suitability.",
          "⚠️"
        );
        break;
      case "/help":
        this.renderPlaceholderPage(
          "Help & Support",
          "Frequently asked questions, donor guides, and instructions for posting emergency blood requests.",
          "💡"
        );
        break;
      default:
        this.renderHome();
        break;
    }
  }

  renderLoader(message = "Loading...") {
    this.appContainer.innerHTML = `
      <div class="auth-loader-card">
        <div class="spinner"></div>
        <p style="color:var(--text-muted); font-size:0.95rem; margin-top:12px;">${message}</p>
      </div>
    `;
  }

  renderHome() {
    // Hide minimal fallback footer on landing page because landing page has its own full 4-column footer
    const defaultFooter = document.getElementById("defaultSiteFooter");
    if (defaultFooter) defaultFooter.style.display = "none";

    this.appContainer.innerHTML = homeViews.getHomeHtml();
    homeViews.initScrollAnimations(this.appContainer);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  renderLogin(params) {
    const error = params.get("error");
    const errorMap = {
      cancelled: "Sign-in was cancelled. Please try again.",
      invalid_state: "Security validation failed (OAuth state mismatch). Please retry.",
      invalid_pkce: "PKCE verification failed. Please retry.",
      auth_failed: "Authentication failed. Please retry with your Google account.",
      account_suspended: "Your RaktDal account is suspended. Contact support.",
      identity_conflict: "This email is already linked with a different Google account.",
      auth_required: "Please sign in to access your donor account.",
      admin_required: "Administrative authorization required. Please sign in with an Admin account."
    };

    const errorMessage = error ? (errorMap[error] || "An unexpected error occurred. Please try again.") : null;

    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width: 440px;">
        <div class="brand-mark" style="margin: 0 auto 16px;">R</div>
        <h2>Sign In to RaktDal</h2>
        <p class="subtitle">Access your blood donor profile, request support, and manage appointments securely.</p>

        <div id="loginMsg">
          ${errorMessage ? `
            <div class="alert alert-error" role="alert">
              <span>⚠️</span>
              <div>${errorMessage}</div>
            </div>
          ` : ""}
        </div>

        <form id="spaLoginForm" novalidate style="margin-top: 20px; text-align: left;">
          <div class="form-group">
            <label class="form-label" for="loginEmail">Email Address</label>
            <input type="email" id="loginEmail" class="form-input" required placeholder="you@example.com">
          </div>

          <div class="form-group">
            <label class="form-label" for="loginPassword">Password</label>
            <input type="password" id="loginPassword" class="form-input" required placeholder="Enter your password">
          </div>

          <button type="submit" id="loginSubmitBtn" class="button" style="width: 100%; margin-top: 10px;">
            <span>Sign In</span>
          </button>
        </form>

        <div style="margin: 20px 0; display:flex; align-items:center; text-align:center; color:var(--text-muted); font-size:0.85rem;">
          <span style="flex:1; border-bottom:1px solid var(--border);"></span>
          <span style="padding:0 10px;">OR</span>
          <span style="flex:1; border-bottom:1px solid var(--border);"></span>
        </div>

        <div>
          <a id="loginWithGoogleBtn" href="${api.getGoogleAuthUrl()}" class="google-btn" style="text-decoration:none;">
            ${GOOGLE_ICON_SVG}
            <span>Continue with Google</span>
          </a>
        </div>

        <p style="margin-top: 22px; font-size: 0.88rem; color: var(--text-muted);">
          Don't have an account? <a href="#/register" style="color: var(--primary); font-weight: 600;">Register here</a>
        </p>
      </div>
    `;

    document.getElementById("spaLoginForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const msgEl = document.getElementById("loginMsg");
      const btn = document.getElementById("loginSubmitBtn");

      if (!email || !password) {
        msgEl.innerHTML = '<div class="alert alert-error">Please enter both email and password.</div>';
        return;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = '<div class="btn-spinner"></div><span>Signing in...</span>';
        const res = await api.login({ email, password });
        const data = await res.json();

        if (res.ok) {
          await authState.init();
          window.location.hash = "#/donor/dashboard";
        } else {
          msgEl.innerHTML = `<div class="alert alert-error">${data.message || "Invalid credentials."}</div>`;
        }
      } catch (err) {
        msgEl.innerHTML = '<div class="alert alert-error">Network error. Please try again.</div>';
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Sign In</span>';
      }
    });
  }

  renderRegister(params) {
    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width: 440px;">
        <div class="brand-mark" style="margin: 0 auto 16px;">R</div>
        <h2>Create an Account</h2>
        <p class="subtitle">Join RaktDal to connect with donors or coordinate blood assistance.</p>

        <div id="registerMsg"></div>

        <form id="spaRegisterForm" novalidate style="margin-top: 20px; text-align: left;">
          <div class="form-group">
            <label class="form-label" for="regFullName">Full Name</label>
            <input type="text" id="regFullName" class="form-input" required placeholder="Your Full Name">
          </div>

          <div class="form-group">
            <label class="form-label" for="regEmail">Email Address</label>
            <input type="email" id="regEmail" class="form-input" required placeholder="you@example.com">
          </div>

          <div class="form-group">
            <label class="form-label" for="regPassword">Password</label>
            <input type="password" id="regPassword" class="form-input" required minlength="8" placeholder="At least 8 characters">
          </div>

          <button type="submit" id="regSubmitBtn" class="button" style="width: 100%; margin-top: 10px;">
            <span>Register Account</span>
          </button>
        </form>

        <div style="margin: 20px 0; display:flex; align-items:center; text-align:center; color:var(--text-muted); font-size:0.85rem;">
          <span style="flex:1; border-bottom:1px solid var(--border);"></span>
          <span style="padding:0 10px;">OR</span>
          <span style="flex:1; border-bottom:1px solid var(--border);"></span>
        </div>

        <div>
          <a id="regWithGoogleBtn" href="${api.getGoogleAuthUrl()}" class="google-btn" style="text-decoration:none;">
            ${GOOGLE_ICON_SVG}
            <span>Sign up with Google</span>
          </a>
        </div>

        <p style="margin-top: 22px; font-size: 0.88rem; color: var(--text-muted);">
          Already have an account? <a href="#/login" style="color: var(--primary); font-weight: 600;">Sign In</a>
        </p>
      </div>
    `;

    document.getElementById("spaRegisterForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fullName = document.getElementById("regFullName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;
      const msgEl = document.getElementById("registerMsg");
      const btn = document.getElementById("regSubmitBtn");

      if (!fullName || !email || !password) {
        msgEl.innerHTML = '<div class="alert alert-error">Please fill in all required fields.</div>';
        return;
      }
      if (password.length < 8) {
        msgEl.innerHTML = '<div class="alert alert-error">Password must be at least 8 characters.</div>';
        return;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = '<div class="btn-spinner"></div><span>Creating account...</span>';
        const res = await api.register({ fullName, email, password });
        const data = await res.json();

        if (res.ok) {
          msgEl.innerHTML = `<div class="alert alert-success">${data.message || "Registration successful!"}</div>`;
          setTimeout(() => {
            window.location.href = "pages/verify-email.html?email=" + encodeURIComponent(email);
          }, 1200);
        } else {
          msgEl.innerHTML = `<div class="alert alert-error">${data.message || "Registration failed."}</div>`;
        }
      } catch (err) {
        msgEl.innerHTML = '<div class="alert alert-error">Network error. Please try again.</div>';
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Register Account</span>';
      }
    });
  }

  async renderAuthCallback(params) {
    const status = params.get("status");

    this.renderLoader("Finalizing your secure sign-in session...");

    try {
      // Re-initialize authentication state from /api/v1/auth/me
      const user = await authState.init();

      if (user) {
        window.location.hash = "#/profile";
      } else {
        window.location.hash = "#/login?error=auth_failed";
      }
    } catch (err) {
      window.location.hash = "#/login?error=auth_failed";
    }
  }

  async renderProfile() {
    const user = authState.getState().user;
    if (!user) {
      window.location.hash = "#/login";
      return;
    }

    this.renderLoader("Loading donor profile & sessions...");

    let sessions = [];
    try {
      const res = await api.getSessions();
      if (res.ok) {
        const body = await res.json();
        sessions = body.data?.sessions || [];
      }
    } catch (e) {
      console.warn("Could not retrieve sessions:", e);
    }

    const initial = (user.fullName || "User").charAt(0).toUpperCase();

    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width: 580px; text-align: left;">
        <div style="text-align: center; margin-bottom: 24px;">
          ${user.profileImage ? `<img src="${user.profileImage}" class="profile-avatar" alt="">` : `<div class="user-nav-avatar" style="width:72px; height:72px; font-size:1.8rem; margin:0 auto 12px;">${initial}</div>`}
          <h2 style="margin: 0;">${user.fullName}</h2>
          <p style="color: var(--text-muted); margin: 6px 0 14px;">${user.email}</p>
          <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:6px;">
            <span class="badge ${user.accountStatus === "ACTIVE" ? "badge-active" : ""}">${user.accountStatus}</span>
            <span class="badge badge-active">✓ Google Verified</span>
            ${user.platformRoles.map((r) => `<span class="badge" style="background:#e0f2fe; color:#0369a1;">${r}</span>`).join("")}
          </div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-bottom: 16px;">
          <h3 style="font-size: 1rem; margin: 0 0 12px; color: var(--text-main);">Active Sessions (${sessions.length})</h3>
          <div class="session-list" style="max-height: 200px; overflow-y: auto;">
            ${sessions.map((s) => `
              <div class="session-item ${s.isCurrent ? "current" : ""}">
                <div>
                  <div style="font-weight: 600;">${s.isCurrent ? "★ This Device" : "Other Browser / Device"}</div>
                  <div style="color: var(--text-muted); font-size: 0.75rem;">IP: ${s.ipAddress} · Last Active: ${new Date(s.lastActiveAt).toLocaleString()}</div>
                </div>
                ${s.isCurrent ? `<span style="color: var(--success); font-weight: 700; font-size: 0.75rem;">CURRENT</span>` : ""}
              </div>
            `).join("")}
          </div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 14px; font-size: 0.85rem; color: var(--text-muted);">
          <p style="margin: 4px 0;"><strong>Member Since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
          <p style="margin: 4px 0;"><strong>Last Sign In:</strong> ${new Date(user.lastLoginAt).toLocaleString()}</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; margin-top: 24px;">
          <button id="profileSignOutBtn" class="button button-outline" style="width: 100%;">
            Sign Out (This Device)
          </button>
          ${sessions.length > 1 ? `
            <button id="profileSignOutAllBtn" class="button button-outline" style="width: 100%; border-color:#fca5a5; color:#dc2626;">
              Sign Out from All Devices
            </button>
          ` : ""}
        </div>
      </div>
    `;

        // Check and populate donor banner
    (async () => {
      try {
        const dRes = await api.getMyDonorProfile();
        if (dRes.ok) {
          const dBody = await dRes.json();
          const d = dBody.data?.donor;
          const bannerText = document.getElementById("donorBannerStatusText");
          const bannerBtn = document.getElementById("donorBannerActionBtn");
          if (bannerText && bannerBtn && d) {
            bannerText.innerHTML = `<strong>Blood Group:</strong> ${d.bloodGroup} - <strong>City:</strong> ${d.location.city} (${d.availabilityStatus})`;
            bannerBtn.textContent = "Open Donor Dashboard";
            bannerBtn.href = "#/donor/dashboard";
            bannerBtn.className = "button button-outline";
          }
        }
      } catch (e) {}
    })();

    document.getElementById("profileSignOutBtn")?.addEventListener("click", () => {
      authState.logout();
    });

    document.getElementById("profileSignOutAllBtn")?.addEventListener("click", async () => {
      try {
        await api.logoutAll();
      } catch (err) {}
      await authState.logout();
    });
  }

  async renderAdminDashboard(initialTab = "overview") {
    this.renderLoader("Loading administrative dashboard...");

    try {
      const statsRes = await api.getAdminStats();
      if (!statsRes.ok) {
        this.renderForbidden();
        return;
      }

      const statsBody = await statsRes.json();
      const overview = statsBody.data?.overview || {};
      const recentActivity = statsBody.data?.recentActivity || [];

      let currentTab = initialTab;

      const renderView = async () => {
        this.appContainer.innerHTML = `
          <div class="admin-layout">
            <aside class="admin-sidebar">
              <div class="admin-sidebar-header">
                <div style="font-weight:700; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
                  <span style="color:var(--red);">🛡️</span> Admin Console
                </div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Platform Management</div>
              </div>

              <button class="admin-nav-item ${currentTab === "overview" ? "active" : ""}" data-tab="overview">
                <span>📊</span> Overview
              </button>
              <button class="admin-nav-item ${currentTab === "organizations" ? "active" : ""}" data-tab="organizations">
                <span>🏥</span> Organizations Queue
                ${overview.pendingOrgVerifications > 0 ? `<span class="badge" style="background:#fee2e2; color:#991b1b; margin-left:auto;">${overview.pendingOrgVerifications}</span>` : ""}
              </button>
              <button class="admin-nav-item ${currentTab === "users" ? "active" : ""}" data-tab="users">
                <span>👥</span> Users Directory
              </button>
              <button class="admin-nav-item ${currentTab === "requests" ? "active" : ""}" data-tab="requests">
                <span>🩸</span> Blood Requests
                ${overview.pendingBloodRequests > 0 ? `<span class="badge" style="background:#fef9c3; color:#854d0e; margin-left:auto;">${overview.pendingBloodRequests}</span>` : ""}
              </button>
              <button class="admin-nav-item ${currentTab === "fraud" ? "active" : ""}" data-tab="fraud">
                <span>⚠️</span> Fraud Alerts
                ${overview.openFraudAlerts > 0 ? `<span class="badge" style="background:#fee2e2; color:#dc2626; margin-left:auto;">${overview.openFraudAlerts}</span>` : ""}
              </button>
              <button class="admin-nav-item ${currentTab === "audit" ? "active" : ""}" data-tab="audit">
                <span>📜</span> Audit Logs
              </button>
              <button class="admin-nav-item ${currentTab === "analytics" ? "active" : ""}" data-tab="analytics">
                <span>📈</span> Reports & Analytics
              </button>
            </aside>

            <main class="admin-main" id="adminTabContent">
              <div class="spinner" style="margin:40px auto;"></div>
            </main>
          </div>
          <div id="adminActionModalContainer"></div>
        `;

        // Bind sidebar tabs
        document.querySelectorAll(".admin-nav-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            currentTab = btn.getAttribute("data-tab");
            document.querySelectorAll(".admin-nav-item").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            loadTabContent(currentTab);
          });
        });

        await loadTabContent(currentTab);
      };

      const loadTabContent = async (tab) => {
        const contentContainer = document.getElementById("adminTabContent");
        if (!contentContainer) return;

        if (tab === "overview") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">System Overview</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Real-time metrics, platform growth, and pending verification actions.
                </p>
              </div>
            </div>

            <div class="stat-cards-grid">
              <div class="stat-card">
                <div class="stat-card-title">Total Users</div>
                <div class="stat-card-value">${overview.totalUsers || 0}</div>
                <div class="stat-card-sub">${overview.totalDonors || 0} Active Accounts</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-title">Pending Org Verifications</div>
                <div class="stat-card-value" style="color:${overview.pendingOrgVerifications > 0 ? "var(--red)" : "inherit"};">
                  ${overview.pendingOrgVerifications || 0}
                </div>
                <div class="stat-card-sub">Requires admin review</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-title">Active Blood Requests</div>
                <div class="stat-card-value">${overview.activeBloodRequests || 0}</div>
                <div class="stat-card-sub">${overview.pendingBloodRequests || 0} Pending Verification</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-title">Approved Blood Banks</div>
                <div class="stat-card-value">${overview.totalBloodBanks || 0}</div>
                <div class="stat-card-sub">Verified institutions</div>
              </div>
            </div>

            <div class="admin-table-card">
              <div class="admin-table-header">
                <strong>Recent Administrative & Platform Activity</strong>
              </div>
              ${recentActivity.length === 0 ? `
                <div style="padding:28px; text-align:center; color:var(--text-muted);">No activity recorded yet.</div>
              ` : `
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Admin / Actor</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Reason / Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentActivity.map((log) => `
                      <tr>
                        <td>${new Date(log.createdAt).toLocaleString()}</td>
                        <td><strong>${log.actorEmail}</strong></td>
                        <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${log.action}</span></td>
                        <td>${log.entityType}</td>
                        <td>${log.reason || "N/A"}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              `}
            </div>
          `;
        } else if (tab === "organizations") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Organization Verifications</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Review healthcare institutions, blood banks, and organizers before granting publishing privileges.
                </p>
              </div>
              <div style="display:flex; gap:8px;">
                <select id="orgStatusFilter" class="filter-select">
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING" selected>Pending Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
            <div id="orgQueueTableContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchOrgs = async () => {
            const status = document.getElementById("orgStatusFilter")?.value || "PENDING";
            const res = await api.getAdminOrganizations({ status });
            const data = await res.json();
            const orgs = data.data?.items || [];
            const container = document.getElementById("orgQueueTableContainer");
            if (!container) return;

            if (orgs.length === 0) {
              container.innerHTML = `<div class="auth-card" style="text-align:center; margin:30px auto;">No organizations match the selected filter.</div>`;
              return;
            }

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Organization</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>License No.</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orgs.map((o) => `
                      <tr>
                        <td>
                          <strong>${o.name}</strong><br>
                          <span style="font-size:0.75rem; color:var(--text-muted);">${o.contactEmail}</span>
                        </td>
                        <td><span class="badge">${o.type}</span></td>
                        <td>${o.address?.city || "N/A"}, ${o.address?.state || ""}</td>
                        <td>${o.licenseNumber || "Not Provided"}</td>
                        <td><span class="status-badge status-${o.verificationStatus || (o.isVerified ? "APPROVED" : "PENDING")}">${o.verificationStatus || "PENDING"}</span></td>
                        <td>
                          <button class="button verify-org-btn" data-id="${o._id || o.id}" style="padding:6px 12px; font-size:0.8rem;">Review</button>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;

            document.querySelectorAll(".verify-org-btn").forEach((b) => {
              b.addEventListener("click", () => {
                const id = b.getAttribute("data-id");
                const org = orgs.find((item) => (item._id || item.id) === id);
                if (org) openOrgReviewModal(org, fetchOrgs);
              });
            });
          };

          document.getElementById("orgStatusFilter")?.addEventListener("change", fetchOrgs);
          fetchOrgs();
        } else if (tab === "users") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">User Directory</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Manage platform users, inspect account statuses, and moderate suspensions.
                </p>
              </div>
            </div>
            <div id="usersTableContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchUsers = async () => {
            const res = await api.getAdminUsers();
            const data = await res.json();
            const users = data.data?.items || [];
            const container = document.getElementById("usersTableContainer");
            if (!container) return;

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Account Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${users.map((u) => `
                      <tr>
                        <td>
                          <strong>${u.fullName}</strong><br>
                          <span style="font-size:0.75rem; color:var(--text-muted);">${u.email}</span>
                        </td>
                        <td>${u.platformRoles?.includes("ADMIN") ? `<span class="badge" style="background:#e0f2fe; color:#0369a1;">ADMIN</span>` : `<span class="badge">USER</span>`}</td>
                        <td><span class="badge ${u.accountStatus === "ACTIVE" ? "badge-active" : ""}">${u.accountStatus}</span></td>
                        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          ${u.accountStatus === "ACTIVE" ? `
                            <button class="button button-outline suspend-user-btn" data-id="${u._id || u.id}" style="color:#dc2626; border-color:#fecaca; padding:6px 12px; font-size:0.8rem;">Suspend</button>
                          ` : `
                            <button class="button reactivate-user-btn" data-id="${u._id || u.id}" style="padding:6px 12px; font-size:0.8rem;">Reactivate</button>
                          `}
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;

            document.querySelectorAll(".suspend-user-btn").forEach((b) => {
              b.addEventListener("click", async () => {
                const id = b.getAttribute("data-id");
                const reason = prompt("Enter mandatory reason for suspending this user:");
                if (reason && reason.trim()) {
                  await api.updateUserAccountStatus(id, "SUSPENDED", reason.trim());
                  fetchUsers();
                }
              });
            });

            document.querySelectorAll(".reactivate-user-btn").forEach((b) => {
              b.addEventListener("click", async () => {
                const id = b.getAttribute("data-id");
                if (confirm("Reactivate this user account?")) {
                  await api.updateUserAccountStatus(id, "ACTIVE", "Administrative reactivation");
                  fetchUsers();
                }
              });
            });
          };

          fetchUsers();
        } else if (tab === "requests") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Blood Requests Moderation</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Oversee all public and emergency blood requests, verify hospital bed orders, and prevent fraud.
                </p>
              </div>
            </div>
            <div id="adminRequestsContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchRequests = async () => {
            const res = await api.getAdminBloodRequests();
            const data = await res.json();
            const requests = data.data?.items || [];
            const container = document.getElementById("adminRequestsContainer");
            if (!container) return;

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Req Number</th>
                      <th>Group & Component</th>
                      <th>Units</th>
                      <th>Hospital</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${requests.map((r) => `
                      <tr>
                        <td><strong>${r.requestNumber}</strong></td>
                        <td>${r.bloodGroup} (${r.component?.replace(/_/g, " ")})</td>
                        <td>${r.unitsRequired}</td>
                        <td>${r.hospitalName}</td>
                        <td><span class="urgency-badge urgency-${r.urgency}">${r.urgency}</span></td>
                        <td><span class="status-badge status-${r.status}">${r.status}</span></td>
                        <td>
                          <a href="#/requests/${r._id || r.id}" class="button" style="padding:6px 12px; font-size:0.8rem;">Inspect</a>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;
          };

          fetchRequests();
        } else if (tab === "fraud") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Fraud & Suspicious Activity Alerts</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Detect and resolve rapid repeated submissions, high quantity anomalies, and flagged accounts.
                </p>
              </div>
            </div>
            <div id="fraudAlertsContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchAlerts = async () => {
            const res = await api.getAdminFraudAlerts();
            const data = await res.json();
            const alerts = data.data?.items || [];
            const container = document.getElementById("fraudAlertsContainer");
            if (!container) return;

            if (alerts.length === 0) {
              container.innerHTML = `<div class="auth-card" style="text-align:center; margin:30px auto;">No open fraud alerts. System integrity is healthy.</div>`;
              return;
            }

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Severity</th>
                      <th>Title</th>
                      <th>Entity</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${alerts.map((a) => `
                      <tr>
                        <td><span class="badge" style="background:${a.severity === "CRITICAL" ? "#fee2e2" : "#fef9c3"}; color:${a.severity === "CRITICAL" ? "#991b1b" : "#854d0e"};">${a.severity}</span></td>
                        <td><strong>${a.title}</strong></td>
                        <td>${a.entityType}</td>
                        <td style="max-width:300px;">${a.description}</td>
                        <td><span class="badge">${a.status}</span></td>
                        <td>
                          <button class="button resolve-alert-btn" data-id="${a._id || a.id}" style="padding:6px 12px; font-size:0.8rem;">Resolve</button>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;

            document.querySelectorAll(".resolve-alert-btn").forEach((b) => {
              b.addEventListener("click", async () => {
                const id = b.getAttribute("data-id");
                const note = prompt("Enter resolution notes:");
                if (note) {
                  await api.resolveFraudAlert(id, "RESOLVED", note);
                  fetchAlerts();
                }
              });
            });
          };

          fetchAlerts();
        } else if (tab === "audit") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Administrative Audit Trail</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Immutable record of all verification decisions, privilege executions, and suspensions.
                </p>
              </div>
            </div>
            <div id="auditLogsContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchLogs = async () => {
            const res = await api.getAdminAuditLogs();
            const data = await res.json();
            const logs = data.data?.items || [];
            const container = document.getElementById("auditLogsContainer");
            if (!container) return;

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Admin Email</th>
                      <th>Action</th>
                      <th>Entity Type</th>
                      <th>Entity ID</th>
                      <th>Reason / Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${logs.map((l) => `
                      <tr>
                        <td>${new Date(l.createdAt).toLocaleString()}</td>
                        <td><strong>${l.actorEmail}</strong></td>
                        <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${l.action}</span></td>
                        <td>${l.entityType}</td>
                        <td><code>${l.entityId || "N/A"}</code></td>
                        <td>${l.reason || "N/A"}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;
          };

          fetchLogs();
        } else if (tab === "analytics") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Reports & Analytics</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Interactive platform trends, demand distribution, fulfillment performance, and secure CSV data export.
                </p>
              </div>
              <div>
                <button id="exportCsvBtn" class="button" style="padding:8px 16px; font-size:0.88rem;">
                  <span>📥</span> Export Requests CSV
                </button>
              </div>
            </div>

            <div class="date-filter-bar">
              <span style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">Date Range:</span>
              <button class="button button-outline date-range-btn active" data-range="30d" style="padding:6px 12px; font-size:0.82rem;">Last 30 Days</button>
              <button class="button button-outline date-range-btn" data-range="7d" style="padding:6px 12px; font-size:0.82rem;">Last 7 Days</button>
              <button class="button button-outline date-range-btn" data-range="90d" style="padding:6px 12px; font-size:0.82rem;">Last 90 Days</button>
              <button class="button button-outline date-range-btn" data-range="thisYear" style="padding:6px 12px; font-size:0.82rem;">This Year</button>

              <label style="margin-left:auto; display:flex; align-items:center; gap:8px; font-size:0.84rem; cursor:pointer;">
                <input type="checkbox" id="excludeDemoCheck" checked>
                <span>Exclude Demo Records</span>
              </label>
            </div>

            <div id="analyticsContentContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          let selectedRange = "30d";

          const fetchAnalytics = async () => {
            const container = document.getElementById("analyticsContentContainer");
            if (!container) return;
            container.innerHTML = `<div class="spinner" style="margin:40px auto;"></div>`;

            const excludeDemo = document.getElementById("excludeDemoCheck")?.checked !== false;
            const res = await api.getAdminReportsOverview({ range: selectedRange, excludeDemo });
            const data = await res.json();
            const report = data.data || {};
            const kpis = report.kpis || {};
            const bloodGroups = report.requestsByBloodGroup || [];
            const components = report.requestsByComponent || [];
            const statusBreakdown = report.requestsByStatus || [];

            // Find maximum count for proportional bar scaling
            const maxGroupCount = Math.max(...bloodGroups.map(g => g.count), 1);
            const maxComponentCount = Math.max(...components.map(c => c.count), 1);

            container.innerHTML = `
              <div class="stat-cards-grid">
                <div class="stat-card">
                  <div class="stat-card-title">Fulfillment Rate</div>
                  <div class="stat-card-value" style="color:var(--success);">${kpis.fulfillmentRate || 0}%</div>
                  <div class="stat-card-sub">${kpis.fulfilledRequests || 0} of ${kpis.totalRequests || 0} Requests</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-title">Total Units Required</div>
                  <div class="stat-card-value">${kpis.totalUnitsRequired || 0}</div>
                  <div class="stat-card-sub">${kpis.totalUnitsFulfilled || 0} Units Fulfilled</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-title">New Users Registered</div>
                  <div class="stat-card-value">${kpis.newUsers || 0}</div>
                  <div class="stat-card-sub">In selected timeframe</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-title">Active Requests</div>
                  <div class="stat-card-value" style="color:var(--red);">${kpis.activeRequests || 0}</div>
                  <div class="stat-card-sub">${kpis.pendingVerificationRequests || 0} Awaiting Verification</div>
                </div>
              </div>

              <div class="analytics-grid">
                <div class="chart-card">
                  <div class="chart-header">
                    <div>
                      <div class="chart-title">Demand by Blood Group</div>
                      <div class="chart-subtitle">Distribution of requests by blood group</div>
                    </div>
                  </div>
                  <div class="bar-chart-container">
                    ${bloodGroups.length === 0 ? `
                      <div style="padding:24px; text-align:center; color:var(--text-muted);">No request data in this range.</div>
                    ` : bloodGroups.map(g => `
                      <div class="bar-chart-row">
                        <div class="bar-chart-label">${g.bloodGroup}</div>
                        <div class="bar-chart-track">
                          <div class="bar-chart-fill" style="width:${Math.round((g.count / maxGroupCount) * 100)}%;"></div>
                        </div>
                        <div class="bar-chart-value">${g.count} <span style="font-size:0.75rem; font-weight:normal; color:var(--text-muted);">(${g.units}u)</span></div>
                      </div>
                    `).join("")}
                  </div>
                </div>

                <div class="chart-card">
                  <div class="chart-header">
                    <div>
                      <div class="chart-title">Demand by Component</div>
                      <div class="chart-subtitle">Distribution of requested blood components</div>
                    </div>
                  </div>
                  <div class="bar-chart-container">
                    ${components.length === 0 ? `
                      <div style="padding:24px; text-align:center; color:var(--text-muted);">No component data in this range.</div>
                    ` : components.map(c => `
                      <div class="bar-chart-row">
                        <div class="bar-chart-label" style="width:120px;">${c.component.replace(/_/g, " ")}</div>
                        <div class="bar-chart-track">
                          <div class="bar-chart-fill" style="background:#0369a1; width:${Math.round((c.count / maxComponentCount) * 100)}%;"></div>
                        </div>
                        <div class="bar-chart-value">${c.count} <span style="font-size:0.75rem; font-weight:normal; color:var(--text-muted);">(${c.units}u)</span></div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>

              <div class="admin-table-card">
                <div class="admin-table-header">
                  <strong>Lifecycle Status Breakdown</strong>
                </div>
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Status Category</th>
                      <th>Request Count</th>
                      <th>Percentage of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${statusBreakdown.length === 0 ? `
                      <tr><td colspan="3" style="text-align:center;">No records available.</td></tr>
                    ` : statusBreakdown.map(s => `
                      <tr>
                        <td><span class="status-badge status-${s.status}">${s.status}</span></td>
                        <td><strong>${s.count}</strong></td>
                        <td>${kpis.totalRequests > 0 ? ((s.count / kpis.totalRequests) * 100).toFixed(1) : 0}%</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;
          };

          // Bind range filter buttons
          document.querySelectorAll(".date-range-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              selectedRange = btn.getAttribute("data-range");
              document.querySelectorAll(".date-range-btn").forEach(b => b.classList.remove("active"));
              btn.classList.add("active");
              fetchAnalytics();
            });
          });

          document.getElementById("excludeDemoCheck")?.addEventListener("change", fetchAnalytics);

          // Handle secure CSV export trigger
          document.getElementById("exportCsvBtn")?.addEventListener("click", () => {
            const excludeDemo = document.getElementById("excludeDemoCheck")?.checked !== false;
            const exportUrl = api.getAdminExportCsvUrl({ range: selectedRange, excludeDemo });
            window.open(exportUrl, "_blank");
          });

          fetchAnalytics();
        }
      };

      const openOrgReviewModal = (org, onUpdate) => {
        const container = document.getElementById("adminActionModalContainer");
        if (!container) return;

        container.innerHTML = `
          <div class="modal-backdrop" id="orgModalBackdrop">
            <div class="modal-content" onclick="event.stopPropagation()">
              <h2 style="margin:0 0 6px 0;">Verify Organization</h2>
              <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:16px;">
                Review registered credentials and verification status for <strong>${org.name}</strong>.
              </p>

              <div style="background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:20px; font-size:0.88rem;">
                <div><strong>Type:</strong> ${org.type}</div>
                <div><strong>Official Contact:</strong> ${org.contactEmail}</div>
                <div><strong>Phone:</strong> ${org.phoneNumber || "Not provided"}</div>
                <div><strong>Address:</strong> ${org.address?.city || "N/A"}, ${org.address?.state || ""} — ${org.address?.pincode || ""}</div>
                <div><strong>License Number:</strong> ${org.licenseNumber || "N/A"}</div>
              </div>

              <div style="display:flex; flex-direction:column; gap:12px;">
                <label class="filter-label" for="orgRejectionReason">Rejection Reason (Mandatory if rejecting)</label>
                <textarea id="orgRejectionReason" class="filter-input" style="height:70px;" placeholder="Provide explicit reason if rejecting..."></textarea>
              </div>

              <div id="orgModalError" style="color:#dc2626; font-size:0.85rem; margin-top:10px; display:none;"></div>

              <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                <button type="button" id="closeOrgModalBtn" class="button button-outline">Cancel</button>
                <button type="button" id="rejectOrgBtn" class="button button-outline" style="color:#dc2626; border-color:#fecaca;">Reject</button>
                <button type="button" id="approveOrgBtn" class="button">Approve</button>
              </div>
            </div>
          </div>
        `;

        const close = () => { container.innerHTML = ""; };
        document.getElementById("closeOrgModalBtn")?.addEventListener("click", close);
        document.getElementById("orgModalBackdrop")?.addEventListener("click", close);

        document.getElementById("approveOrgBtn")?.addEventListener("click", async () => {
          try {
            await api.verifyOrganization(org._id || org.id, "APPROVED");
            close();
            onUpdate();
          } catch (err) {
            const errBox = document.getElementById("orgModalError");
            if (errBox) {
              errBox.textContent = err.message;
              errBox.style.display = "block";
            }
          }
        });

        document.getElementById("rejectOrgBtn")?.addEventListener("click", async () => {
          const reason = document.getElementById("orgRejectionReason")?.value?.trim();
          if (!reason) {
            const errBox = document.getElementById("orgModalError");
            if (errBox) {
              errBox.textContent = "A rejection reason is mandatory when rejecting an organization.";
              errBox.style.display = "block";
            }
            return;
          }

          try {
            await api.verifyOrganization(org._id || org.id, "REJECTED", reason);
            close();
            onUpdate();
          } catch (err) {
            const errBox = document.getElementById("orgModalError");
            if (errBox) {
              errBox.textContent = err.message;
              errBox.style.display = "block";
            }
          }
        });
      };

      await renderView();
    } catch (err) {
      this.renderForbidden();
    }
  }

  renderForbidden() {
    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width:480px;">
        <div style="font-size:2.4rem; margin-bottom:10px;">🚫</div>
        <h2>Access Denied</h2>
        <p class="subtitle" style="margin-bottom:20px;">
          You do not have administrative permissions to view this section.
        </p>
        <a href="#/profile" class="button">Return to Profile</a>
      </div>
    `;
  }

  // --- Phase 11 Blood Request Views ---

  async renderBloodRequests(params) {
    this.renderLoader("Fetching active blood requests...");
    try {
      const city = params.get("city") || "";
      const bloodGroup = params.get("bloodGroup") || "";
      const urgency = params.get("urgency") || "";

      const queryObj = {};
      if (city) queryObj.city = city;
      if (bloodGroup) queryObj.bloodGroup = bloodGroup;
      if (urgency) queryObj.urgency = urgency;

      const res = await api.getBloodRequests(queryObj);
      const data = await res.json();
      const requests = (data.success && data.data && data.data.requests) ? data.data.requests : [];

      this.appContainer.innerHTML = `
        <div class="requests-container">
          <div class="requests-header">
            <div>
              <h1 style="margin:0 0 6px 0; font-size:1.85rem;">Blood Requests</h1>
              <p style="margin:0; color:var(--text-muted); font-size:0.95rem;">
                Browse emergency and scheduled blood requirements across hospitals and healthcare centers.
              </p>
            </div>
            <a href="#/requests/create" class="button">
              <span>+</span> Create Request
            </a>
          </div>

          <div class="filter-bar">
            <div class="filter-group">
              <label class="filter-label" for="filterBloodGroup">Blood Group</label>
              <select id="filterBloodGroup" class="filter-select">
                <option value="">All Groups</option>
                <option value="A+" ${bloodGroup === "A+" ? "selected" : ""}>A+</option>
                <option value="A-" ${bloodGroup === "A-" ? "selected" : ""}>A-</option>
                <option value="B+" ${bloodGroup === "B+" ? "selected" : ""}>B+</option>
                <option value="B-" ${bloodGroup === "B-" ? "selected" : ""}>B-</option>
                <option value="AB+" ${bloodGroup === "AB+" ? "selected" : ""}>AB+</option>
                <option value="AB-" ${bloodGroup === "AB-" ? "selected" : ""}>AB-</option>
                <option value="O+" ${bloodGroup === "O+" ? "selected" : ""}>O+</option>
                <option value="O-" ${bloodGroup === "O-" ? "selected" : ""}>O-</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label" for="filterCity">City</label>
              <input type="text" id="filterCity" class="filter-input" placeholder="e.g. Delhi, Mumbai" value="${city}">
            </div>

            <div class="filter-group">
              <label class="filter-label" for="filterUrgency">Urgency</label>
              <select id="filterUrgency" class="filter-select">
                <option value="">All Urgencies</option>
                <option value="CRITICAL" ${urgency === "CRITICAL" ? "selected" : ""}>Critical</option>
                <option value="HIGH" ${urgency === "HIGH" ? "selected" : ""}>High</option>
                <option value="MEDIUM" ${urgency === "MEDIUM" ? "selected" : ""}>Medium</option>
                <option value="LOW" ${urgency === "LOW" ? "selected" : ""}>Low</option>
              </select>
            </div>

            <div style="display:flex; align-items:flex-end; gap:8px;">
              <button id="applyFiltersBtn" class="button" style="padding:8px 16px;">Filter</button>
              <button id="resetFiltersBtn" class="button button-outline" style="padding:8px 14px;">Reset</button>
            </div>
          </div>

          ${requests.length === 0 ? `
            <div class="auth-card" style="max-width:540px; margin: 40px auto; text-align:center;">
              <div style="font-size:2.2rem; margin-bottom:8px;">🩸</div>
              <h3>No Active Requests Found</h3>
              <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:20px;">
                No blood requests matched your current filter criteria. Check back soon or create a new request.
              </p>
              <a href="#/requests" class="button button-outline">View All Requests</a>
            </div>
          ` : `
            <div class="requests-grid">
              ${requests.map(r => `
                <div class="request-card urgent-${(r.urgency || "medium").toLowerCase()}">
                  <div class="request-card-header">
                    <span class="blood-badge">${r.bloodGroup}</span>
                    <span class="urgency-badge urgency-${r.urgency}">${r.urgency}</span>
                  </div>

                  <div>
                    <h3 style="margin:0 0 6px 0; font-size:1.15rem;">${r.hospitalName}</h3>
                    <div class="request-meta-row">
                      <span>📍</span>
                      <span>${r.location?.city || "Unknown City"}, ${r.location?.state || ""}</span>
                    </div>
                  </div>

                  <div class="request-details-grid">
                    <div>
                      <div class="filter-label">Component</div>
                      <strong>${r.component?.replace(/_/g, " ")}</strong>
                    </div>
                    <div>
                      <div class="filter-label">Units Needed</div>
                      <strong>${r.unitsRequired} Unit(s)</strong>
                    </div>
                    <div>
                      <div class="filter-label">Required By</div>
                      <span>${new Date(r.requiredBy).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <div class="filter-label">Patient Ref</div>
                      <span>${r.patientReference || "Confidential"}</span>
                    </div>
                  </div>

                  <div style="margin-top:auto; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                    <span class="status-badge status-${r.status}">${r.status}</span>
                    <a href="#/requests/${r.id || r._id}" class="button" style="padding:6px 14px; font-size:0.86rem;">
                      View Details →
                    </a>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `;

      document.getElementById("applyFiltersBtn")?.addEventListener("click", () => {
        const bg = document.getElementById("filterBloodGroup")?.value || "";
        const c = document.getElementById("filterCity")?.value?.trim() || "";
        const u = document.getElementById("filterUrgency")?.value || "";
        const query = new URLSearchParams();
        if (bg) query.set("bloodGroup", bg);
        if (c) query.set("city", c);
        if (u) query.set("urgency", u);
        window.location.hash = `#/requests?${query.toString()}`;
      });

      document.getElementById("resetFiltersBtn")?.addEventListener("click", () => {
        window.location.hash = "#/requests";
      });
    } catch (err) {
      this.appContainer.innerHTML = `
        <div class="auth-card">
          <p style="color:#dc2626;">Failed to load blood requests: ${err.message}</p>
          <a href="#/requests" class="button">Retry</a>
        </div>
      `;
    }
  }

  renderCreateBloodRequest() {
    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width:680px; text-align:left;">
        <h2 style="margin:0 0 6px 0;">Create Blood Request</h2>
        <p class="subtitle" style="margin-bottom:24px;">
          Submit a new requirement for urgent or planned transfusion needs. All requests are verified for safety.
        </p>

        <form id="createRequestForm" style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div>
              <label class="filter-label" for="reqBloodGroup">Blood Group *</label>
              <select id="reqBloodGroup" class="filter-select" style="width:100%; margin-top:4px;" required>
                <option value="">Select Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label class="filter-label" for="reqComponent">Component *</label>
              <select id="reqComponent" class="filter-select" style="width:100%; margin-top:4px;" required>
                <option value="WHOLE_BLOOD">Whole Blood</option>
                <option value="PACKED_RED_CELLS">Packed Red Cells</option>
                <option value="PLATELETS">Platelets</option>
                <option value="PLASMA">Fresh Frozen Plasma</option>
                <option value="CRYOPRECIPITATE">Cryoprecipitate</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div>
              <label class="filter-label" for="reqUnits">Units Required (Max 50) *</label>
              <input type="number" id="reqUnits" class="filter-input" style="width:100%; margin-top:4px;" min="1" max="50" value="1" required>
            </div>
            <div>
              <label class="filter-label" for="reqUrgency">Urgency Level *</label>
              <select id="reqUrgency" class="filter-select" style="width:100%; margin-top:4px;" required>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label class="filter-label" for="reqHospital">Hospital / Healthcare Facility *</label>
            <input type="text" id="reqHospital" class="filter-input" style="width:100%; margin-top:4px;" placeholder="e.g. AIIMS Delhi" required>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
            <div>
              <label class="filter-label" for="reqCity">City *</label>
              <input type="text" id="reqCity" class="filter-input" style="width:100%; margin-top:4px;" placeholder="Delhi" required>
            </div>
            <div>
              <label class="filter-label" for="reqState">State *</label>
              <input type="text" id="reqState" class="filter-input" style="width:100%; margin-top:4px;" placeholder="Delhi" required>
            </div>
            <div>
              <label class="filter-label" for="reqPin">Pin Code *</label>
              <input type="text" id="reqPin" class="filter-input" style="width:100%; margin-top:4px;" placeholder="110001" required>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div>
              <label class="filter-label" for="reqDeadline">Required By (Date & Time) *</label>
              <input type="datetime-local" id="reqDeadline" class="filter-input" style="width:100%; margin-top:4px;" required>
            </div>
            <div>
              <label class="filter-label" for="reqPatient">Patient Identifier / Hospital Bed No. *</label>
              <input type="text" id="reqPatient" class="filter-input" style="width:100%; margin-top:4px;" placeholder="e.g. IPD-9021 or Ward-4B" required>
            </div>
          </div>

          <div>
            <label class="filter-label" for="reqDesc">Clinical Context / Special Notes (Optional)</label>
            <textarea id="reqDesc" class="filter-input" style="width:100%; margin-top:4px; height:80px;" placeholder="Any additional notes or hospital contact details..."></textarea>
          </div>

          <div id="requestFormError" style="color:#dc2626; font-size:0.88rem; display:none;"></div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
            <a href="#/requests" class="button button-outline">Cancel</a>
            <button type="submit" id="submitRequestBtn" class="button">Submit Request</button>
          </div>
        </form>
      </div>
    `;

    // Set default deadline to 24h in the future
    const defaultDate = new Date(Date.now() + 86400000).toISOString().slice(0, 16);
    const deadlineInput = document.getElementById("reqDeadline");
    if (deadlineInput) deadlineInput.value = defaultDate;

    document.getElementById("createRequestForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errBox = document.getElementById("requestFormError");
      const btn = document.getElementById("submitRequestBtn");
      if (errBox) errBox.style.display = "none";
      if (btn) btn.disabled = true;

      try {
        const payload = {
          bloodGroup: document.getElementById("reqBloodGroup")?.value,
          component: document.getElementById("reqComponent")?.value,
          unitsRequired: parseInt(document.getElementById("reqUnits")?.value, 10),
          urgency: document.getElementById("reqUrgency")?.value,
          hospitalName: document.getElementById("reqHospital")?.value?.trim(),
          location: {
            city: document.getElementById("reqCity")?.value?.trim(),
            state: document.getElementById("reqState")?.value?.trim(),
            pinCode: document.getElementById("reqPin")?.value?.trim()
          },
          requiredBy: new Date(document.getElementById("reqDeadline")?.value).toISOString(),
          patientReference: document.getElementById("reqPatient")?.value?.trim(),
          description: document.getElementById("reqDesc")?.value?.trim()
        };

        const res = await api.createBloodRequest(payload);
        const data = await res.json();

        if (res.ok && data.success) {
          window.location.hash = `#/requests/${data.data._id || data.data.id}`;
        } else {
          throw new Error(data.message || "Failed to create request");
        }
      } catch (err) {
        if (errBox) {
          errBox.textContent = err.message;
          errBox.style.display = "block";
        }
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

  async renderBloodRequestDetail(requestId) {
    this.renderLoader("Loading request details...");
    try {
      const res = await api.getBloodRequestById(requestId);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Blood request not found");
      }

      const r = data.data;
      const state = authState.getState();
      const isOwner = state.user && (r.createdByUserId === state.user.id || r.createdByUserId?._id === state.user.id);

      this.appContainer.innerHTML = `
        <div class="requests-container" style="max-width:800px;">
          <div style="margin-bottom:16px;">
            <a href="#/requests" style="color:var(--text-muted); font-size:0.88rem;">← Back to Blood Requests</a>
          </div>

          <div class="auth-card" style="text-align:left; max-width:100%;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
              <div>
                <span class="blood-badge" style="font-size:1.5rem; padding:8px 16px;">${r.bloodGroup}</span>
                <span class="urgency-badge urgency-${r.urgency}" style="margin-left:8px;">${r.urgency} URGENCY</span>
                <span class="status-badge status-${r.status}" style="margin-left:6px;">${r.status}</span>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.8rem; color:var(--text-muted);">Request No.</div>
                <strong>${r.requestNumber || "N/A"}</strong>
              </div>
            </div>

            <h2 style="margin:0 0 10px 0;">${r.hospitalName}</h2>
            <div class="request-meta-row" style="margin-bottom:20px;">
              <span>📍</span>
              <span>${r.location?.city || "Unknown"}, ${r.location?.state || ""} — Pin: ${r.location?.pinCode || "N/A"}</span>
            </div>

            <div class="request-details-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom:24px;">
              <div>
                <div class="filter-label">Component</div>
                <strong>${r.component?.replace(/_/g, " ")}</strong>
              </div>
              <div>
                <div class="filter-label">Units Needed</div>
                <strong>${r.unitsRequired} Unit(s)</strong>
              </div>
              <div>
                <div class="filter-label">Units Fulfilled</div>
                <strong>${r.unitsFulfilled || 0} Unit(s)</strong>
              </div>
              <div>
                <div class="filter-label">Required By</div>
                <span>${new Date(r.requiredBy).toLocaleString()}</span>
              </div>
              <div>
                <div class="filter-label">Patient Identifier</div>
                <span>${r.patientReference || "Confidential"}</span>
              </div>
              <div>
                <div class="filter-label">Created At</div>
                <span>${new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            ${r.description ? `
              <div style="margin-bottom:24px;">
                <div class="filter-label" style="margin-bottom:4px;">Clinical Context & Notes</div>
                <p style="margin:0; font-size:0.92rem; line-height:1.5;">${r.description}</p>
              </div>
            ` : ""}

            <div style="border-top:1px solid var(--border); padding-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
              <div>
                ${state.isAdmin ? `
                  <button id="adminVerifyBtn" class="button" style="background:#0369a1; border-color:#0369a1; font-size:0.88rem;">
                    🛡️ Admin: Verify Request
                  </button>
                ` : ""}
              </div>

              <div style="display:flex; gap:12px;">
                ${isOwner ? `
                  <button id="markFulfilledBtn" class="button button-outline" style="font-size:0.88rem;">Mark Fulfilled</button>
                  <button id="cancelRequestBtn" class="button button-outline" style="color:#dc2626; border-color:#fecaca; font-size:0.88rem;">Cancel Request</button>
                ` : `
                  ${r.status === "ACTIVE" || r.status === "RESPONSES_RECEIVED" ? `
                    <button id="respondDonationBtn" class="button">Offer to Donate</button>
                  ` : `
                    <span style="color:var(--text-muted); font-size:0.88rem;">This request is ${r.status.toLowerCase()}.</span>
                  `}
                `}
              </div>
            </div>
          </div>

          <div id="responseModalContainer"></div>
        </div>
      `;

      // Handle donation offer modal
      document.getElementById("respondDonationBtn")?.addEventListener("click", () => {
        if (!state.isAuthenticated) {
          window.location.hash = "#/login?error=auth_required";
          return;
        }
        this.openDonationModal(requestId, r);
      });

      // Handle requester actions
      document.getElementById("markFulfilledBtn")?.addEventListener("click", async () => {
        if (confirm("Mark this blood request as fulfilled?")) {
          await api.updateRequestStatus(requestId, "FULFILLED", "Fulfilled by user");
          this.renderBloodRequestDetail(requestId);
        }
      });

      document.getElementById("cancelRequestBtn")?.addEventListener("click", async () => {
        if (confirm("Are you sure you want to cancel this blood request?")) {
          await api.updateRequestStatus(requestId, "CANCELLED", "Cancelled by requester");
          this.renderBloodRequestDetail(requestId);
        }
      });

      // Platform admin verification
      document.getElementById("adminVerifyBtn")?.addEventListener("click", async () => {
        const approved = confirm("Approve and verify this blood request?");
        const status = approved ? "VERIFIED" : "REJECTED";
        const note = prompt("Administrative note:", "Verified authentic hospital requirement") || "";
        await api.verifyBloodRequest(requestId, status, note);
        this.renderBloodRequestDetail(requestId);
      });
    } catch (err) {
      this.appContainer.innerHTML = `
        <div class="auth-card">
          <p style="color:#dc2626;">Error: ${err.message}</p>
          <a href="#/requests" class="button">Back to Requests</a>
        </div>
      `;
    }
  }

  openDonationModal(requestId, request) {
    const container = document.getElementById("responseModalContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="modal-backdrop" id="modalBackdrop">
        <div class="modal-content" onclick="event.stopPropagation()">
          <h3 style="margin:0 0 8px 0;">Offer to Donate Blood</h3>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:16px;">
            Responding to ${request.hospitalName} for blood group <strong>${request.bloodGroup}</strong>.
          </p>

          <form id="donationResponseForm" style="display:flex; flex-direction:column; gap:14px;">
            <div>
              <label class="filter-label" for="offerUnits">Units You Can Donate</label>
              <input type="number" id="offerUnits" class="filter-input" style="width:100%; margin-top:4px;" min="1" max="${request.unitsRequired}" value="1" required>
            </div>

            <div>
              <label class="filter-label" for="offerMessage">Message to Requester (Optional)</label>
              <textarea id="offerMessage" class="filter-input" style="width:100%; margin-top:4px; height:70px;" placeholder="e.g. Available tomorrow 10am at the hospital blood bank."></textarea>
            </div>

            <div style="background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:12px;">
              <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer; font-size:0.88rem;">
                <input type="checkbox" id="contactConsentCheck" checked style="margin-top:2px;">
                <span>Share my verified phone number and email with the requester to coordinate transfusion.</span>
              </label>
            </div>

            <div id="modalErrorBox" style="color:#dc2626; font-size:0.85rem; display:none;"></div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
              <button type="button" id="closeModalBtn" class="button button-outline">Cancel</button>
              <button type="submit" id="submitResponseBtn" class="button">Confirm Offer</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const close = () => { container.innerHTML = ""; };
    document.getElementById("closeModalBtn")?.addEventListener("click", close);
    document.getElementById("modalBackdrop")?.addEventListener("click", close);

    document.getElementById("donationResponseForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errBox = document.getElementById("modalErrorBox");
      const submitBtn = document.getElementById("submitResponseBtn");
      if (errBox) errBox.style.display = "none";
      if (submitBtn) submitBtn.disabled = true;

      try {
        const payload = {
          unitsOffered: parseInt(document.getElementById("offerUnits")?.value, 10),
          message: document.getElementById("offerMessage")?.value?.trim(),
          contactSharingConsent: document.getElementById("contactConsentCheck")?.checked || false
        };

        const res = await api.submitDonationResponse(requestId, payload);
        const data = await res.json();

        if (res.ok && data.success) {
          alert("Thank you! Your donation response has been transmitted to the requester.");
          close();
          this.renderBloodRequestDetail(requestId);
        } else {
          throw new Error(data.message || "Failed to submit response");
        }
      } catch (err) {
        if (errBox) {
          errBox.textContent = err.message;
          errBox.style.display = "block";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  async renderMyBloodRequests() {
    this.renderLoader("Loading your blood requests...");
    try {
      const res = await api.getMyBloodRequests();
      const data = await res.json();
      const requests = (data.success && data.data) ? data.data : [];

      this.appContainer.innerHTML = `
        <div class="requests-container">
          <div class="requests-header">
            <div>
              <h1 style="margin:0 0 6px 0; font-size:1.85rem;">My Blood Requests</h1>
              <p style="margin:0; color:var(--text-muted); font-size:0.95rem;">
                Manage your active and completed blood requirements, review donor responses, and update statuses.
              </p>
            </div>
            <a href="#/requests/create" class="button">+ Create Request</a>
          </div>

          ${requests.length === 0 ? `
            <div class="auth-card" style="max-width:520px; margin:40px auto; text-align:center;">
              <div style="font-size:2.2rem; margin-bottom:8px;">📋</div>
              <h3>No Requests Created</h3>
              <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:20px;">
                You haven't submitted any blood donation requests yet.
              </p>
              <a href="#/requests/create" class="button">Create Your First Request</a>
            </div>
          ` : `
            <div class="requests-grid">
              ${requests.map(r => `
                <div class="request-card urgent-${(r.urgency || "medium").toLowerCase()}">
                  <div class="request-card-header">
                    <span class="blood-badge">${r.bloodGroup}</span>
                    <span class="status-badge status-${r.status}">${r.status}</span>
                  </div>

                  <div>
                    <h3 style="margin:0 0 4px 0;">${r.hospitalName}</h3>
                    <div class="request-meta-row">
                      <span>📍</span>
                      <span>${r.location?.city || "Unknown City"}</span>
                    </div>
                  </div>

                  <div class="request-details-grid">
                    <div>
                      <div class="filter-label">Units Needed</div>
                      <strong>${r.unitsRequired} Unit(s)</strong>
                    </div>
                    <div>
                      <div class="filter-label">Fulfilled</div>
                      <strong>${r.unitsFulfilled || 0} Unit(s)</strong>
                    </div>
                    <div>
                      <div class="filter-label">Urgency</div>
                      <span class="urgency-badge urgency-${r.urgency}">${r.urgency}</span>
                    </div>
                    <div>
                      <div class="filter-label">Verification</div>
                      <span>${r.verificationStatus?.status || "PENDING"}</span>
                    </div>
                  </div>

                  <div style="margin-top:auto; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                    <a href="#/requests/${r.id || r._id}" class="button" style="padding:6px 14px; font-size:0.86rem;">
                      Manage & Responses →
                    </a>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `;
    } catch (err) {
      this.appContainer.innerHTML = `
        <div class="auth-card">
          <p style="color:#dc2626;">Failed to load your requests: ${err.message}</p>
          <a href="#/requests" class="button">Back to Requests</a>
        </div>
      `;
    }
  }


  renderPlaceholderPage(title, description, icon = "ℹ️", ctaText = "Back to Home", ctaLink = "#/") {
    this.appContainer.innerHTML = `
      <div class="landing-container" style="padding: 64px 20px;">
        <div class="auth-card" style="max-width: 600px; text-align: center; margin: 0 auto;">
          <div style="font-size: 2.8rem; margin-bottom: 16px;">${icon}</div>
          <h1 style="font-size: 1.8rem; margin: 0 0 12px 0;">${title}</h1>
          <p style="color: var(--text-muted); line-height: 1.6; margin: 0 0 28px 0; font-size: 1rem;">
            ${description}
          </p>
          <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
            <a href="${ctaLink}" class="button">${ctaText}</a>
            <a href="#/find-blood" class="button button-outline">Find Blood Donors</a>
          </div>
        </div>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

}
