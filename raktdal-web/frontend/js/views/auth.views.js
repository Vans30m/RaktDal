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

export const EYE_OPEN_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
`;

export const EYE_OFF_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
`;

export function setupPasswordToggle(inputId, toggleBtnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(toggleBtnId);
  if (!input || !btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.innerHTML = isPassword ? EYE_OFF_SVG : EYE_OPEN_SVG;
    btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    btn.setAttribute("title", isPassword ? "Hide password" : "Show password");
  });
}

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
      admin_required: "Administrative authorization required. Please sign in with an Admin account.",
      session_expired: "Your login session has expired after 1 hour for your security. Please sign in again."
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
            <div class="password-input-wrapper">
              <input type="password" id="loginPassword" class="form-input" required placeholder="Enter your password">
              <button type="button" id="loginPasswordToggle" class="password-toggle-btn" aria-label="Show password" title="Show password">
                ${EYE_OPEN_SVG}
              </button>
            </div>
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

    setupPasswordToggle("loginPassword", "loginPasswordToggle");

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
          if (data.requiresOtp || data.data?.requiresOtp) {
            const targetEmail = data.data?.email || email;
            localStorage.setItem("raktdal_pending_email", targetEmail);
            toast.info("A 6-digit verification code has been sent to your email.", "Enter OTP");
            setTimeout(() => {
              window.location.hash = "#/verify-email?email=" + encodeURIComponent(targetEmail);
            }, 300);
            return;
          }

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
          if (data.error?.code === "EMAIL_NOT_VERIFIED") {
            const unverifiedEmail = data.error.email || email;
            localStorage.setItem("raktdal_pending_email", unverifiedEmail);
            toast.info("A fresh verification code was sent to your email.");
            setTimeout(() => {
              window.location.hash = "#/verify-email?email=" + encodeURIComponent(unverifiedEmail);
            }, 600);
            return;
          }
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
            <div class="password-input-wrapper">
              <input type="password" id="regPassword" class="form-input" required minlength="8" placeholder="At least 8 characters">
              <button type="button" id="regPasswordToggle" class="password-toggle-btn" aria-label="Show password" title="Show password">
                ${EYE_OPEN_SVG}
              </button>
            </div>
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

    setupPasswordToggle("regPassword", "regPasswordToggle");

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
          msgEl.innerHTML = `<div class="alert alert-success">${data.message || "Registration successful! Redirecting to email verification..."}</div>`;
          localStorage.setItem("raktdal_pending_email", email);
          setTimeout(() => {
            window.location.hash = "#/verify-email?email=" + encodeURIComponent(email);
          }, 300);
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

  renderVerifyEmail(params) {
    const emailParam = params.get("email") || localStorage.getItem("raktdal_pending_email") || "";

    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width: 440px;">
        <img src="assets/logo-removebg.png" alt="RaktDal Logo" class="brand-logo" style="width: 48px; height: 48px; margin: 0 auto 16px; display: block; object-fit: contain;">
        <h2>Verify Your Email</h2>
        <p class="subtitle">Enter the 6-digit OTP code sent to <strong>${emailParam || "your email"}</strong>.</p>

        <div id="verifyMsg"></div>

        <form id="verifyOtpForm" style="margin-top: 20px; text-align: left;">
          <div class="form-group">
            <label class="form-label" for="verifyEmailInput" style="display:flex; justify-content:space-between; align-items:center;">
              <span>Email Address</span>
              <span style="font-size:0.75rem; color:var(--text-muted); display:inline-flex; align-items:center; gap:4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Locked
              </span>
            </label>
            <input type="email" id="verifyEmailInput" class="form-input" value="${emailParam}" readonly required style="background: #f1f5f9; color: #475569; cursor: not-allowed; border-color: #cbd5e1; font-weight: 500;">
          </div>

          <div class="form-group">
            <label class="form-label" for="verifyOtpInput">6-Digit Verification Code</label>
            <input type="text" id="verifyOtpInput" class="form-input" maxlength="6" pattern="[0-9]{6}" placeholder="123456" required style="letter-spacing: 4px; font-size: 1.25rem; text-align: center; font-weight: 700;">
          </div>

          <button type="submit" id="verifySubmitBtn" class="button" style="width: 100%; margin-top: 10px;">
            Verify Email
          </button>
        </form>

        <div style="margin-top: 18px; display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem;">
          <button id="resendOtpBtn" class="button button-outline" style="font-size: 0.8rem; padding: 5px 12px;">
            Resend OTP
          </button>
          <a href="#/login" style="color: var(--primary); font-weight: 600;">Back to Sign In</a>
        </div>
      </div>
    `;

    document.getElementById("verifyOtpForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("verifyEmailInput")?.value?.trim();
      const otp = document.getElementById("verifyOtpInput")?.value?.trim();
      const msgEl = document.getElementById("verifyMsg");
      const btn = document.getElementById("verifySubmitBtn");

      if (!email || !otp || otp.length !== 6) {
        msgEl.innerHTML = '<div class="alert alert-error">Please enter the 6-digit OTP code.</div>';
        return;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = '<div class="btn-spinner"></div><span>Verifying...</span>';
        const res = await api.verifyEmail({ email, otp });
        const data = await res.json();

        if (res.ok && data.success) {
          msgEl.innerHTML = `<div class="alert alert-success">${data.message || "Email verified successfully!"}</div>`;
          toast.success("Email verified! Signing you in...");
          localStorage.removeItem("raktdal_pending_email");
          await authState.init();
          this.renderNav(authState.getState());
          setTimeout(() => {
            window.location.hash = "#/";
          }, 800);
        } else {
          msgEl.innerHTML = `<div class="alert alert-error">${data.message || "Invalid or expired OTP code."}</div>`;
        }
      } catch (err) {
        msgEl.innerHTML = `<div class="alert alert-error">Network error. Please try again.</div>`;
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Verify Email</span>';
      }
    });

    document.getElementById("resendOtpBtn")?.addEventListener("click", async () => {
      const email = document.getElementById("verifyEmailInput")?.value?.trim();
      const msgEl = document.getElementById("verifyMsg");
      if (!email) {
        msgEl.innerHTML = '<div class="alert alert-error">Please specify your email address.</div>';
        return;
      }
      try {
        toast.info("Resending OTP code...");
        const res = await api.resendOtp({ email });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(data.message || "A fresh OTP code has been sent!");
        } else {
          toast.error(data.message || "Failed to resend OTP.");
        }
      } catch (err) {
        toast.error("Network error.");
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

    this.renderLoader("Loading user profile & account settings...");

    const parseUserAgent = (ua) => {
      if (!ua) return "Web Browser";
      let os = "";
      let browser = "Browser";
      if (/Windows/i.test(ua)) os = "Windows";
      else if (/iPhone/i.test(ua)) os = "iPhone";
      else if (/iPad/i.test(ua)) os = "iPad";
      else if (/Android/i.test(ua)) os = "Android";
      else if (/Macintosh|Mac OS/i.test(ua)) os = "macOS";
      else if (/Linux/i.test(ua)) os = "Linux";

      if (/Edg/i.test(ua)) browser = "Edge";
      else if (/Chrome/i.test(ua)) browser = "Chrome";
      else if (/Firefox/i.test(ua)) browser = "Firefox";
      else if (/Safari/i.test(ua)) browser = "Safari";

      return os ? `${browser} on ${os}` : browser;
    };

    const formatLastActive = (dateStr) => {
      if (!dateStr) return "Recently";
      const d = new Date(dateStr);
      const now = new Date();
      const diffSec = Math.floor((now - d) / 1000);
      if (diffSec < 120) return "Active now";
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    };

    let sessions = [];
    try {
      const res = await api.getSessions();
      if (res.ok) {
        const body = await res.json();
        sessions = (body.data?.sessions || []).slice(0, 5);
      }
    } catch (e) {
      console.warn("Could not retrieve sessions:", e);
    }

    let donorProfile = null;
    try {
      const dRes = await api.getMyDonorProfile();
      if (dRes.ok) {
        const dBody = await dRes.json();
        donorProfile = dBody.data?.donor || null;
      }
    } catch (e) {}

    const initial = (user.fullName || "User").charAt(0).toUpperCase();
    const isEmailVerified = Boolean(user.emailVerifiedAt || user.googleSubject);
    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A";
    const lastSignIn = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "Recently";

    // Profile completion calc
    let completionScore = 50; // baseline email + name
    if (user.phoneNumber) completionScore += 25;
    if (donorProfile) completionScore += 25;

    const isAvailable = donorProfile?.availabilityStatus === "AVAILABLE";

    this.appContainer.innerHTML = `
      <div class="user-profile-dashboard">
        <!-- Sleek Modern Page Header (No bulky hero banner) -->
        <div class="profile-header-strip">
          <div class="profile-header-left">
            <h1 class="profile-page-title">Account &amp; Profile</h1>
            <p class="profile-page-subtitle">Manage personal details, donor status, and security.</p>
          </div>
          <div class="profile-header-actions">
            <nav class="profile-nav-pills" aria-label="Profile Sections">
              <a href="#donorSection" class="profile-nav-pill active">Donation Status</a>
              <a href="#personalSection" class="profile-nav-pill">Personal Details</a>
              <a href="#securitySection" class="profile-nav-pill">Security &amp; Devices</a>
            </nav>
          </div>
        </div>

        <div class="profile-dashboard-grid">
          <!-- Left Column: Compact Mobile-First Summary & Account Activity -->
          <aside class="profile-sidebar-col">
            <div class="profile-card profile-summary-card">
              <!-- Horizontal above the fold on mobile, centered on desktop -->
              <div class="profile-summary-header">
                <div class="profile-avatar-wrapper">
                  ${user.profileImage ? `
                    <img src="${user.profileImage}" class="profile-avatar" alt="${user.fullName}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'profile-avatar profile-avatar-placeholder\\'>${initial}</div>';">
                  ` : `
                    <div class="profile-avatar profile-avatar-placeholder">${initial}</div>
                  `}
                </div>
                <div class="profile-summary-meta">
                  <div class="profile-name-row">
                    <h2 class="profile-user-name">${user.fullName || "User"}</h2>
                    ${user.googleSubject ? `
                      <span class="profile-badge-verified" title="Google Verified Account">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Google
                      </span>
                    ` : (isEmailVerified ? `
                      <span class="profile-badge-verified" title="Verified Account">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Verified
                      </span>
                    ` : "")}
                  </div>
                  <div class="profile-user-email" title="${user.email}">${user.email}</div>
                </div>
              </div>

              <!-- Profile Completion Health Box -->
              <div class="profile-health-box">
                <div class="profile-health-header">
                  <span class="profile-health-title">Profile Completion</span>
                  <span class="profile-health-pct">${completionScore}%</span>
                </div>
                <div class="profile-progress-track">
                  <div class="profile-progress-fill" style="width: ${completionScore}%;"></div>
                </div>
                <div class="profile-health-action">
                  ${!user.phoneNumber ? `
                    <button type="button" id="addPhonePromptBtn" class="link-action-btn">+ Add phone number &rarr;</button>
                  ` : (!donorProfile ? `
                    <a href="#/donor/register" class="link-action-btn">Opt in as donor &rarr;</a>
                  ` : `
                    <span class="text-subtle-success">&#10003; Key information completed</span>
                  `)}
                </div>
              </div>

              <button id="profileEditModalBtn" class="button button-primary profile-edit-btn">
                ${icons.edit(15, "#ffffff")} Edit Profile
              </button>

              <!-- Account Activity (Clean key-value rows) -->
              <div class="profile-activity-list">
                <div class="profile-activity-item">
                  <span class="activity-label">Member Since</span>
                  <span class="activity-value">${memberSince}</span>
                </div>
                <div class="profile-activity-item">
                  <span class="activity-label">Last Sign In</span>
                  <span class="activity-value">${lastSignIn}</span>
                </div>
                <div class="profile-activity-item">
                  <span class="activity-label">Auth Method</span>
                  <span class="activity-value">${user.googleSubject ? "Google Account" : "Password &amp; OTP"}</span>
                </div>
              </div>
            </div>
          </aside>

          <!-- Right Column: Main Functional Sections -->
          <main class="profile-main-col">
            <!-- 1. Donation Profile Card (Primary Functional Card) -->
            <section id="donorSection" class="profile-card profile-section-card">
              <div class="profile-card-header">
                <div class="section-title-group">
                  <div class="section-icon-badge">${icons.bloodDrop(18, "var(--primary)")}</div>
                  <div>
                    <h2 class="profile-card-title">Donation Profile</h2>
                    <p class="section-subtitle">Your volunteer donor status and transfusion readiness.</p>
                  </div>
                </div>
                ${donorProfile ? `
                  <a href="#/donor/dashboard" class="button button-outline button-sm">
                    Open Donor Hub &rarr;
                  </a>
                ` : ""}
              </div>

              ${donorProfile ? `
                <!-- Availability Switch Banner -->
                <div id="donorAvailabilityBanner" class="donor-availability-banner ${isAvailable ? 'is-available' : 'is-unavailable'}">
                  <div class="availability-info">
                    <span class="availability-title">Donor Availability Status</span>
                    <span id="availabilityHint" class="availability-hint">
                      ${isAvailable
                        ? 'You are discoverable for emergency blood requests in your area.'
                        : 'You are currently paused from receiving emergency blood requests.'}
                    </span>
                  </div>
                  <div class="availability-control">
                    <label class="rakt-switch" for="profileAvailabilityToggle" aria-label="Toggle donation availability">
                      <input type="checkbox" id="profileAvailabilityToggle" ${isAvailable ? "checked" : ""}>
                      <span class="rakt-slider"></span>
                    </label>
                    <span id="availabilityBadge" class="status-pill ${isAvailable ? "pill-available" : "pill-unavailable"}">
                      ${isAvailable ? "Available" : "Paused"}
                    </span>
                  </div>
                </div>

                <!-- Flat Quick Stats Grid (No cards inside cards) -->
                <div class="donor-stats-row">
                  <div class="donor-stat-cell">
                    <span class="stat-cell-label">Blood Group</span>
                    <span class="stat-cell-value blood-highlight">${donorProfile.bloodGroup || "—"}</span>
                  </div>
                  <div class="donor-stat-cell">
                    <span class="stat-cell-label">Last Donation</span>
                    <span class="stat-cell-value">${donorProfile.lastDonationDate ? new Date(donorProfile.lastDonationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Never reported"}</span>
                  </div>
                  <div class="donor-stat-cell">
                    <span class="stat-cell-label">Visibility</span>
                    <span class="stat-cell-value">${donorProfile.consents?.discoverable ? "Public Directory" : "Hospital Alerts Only"}</span>
                  </div>
                </div>
              ` : `
                <!-- Unregistered Opt-in Prompt -->
                <div class="donor-enroll-prompt">
                  <div class="enroll-prompt-text">
                    <h3 class="enroll-prompt-title">Opt in as a Voluntary Blood Donor</h3>
                    <p class="enroll-prompt-desc">Receive verified emergency blood requests and help save lives in your city. Quick enrollment, zero obligation.</p>
                  </div>
                  <a href="#/donor/register" class="button button-primary enroll-cta-btn">
                    Enroll Now &rarr;
                  </a>
                </div>
              `}
            </section>

            <!-- 2. Personal Information Section (Flattened Hierarchy) -->
            <section id="personalSection" class="profile-card profile-section-card">
              <div class="profile-card-header">
                <div class="section-title-group">
                  <div class="section-icon-badge">${icons.users(18, "var(--primary)")}</div>
                  <div>
                    <h2 class="profile-card-title">Personal Details</h2>
                    <p class="section-subtitle">Your identity and contact information for emergency coordination.</p>
                  </div>
                </div>
                <button id="personalEditBtn" class="button button-outline button-sm">
                  ${icons.edit(13, "currentColor")} Edit
                </button>
              </div>

              <div class="profile-rows-list">
                <div class="profile-detail-row">
                  <span class="detail-label">Full Name</span>
                  <span class="detail-value">${user.fullName || "—"}</span>
                </div>
                <div class="profile-detail-row">
                  <span class="detail-label">Email Address</span>
                  <span class="detail-value detail-value-email">
                    ${user.email}
                    ${isEmailVerified ? `<span class="verified-check" title="Verified">&#10003;</span>` : ""}
                  </span>
                </div>
                <div class="profile-detail-row">
                  <span class="detail-label">Phone Number</span>
                  <span class="detail-value">
                    ${user.phoneNumber ? user.phoneNumber : `<button type="button" id="addPhoneRowBtn" class="text-button-red">+ Add Phone Number</button>`}
                  </span>
                </div>
                <div class="profile-detail-row">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">
                    ${donorProfile?.location?.city ? `${donorProfile.location.city}${donorProfile.location.state ? ", " + donorProfile.location.state : ""}` : "Pan-India"}
                  </span>
                </div>
                <div class="profile-detail-row">
                  <span class="detail-label">Preferred Language</span>
                  <span class="detail-value">
                    ${user.preferredLanguage === "hi" ? "Hindi (हिंदी)" : user.preferredLanguage === "pa" ? "Punjabi (ਪੰਜਾਬੀ)" : "English"}
                  </span>
                </div>
              </div>
            </section>

            <!-- 3. Security & Active Devices Section (Consolidated) -->
            <section id="securitySection" class="profile-card profile-section-card">
              <div class="profile-card-header">
                <div class="section-title-group">
                  <div class="section-icon-badge">${icons.lock(18, "var(--primary)")}</div>
                  <div>
                    <h2 class="profile-card-title">Security &amp; Devices</h2>
                    <p class="section-subtitle">Manage authenticated sessions and account credentials.</p>
                  </div>
                </div>
                ${sessions.length > 1 ? `
                  <button id="profileSignOutAllBtn" class="button button-outline button-sm btn-danger-outline">
                    Sign out other devices
                  </button>
                ` : ""}
              </div>

              <!-- Active Devices -->
              <div class="sessions-block">
                <div class="subsection-header">
                  <h3 class="subsection-title">Active Device Sessions</h3>
                </div>
                <div class="sessions-list">
                  ${sessions.map((s) => {
                    const deviceName = parseUserAgent(s.userAgent);
                    const activeTime = formatLastActive(s.lastActiveAt);
                    const locationHint = donorProfile?.location?.city ? `${donorProfile.location.city}, IN` : "Active Location";
                    return `
                      <div class="session-item-row ${s.isCurrent ? 'is-current' : ''}">
                        <div class="session-item-main">
                          <div class="session-device-name">
                            ${deviceName}
                            ${s.isCurrent ? `<span class="current-pill">Current Device</span>` : ''}
                          </div>
                          <div class="session-device-meta">
                            ${s.isCurrent ? 'Current Session' : locationHint} &middot; ${s.isCurrent ? 'Active now' : activeTime}
                          </div>
                        </div>
                        <div class="session-item-status">
                          ${s.isCurrent ? `
                            <span class="live-dot-indicator" title="Active on this browser"></span>
                          ` : `
                            <span class="text-subtle-session">Active</span>
                          `}
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>

              <!-- Account Security Action Rows with Right Chevrons -->
              <div class="security-links-block">
                <div class="subsection-header">
                  <h3 class="subsection-title">Account Security</h3>
                </div>
                <div class="settings-action-rows">
                  <div id="openChangePasswordModalBtn" class="settings-action-row" role="button" tabindex="0">
                    <div class="action-row-content">
                      <span class="action-row-title">Password</span>
                      <span class="action-row-sub">Update your account password securely</span>
                    </div>
                    <div class="action-row-chevron">&rsaquo;</div>
                  </div>

                  <a href="#/privacy" class="settings-action-row">
                    <div class="action-row-content">
                      <span class="action-row-title">Privacy &amp; Data Consent</span>
                      <span class="action-row-sub">Review HIPAA and medical data coordination practices</span>
                    </div>
                    <div class="action-row-chevron">&rsaquo;</div>
                  </a>
                </div>
              </div>

              <!-- Single, subtle Sign Out Row at bottom -->
              <div class="profile-signout-row">
                <span class="signout-caption">Sign out of your account on this device</span>
                <button id="profileSignOutBtn" class="button button-outline button-sm btn-danger-outline">
                  Sign Out
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div id="profileEditModal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.55); z-index:9999; backdrop-filter:blur(2px); align-items:center; justify-content:center;">
        <div class="auth-card" style="max-width:480px; width:90%; padding:28px 24px; border-radius:18px; margin:0 auto; text-align:left;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid var(--border); padding-bottom:10px;">
            <h3 style="margin:0; font-size:1.15rem; color:var(--navy); font-weight:800;">Edit Profile Information</h3>
            <button id="closeEditModalBtn" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--text-muted);">&times;</button>
          </div>
          <form id="editProfileForm">
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label" for="editFullName">Full Name</label>
              <input type="text" id="editFullName" class="form-input" value="${user.fullName || ""}" required>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label" for="editPhone">Phone Number</label>
              <input type="tel" id="editPhone" class="form-input" placeholder="e.g. +91 98765 43210" value="${user.phoneNumber || ""}">
            </div>
            <div class="form-group" style="margin-bottom:20px;">
              <label class="form-label" for="editLanguage">Preferred Language</label>
              <select id="editLanguage" class="form-input">
                <option value="en" ${user.preferredLanguage === "en" || !user.preferredLanguage ? "selected" : ""}>English</option>
                <option value="hi" ${user.preferredLanguage === "hi" ? "selected" : ""}>Hindi (हिंदी)</option>
                <option value="pa" ${user.preferredLanguage === "pa" ? "selected" : ""}>Punjabi (ਪੰਜਾਬੀ)</option>
              </select>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px;">
              <button type="button" id="cancelEditModalBtn" class="button button-outline" style="padding:8px 16px;">Cancel</button>
              <button type="submit" id="saveProfileBtn" class="button button-primary" style="padding:8px 20px;">Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Password Modal -->
      <div id="changePasswordModal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.55); z-index:9999; backdrop-filter:blur(2px); align-items:center; justify-content:center;">
        <div class="auth-card" style="max-width:440px; width:90%; padding:28px 24px; border-radius:18px; margin:0 auto; text-align:left;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid var(--border); padding-bottom:10px;">
            <h3 style="margin:0; font-size:1.15rem; color:var(--navy); font-weight:800;">Change Account Password</h3>
            <button id="closeChangePasswordModalBtn" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--text-muted);">&times;</button>
          </div>
          <div id="changePasswordMsg" style="margin-bottom:14px; font-size:0.86rem; display:none;"></div>
          <form id="changePasswordForm">
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label" for="currentPasswordInput">Current Password</label>
              <div class="password-input-wrapper">
                <input type="password" id="currentPasswordInput" class="form-input" placeholder="Enter current password" required>
                <button type="button" id="currentPasswordToggle" class="password-toggle-btn" aria-label="Show password" title="Show password">
                  ${EYE_OPEN_SVG}
                </button>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label" for="newPasswordInput">New Password</label>
              <div class="password-input-wrapper">
                <input type="password" id="newPasswordInput" class="form-input" placeholder="At least 8 characters" minlength="8" required>
                <button type="button" id="newPasswordToggle" class="password-toggle-btn" aria-label="Show password" title="Show password">
                  ${EYE_OPEN_SVG}
                </button>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:20px;">
              <label class="form-label" for="confirmPasswordInput">Confirm New Password</label>
              <div class="password-input-wrapper">
                <input type="password" id="confirmPasswordInput" class="form-input" placeholder="Re-enter new password" minlength="8" required>
                <button type="button" id="confirmPasswordToggle" class="password-toggle-btn" aria-label="Show password" title="Show password">
                  ${EYE_OPEN_SVG}
                </button>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px;">
              <button type="button" id="cancelChangePasswordModalBtn" class="button button-outline" style="padding:8px 16px;">Cancel</button>
              <button type="submit" id="savePasswordBtn" class="button button-primary" style="padding:8px 20px;">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Interactive Donor Availability Toggle Wireup
    const availToggle = document.getElementById("profileAvailabilityToggle");
    availToggle?.addEventListener("change", async (e) => {
      const isChecked = e.target.checked;
      const nextStatus = isChecked ? "AVAILABLE" : "UNAVAILABLE";
      const banner = document.getElementById("donorAvailabilityBanner");
      const badge = document.getElementById("availabilityBadge");
      const hint = document.getElementById("availabilityHint");

      if (badge) {
        badge.textContent = isChecked ? "Available" : "Paused";
        badge.className = `status-pill ${isChecked ? "pill-available" : "pill-unavailable"}`;
      }
      if (banner) {
        banner.className = `donor-availability-banner ${isChecked ? "is-available" : "is-unavailable"}`;
      }
      if (hint) {
        hint.textContent = isChecked
          ? "You are discoverable for emergency blood requests in your area."
          : "You are currently paused from receiving emergency blood requests.";
      }

      try {
        const res = await api.updateDonorAvailability(nextStatus);
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(isChecked ? "Marked as available to donate!" : "Donor availability paused.");
          if (donorProfile) donorProfile.availabilityStatus = nextStatus;
        } else {
          toast.error(data.message || "Failed to update donor availability.");
          // revert UI
          e.target.checked = !isChecked;
          if (badge) {
            badge.textContent = !isChecked ? "Available" : "Paused";
            badge.className = `status-pill ${!isChecked ? "pill-available" : "pill-unavailable"}`;
          }
          if (banner) {
            banner.className = `donor-availability-banner ${!isChecked ? "is-available" : "is-unavailable"}`;
          }
        }
      } catch (err) {
        toast.error(err.message || "Network error updating availability.");
        e.target.checked = !isChecked;
        if (badge) {
          badge.textContent = !isChecked ? "Available" : "Paused";
          badge.className = `status-pill ${!isChecked ? "pill-available" : "pill-unavailable"}`;
        }
        if (banner) {
          banner.className = `donor-availability-banner ${!isChecked ? "is-available" : "is-unavailable"}`;
        }
      }
    });

    // Nav pills smooth scroll
    document.querySelectorAll(".profile-nav-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        const targetId = pill.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            document.querySelectorAll(".profile-nav-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
          }
        }
      });
    });

    // Edit Profile Modal Wireup
    const editModal = document.getElementById("profileEditModal");
    const closeModalBtn = document.getElementById("closeEditModalBtn");
    const cancelModalBtn = document.getElementById("cancelEditModalBtn");
    const editForm = document.getElementById("editProfileForm");

    const openEditModal = () => {
      if (editModal) editModal.style.display = "flex";
    };

    document.getElementById("profileEditModalBtn")?.addEventListener("click", openEditModal);
    document.getElementById("personalEditBtn")?.addEventListener("click", openEditModal);
    document.getElementById("addPhonePromptBtn")?.addEventListener("click", openEditModal);
    document.getElementById("addPhoneRowBtn")?.addEventListener("click", openEditModal);

    const hideModal = () => {
      if (editModal) editModal.style.display = "none";
    };

    closeModalBtn?.addEventListener("click", hideModal);
    cancelModalBtn?.addEventListener("click", hideModal);

    editForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("saveProfileBtn");
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
      }

      const fullName = document.getElementById("editFullName")?.value.trim();
      const phoneNumber = document.getElementById("editPhone")?.value.trim();
      const preferredLanguage = document.getElementById("editLanguage")?.value;

      try {
        const updateRes = await api.updateProfile({
          fullName,
          phoneNumber,
          preferredLanguage
        });
        const updateData = await updateRes.json();
        if (updateRes.ok && updateData.success) {
          toast.success("Profile updated successfully!");
          const updatedUser = updateData.data?.user || {
            ...authState.getState().user,
            fullName,
            phoneNumber,
            preferredLanguage
          };
          authState.setUser(updatedUser);
          hideModal();
          authViews.renderProfile.call(this);
        } else {
          toast.error(updateData.message || "Failed to update profile.");
        }
      } catch (err) {
        toast.error(err.message || "Network error updating profile.");
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Save Changes";
        }
      }
    });

    // Change Password Modal Wireup
    const pwdModal = document.getElementById("changePasswordModal");
    const openPwdModalBtn = document.getElementById("openChangePasswordModalBtn");
    const closePwdModalBtn = document.getElementById("closeChangePasswordModalBtn");
    const cancelPwdModalBtn = document.getElementById("cancelChangePasswordModalBtn");
    const pwdForm = document.getElementById("changePasswordForm");
    const pwdMsg = document.getElementById("changePasswordMsg");

    setupPasswordToggle("currentPasswordInput", "currentPasswordToggle");
    setupPasswordToggle("newPasswordInput", "newPasswordToggle");
    setupPasswordToggle("confirmPasswordInput", "confirmPasswordToggle");

    const hidePwdModal = () => {
      if (pwdModal) pwdModal.style.display = "none";
      if (pwdMsg) {
        pwdMsg.style.display = "none";
        pwdMsg.textContent = "";
      }
      pwdForm?.reset();
    };

    openPwdModalBtn?.addEventListener("click", () => {
      hidePwdModal();
      if (pwdModal) pwdModal.style.display = "flex";
    });

    closePwdModalBtn?.addEventListener("click", hidePwdModal);
    cancelPwdModalBtn?.addEventListener("click", hidePwdModal);

    pwdForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById("currentPasswordInput")?.value;
      const newPassword = document.getElementById("newPasswordInput")?.value;
      const confirmPassword = document.getElementById("confirmPasswordInput")?.value;
      const saveBtn = document.getElementById("savePasswordBtn");

      if (newPassword !== confirmPassword) {
        if (pwdMsg) {
          pwdMsg.textContent = "New passwords do not match.";
          pwdMsg.style.color = "#dc2626";
          pwdMsg.style.display = "block";
        }
        return;
      }

      if (newPassword.length < 8) {
        if (pwdMsg) {
          pwdMsg.textContent = "Password must be at least 8 characters long.";
          pwdMsg.style.color = "#dc2626";
          pwdMsg.style.display = "block";
        }
        return;
      }

      try {
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.textContent = "Updating...";
        }

        const res = await api.changePassword({ currentPassword, newPassword });
        const data = await res.json();

        if (res.ok && data.success) {
          toast.success(data.message || "Password updated successfully.");
          hidePwdModal();
        } else {
          if (pwdMsg) {
            pwdMsg.textContent = data.message || "Failed to update password.";
            pwdMsg.style.color = "#dc2626";
            pwdMsg.style.display = "block";
          }
        }
      } catch (err) {
        if (pwdMsg) {
          pwdMsg.textContent = "Network error. Please try again.";
          pwdMsg.style.color = "#dc2626";
          pwdMsg.style.display = "block";
        }
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Update Password";
        }
      }
    });

    // Sign out handlers
    document.getElementById("profileSignOutBtn")?.addEventListener("click", async () => {
      const confirmed = await toast.confirm({
        title: "Sign Out",
        message: "Are you sure you want to sign out from this device?",
        confirmText: "Sign Out",
        cancelText: "Stay Signed In",
        confirmVariant: "danger"
      });
      if (confirmed) {
        authState.logout();
      }
    });

    const handleSignOutAll = async () => {
      const confirmed = await toast.confirm({
        title: "Sign Out Other Devices",
        message: "Are you sure you want to sign out of all other active device sessions? Your current session will remain active.",
        confirmText: "Sign Out Other Devices",
        cancelText: "Cancel",
        confirmVariant: "danger"
      });
      if (!confirmed) return;

      try {
        const res = await api.logoutAll();
        if (res.ok) {
          toast.success("Other device sessions have been revoked.");
          authViews.renderProfile.call(this);
        } else {
          toast.error("Failed to revoke other sessions.");
        }
      } catch (err) {
        toast.error("Network error revoking sessions.");
      }
    };

    document.getElementById("profileSignOutAllBtn")?.addEventListener("click", handleSignOutAll);
    document.getElementById("logoutAllBtn")?.addEventListener("click", handleSignOutAll);
  }
};
