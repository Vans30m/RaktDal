export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" }
];
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
import { icons } from "./icons.js";
import { toast } from "./toast.js";
import { authViews } from "./views/auth.views.js";
import { adminViews } from "./views/admin.views.js";
import { campViews } from "./views/camp.views.js";
import { notificationViews } from "./views/notification.views.js";
import { requestViews } from "./views/request.views.js";
import { infoViews } from "./views/info.views.js";

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
      this.closeUserMenu();
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


    // Setup language dropdown in navbar
    this.setupLanguageSelector();
  }

  setupMobileNav() {
    const toggleBtn = document.getElementById("mobileNavToggle");
    const mainNav = document.getElementById("mainNav");
    if (toggleBtn && mainNav) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.isMobileNavOpen = !this.isMobileNavOpen;
        mainNav.classList.toggle("mobile-open", this.isMobileNavOpen);
        document.body.classList.toggle("nav-open-lock", this.isMobileNavOpen);
        toggleBtn.setAttribute("aria-expanded", this.isMobileNavOpen ? "true" : "false");
      });

      // Close mobile menu when selecting any link
      mainNav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => this.closeMobileNav());
      });
    }
  }

  
  setupLanguageSelector() {
    this.renderLanguageSelector();

    // Close language selector when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#langSelectorWrapper")) {
        this.closeLanguageSelector();
      }
    });
  }

  toggleLanguageSelector() {
    const dropdown = document.getElementById("langDropdown");
    const wrapper = document.getElementById("langSelectorWrapper");
    const btn = document.getElementById("langSelectorBtn");
    if (!dropdown || !wrapper) return;

    const isOpen = dropdown.classList.contains("show");
    if (isOpen) {
      this.closeLanguageSelector();
    } else {
      dropdown.classList.add("show");
      wrapper.classList.add("open");
      btn?.setAttribute("aria-expanded", "true");
    }
  }

  closeLanguageSelector() {
    const dropdown = document.getElementById("langDropdown");
    const wrapper = document.getElementById("langSelectorWrapper");
    const btn = document.getElementById("langSelectorBtn");
    if (dropdown) dropdown.classList.remove("show");
    if (wrapper) wrapper.classList.remove("open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  getCurrentLang() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (match) {
      const parts = decodeURIComponent(match[1]).split("/");
      return parts[parts.length - 1] || "en";
    }
    return localStorage.getItem("raktdal_lang") || "en";
  }

  setWebsiteLanguage(langCode) {
    localStorage.setItem("raktdal_lang", langCode);
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

    const clearCookie = (name) => {
      // Clear host-only cookie
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      // Clear with domain attributes
      if (!isLocal) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
      }
    };

    if (langCode === "en") {
      clearCookie("googtrans");
    } else {
      const transVal = `/en/${langCode}`;
      // Set host-only cookie (crucial for onrender.com subdomains)
      document.cookie = `googtrans=${transVal}; path=/;`;
      if (!isLocal) {
        document.cookie = `googtrans=${transVal}; path=/; domain=${hostname};`;
      }
    }

    // Trigger select element in DOM directly if already rendered
    const selectEl = document.querySelector(".goog-te-combo");
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));
    }

    window.location.reload();
  }

  renderLanguageSelector() {
    const dropdown = document.getElementById("langDropdown");
    const currentLabel = document.getElementById("currentLangLabel");
    const triggerBtn = document.getElementById("langSelectorBtn");
    if (!dropdown) return;

    const curLang = this.getCurrentLang();
    const currentMeta = SUPPORTED_LANGUAGES.find(l => l.code === curLang) || SUPPORTED_LANGUAGES[0];
    if (currentLabel) {
      currentLabel.textContent = currentMeta.nativeName;
    }

    dropdown.innerHTML = SUPPORTED_LANGUAGES.map(lang => {
      const isSelected = lang.code === currentMeta.code;
      return `
        <button class="lang-option-item ${isSelected ? 'active' : ''}" data-lang="${lang.code}" role="menuitem" aria-label="${lang.name} (${lang.nativeName})">
          <span>${lang.nativeName} <small style="color:var(--text-muted); font-size:0.75rem; margin-left:4px;">(${lang.name})</small></span>
          ${isSelected ? '<span class="lang-check-icon">✓</span>' : ''}
        </button>
      `;
    }).join("");

    if (triggerBtn) {
      triggerBtn.onclick = (e) => {
        e.stopPropagation();
        this.toggleLanguageSelector();
      };
    }

    dropdown.querySelectorAll(".lang-option-item").forEach(item => {
      item.onclick = (e) => {
        e.stopPropagation();
        const code = item.getAttribute("data-lang");
        this.closeLanguageSelector();
        this.setWebsiteLanguage(code);
      };
    });
  }

  closeMobileNav() {
    this.isMobileNavOpen = false;
    const mainNav = document.getElementById("mainNav");
    const toggleBtn = document.getElementById("mobileNavToggle");
    if (mainNav) mainNav.classList.remove("mobile-open");
    document.body.classList.remove("nav-open-lock");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
  }

  updateActiveNav() {
    const { path } = this.getRouteInfo();
    const navLinks = document.querySelectorAll("#mainNav a");
    navLinks.forEach(link => {
      const route = link.getAttribute("data-route");
      // Match active nav: if route equals path, or if on /donor/* highlight Donate Blood (/donor/register)
      const isMatch = (route === path) || 
                      (route !== "/" && path.startsWith(route)) ||
                      (route === "/donor/register" && path.startsWith("/donor"));

      if (isMatch) {
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
        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="#/notifications" class="notif-bell-btn" id="navNotifBell" title="Notifications" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span id="navNotifBadge" class="notif-bell-badge" style="display: none;">0</span>
          </a>

          <div class="user-menu-wrapper">
            <button id="userMenuTrigger" class="user-menu-trigger" aria-haspopup="true" aria-expanded="${this.isMenuOpen}">
              ${u.profileImage ? `<img src="${u.profileImage}" class="user-nav-avatar" alt="" referrerpolicy="no-referrer" onerror="this.onerror=null; this.outerHTML='<div class=\\'user-nav-avatar\\'>${initial}</div>';">` : `<div class="user-nav-avatar">${initial}</div>`}
              <span>${u.fullName.split(" ")[0]}</span>
              <span style="font-size:0.7rem; color:var(--text-muted);">▼</span>
            </button>

            <div id="userMenuDropdown" class="user-menu-dropdown ${this.isMenuOpen ? "show" : ""}" role="menu">
              <div class="user-menu-header">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <div class="user-menu-name">${u.fullName}</div>
                  <span class="badge ${u.accountStatus === "ACTIVE" ? "badge-active" : ""}" style="font-size:0.68rem; padding:2px 6px;">${u.accountStatus}</span>
                  ${state.isAdmin ? `<span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.68rem; padding:2px 6px;">ADMIN</span>` : ""}
                </div>
                <div class="user-menu-email" style="margin-top:2px;">${u.email}</div>
              </div>

              <div class="user-menu-items">
                <a href="#/notifications" class="user-menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  Notifications
                </a>
                <a href="#/profile" class="user-menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile & Sessions
                </a>
                <a href="#/requests/my" class="user-menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2c-4 6-6.5 9-6.5 12a6.5 6.5 0 0 0 13 0c0-3-2.5-6-6.5-12z"></path>
                  </svg>
                  My Blood Requests
                </a>
                ${state.isAdmin ? `
                  <a href="#/admin" class="user-menu-item" style="color:#0369a1; font-weight:600;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Admin Dashboard
                  </a>
                ` : ""}
                <button id="userMenuLogoutBtn" class="user-menu-item logout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Update unread notification count
      this.refreshNotificationBadge();

      document.getElementById("userMenuTrigger")?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleUserMenu();
      });

      // Close menu when any dropdown link is clicked
      document.getElementById("userMenuDropdown")?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          this.closeUserMenu();
        });
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

  async refreshNotificationBadge(checkIncomingAlerts = false) {
    if (!authState.isAuthenticated()) return;
    try {
      const badge = document.getElementById("navNotifBadge");
      const res = await api.getUnreadNotificationCount();
      const data = await res.json();
      const count = data.data?.unreadCount || 0;

      if (badge) {
        if (count > 0) {
          badge.textContent = count > 99 ? "99+" : count;
          badge.style.display = "flex";
        } else {
          badge.style.display = "none";
        }
      }

      // If new unread notifications arrived and polling is active, toast the newest alert!
      if (checkIncomingAlerts && typeof this.previousUnreadCount === "number" && count > this.previousUnreadCount) {
        const notifRes = await api.getNotifications(1, 1, true);
        const notifData = await notifRes.json();
        const latest = notifData.data?.items?.[0];
        if (latest) {
          toast.show({
            title: latest.title || "New Emergency Blood Alert",
            message: latest.message || "You have received an urgent blood request notification.",
            type: "urgent",
            duration: 8000
          });
          // If the user is currently on the notifications page, re-render it
          if (window.location.hash.startsWith("#/notifications")) {
            notificationViews.renderNotificationCenter.call(this);
          }
        }
      }
      this.previousUnreadCount = count;
    } catch (e) {
      // Graceful fallback if unauthenticated or offline
    }
  }

  startNotificationPolling() {
    if (this._notifPollTimer) clearInterval(this._notifPollTimer);
    // Poll every 8 seconds for real-time background notification toast alerts
    this._notifPollTimer = setInterval(() => {
      const state = authState.getState();
      if (state.isAuthenticated) {
        this.refreshNotificationBadge(true);
      }
    }, 8000);
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
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const { path, params } = this.getRouteInfo();

    // Always render the rich 4-column footer on all pages
    const globalFooter = document.getElementById("globalSiteFooter");
    if (globalFooter && !globalFooter.innerHTML.trim()) {
      globalFooter.innerHTML = homeViews.getFooterHtml();
    }

    this.updateActiveNav();
    const state = authState.getState();
    if (state.isAuthenticated) {
      this.refreshNotificationBadge();
    }

    // Wait for initial auth inspection to complete before running guards
    if (state.loading && !state.initialized) {
      this.renderLoader("Verifying identity...");
      return;
    }

    // Route Guards
    if ((path === "/profile" || path === "/notifications" || path === "/notifications/settings" || path === "/requests/create" || path === "/requests/my" || path === "/donor/dashboard" || path === "/donor/register" || path === "/donor/edit" || path === "/donor/availability" || path === "/donor/consent") && !state.isAuthenticated) {
      window.location.hash = "#/login";
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

    // Phase 13: Donation Camps direct routes
    if (path.startsWith("/camps/") && path.endsWith("/register")) {
      const campId = path.split("/")[2];
      this.renderCamps(params).then(() => {
        campViews.renderCampDetailModal(campId);
      });
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
      case "/verify-email":
        this.renderVerifyEmail(params);
        break;
      case "/auth/callback":
        this.renderAuthCallback(params);
        break;
      case "/notifications":
        this.renderNotifications();
        break;
      case "/notifications/settings":
        this.renderNotificationSettings();
        break;
      case "/profile":
        this.renderProfile();
        break;
      case "/admin":
        this.renderAdminDashboard();
        break;
      case "/blood-banks":
        this.renderBloodBanks(params);
        break;
      case "/camps":
        this.renderCamps(params).then(() => {
          if (params.registerCampId) {
            campViews.renderCampDetailModal(params.registerCampId);
          }
        });
        break;
      case "/camps/my-registrations":
        this.renderMyCampRegistrations();
        break;
      case "/about":
        infoViews.renderAbout(this.appContainer);
        break;
      case "/how-it-works":
        infoViews.renderHowItWorks(this.appContainer);
        break;
      case "/contact":
        infoViews.renderContact(this.appContainer);
        break;
      case "/privacy":
        infoViews.renderPrivacy(this.appContainer);
        break;
      case "/terms":
        infoViews.renderTerms(this.appContainer);
        break;
      case "/disclaimer":
        infoViews.renderDisclaimer(this.appContainer);
        break;
      case "/help":
        infoViews.renderHelp(this.appContainer);
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
    this.appContainer.innerHTML = homeViews.getHomeHtml();
    homeViews.initScrollAnimations(this.appContainer);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  renderLogin(params) {
    return authViews.renderLogin.call(this, params);
  }

  renderRegister(params) {
    return authViews.renderRegister.call(this, params);
  }

  renderVerifyEmail(params) {
    return authViews.renderVerifyEmail.call(this, params);
  }

  renderAuthCallback(params) {
    return authViews.renderAuthCallback.call(this, params);
  }

  async renderBloodBanks(params) {
    return campViews.renderBloodBanks.call(this, params);
  }

  async renderCamps(params) {
    return campViews.renderCamps.call(this, params);
  }

  async renderMyCampRegistrations() {
    return campViews.renderMyCampRegistrations.call(this);
  }

  async renderNotifications() {
    return notificationViews.renderNotificationCenter.call(this);
  }

  async renderNotificationSettings() {
    return notificationViews.renderNotificationSettings.call(this);
  }

  async renderProfile() {
    return authViews.renderProfile.call(this);
  }

  async renderAdminDashboard(initialTab = "overview") {
    return adminViews.renderAdminDashboard.call(this, initialTab);
  }

  renderForbidden(title, message) {
    return adminViews.renderForbidden.call(this, title, message);
  }

  async renderBloodRequests(params) {
    return requestViews.renderBloodRequests.call(this, params);
  }

  async renderCreateBloodRequest() {
    return requestViews.renderCreateBloodRequest.call(this);
  }

  async renderBloodRequestDetail(requestId) {
    return requestViews.renderBloodRequestDetail.call(this, requestId);
  }

  openDonationModal(requestId, request) {
    return requestViews.openDonationModal.call(this, requestId, request);
  }

  async renderMyBloodRequests() {
    return requestViews.renderMyBloodRequests.call(this);
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
