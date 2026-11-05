import { api } from "../api.js";
import { authState } from "../auth.js";
import { toast } from "../toast.js";
import { icons } from "../icons.js";

export const GOOGLE_ICON_SVG = `
  <svg viewBox="0 0 24 24" style="width:20px; height:20px; flex-shrink:0;">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
`;

export const authViews = {
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
        <img src="assets/logo-removebg.png" alt="RaktDal Logo" class="brand-logo" style="width: 48px; height: 48px; margin: 0 auto 16px; display: block; object-fit: contain;">
        <h2>Sign In to RaktDal</h2>
        <p class="subtitle">Access your blood donor profile, request support, and manage appointments securely.</p>

        <div id="loginMsg">
          ${errorMessage ? `
            <div class="alert alert-error" role="alert" style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:8px;">
                
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
                <span>${errorMessage}</span>
              </div>
              <button type="button" onclick="document.getElementById('loginMsg').innerHTML=''" style="background:none; border:none; color:inherit; cursor:pointer; font-size:1.1rem; padding:0 4px;">&times;</button>
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

    
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const clearMsg = () => { const m = document.getElementById("loginMsg"); if (m) m.innerHTML = ""; };
    emailInput?.addEventListener("input", clearMsg);
    passwordInput?.addEventListener("input", clearMsg);

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
          const user = data.data?.user;
          if (user) {
            authState.setUser(user);
            this.renderNav(authState.getState());
          }
          toast.success(`Welcome back, ${user?.fullName?.split(" ")[0] || "Donor"}!`, "Signed In");
          await authState.init();
          this.renderNav(authState.getState());
          setTimeout(() => {
            window.location.hash = "#/";
          }, 400);
        } else {
          const errMsg = data.message || "Invalid credentials.";
          msgEl.innerHTML = `<div class="alert alert-error">${errMsg}</div>`;
          toast.error(errMsg, "Sign In Failed");
        }
      } catch (err) {
        console.error("Login attempt failed:", err);
        const errMsg = "Unable to connect to server. Please check your network.";
        msgEl.innerHTML = `<div class="alert alert-error">${errMsg}</div>`;
        toast.error(errMsg, "Connection Error");
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Sign In</span>';
      }
    });
  },

  renderRegister(params) {
    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width: 440px;">
        <img src="assets/logo-removebg.png" alt="RaktDal Logo" class="brand-logo" style="width: 48px; height: 48px; margin: 0 auto 16px; display: block; object-fit: contain;">
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
            localStorage.setItem("raktdal_pending_email", email);
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
  },

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
  },

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
            <span class="badge badge-active" style="display:inline-flex; align-items:center; gap:4px;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg> Google Verified</span>
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
};
