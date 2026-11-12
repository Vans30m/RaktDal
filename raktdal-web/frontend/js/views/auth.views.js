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
            <label class="form-label" for="verifyEmailInput">Email Address</label>
            <input type="email" id="verifyEmailInput" class="form-input" value="${emailParam}" required>
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
    let completionScore = 40; // baseline email + name
    if (user.phoneNumber) completionScore += 20;
    if (user.preferredLanguage) completionScore += 10;
    if (donorProfile) completionScore += 30;

    this.appContainer.innerHTML = `
      <div class="find-donors-hero-section">
        <div class="find-donors-hero-inner">
          <div class="find-donors-hero-text">
            <div class="find-donors-badge">
              <span class="find-donors-badge-dot" aria-hidden="true"></span>
              <span>ACCOUNT &amp; IDENTITY DASHBOARD</span>
            </div>
            <h1 class="find-donors-hero-title">
              User <span class="accent-text">Profile</span>
            </h1>
            <p class="find-donors-hero-sub">
              Manage personal identity, verified credentials, security settings, and active device sessions.
            </p>
          </div>
        </div>
      </div>

      <div class="user-profile-dashboard">
        <div class="profile-dashboard-grid">
          <!-- Left Column: User Summary & Identity Card -->
          <div>
            <div class="profile-card" style="text-align: center;">
              ${user.profileImage ? `
                <img src="${user.profileImage}" class="profile-avatar-img" alt="${user.fullName}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'profile-avatar-large\\'>${initial}</div>';">
              ` : `
                <div class="profile-avatar-large">${initial}</div>
              `}
              <h2 style="margin: 0 0 4px; font-size: 1.35rem; color: var(--navy); font-weight: 800;">${user.fullName}</h2>
              <p style="margin: 0 0 14px; font-size: 0.88rem; color: var(--text-muted); word-break: break-all;">${user.email}</p>

              <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:6px; margin-bottom: 20px;">
                <span class="badge ${user.accountStatus === "ACTIVE" ? "badge-active" : ""}" style="font-size:0.75rem;">
                  ${user.accountStatus || "ACTIVE"}
                </span>
                ${user.googleSubject ? `
                  <span class="badge badge-active" style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg> Google Verified
                  </span>
                ` : ""}
                ${(user.platformRoles || ["USER"]).map((r) => `
                  <span class="badge" style="background:#eaf4ff; color:#0369a1; font-weight:700; font-size:0.75rem;">${r}</span>
                `).join("")}
              </div>

              <!-- Profile Completion Indicator -->
              <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; text-align: left; margin-bottom: 20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                  <span style="font-size: 0.78rem; font-weight: 700; color: var(--navy);">Profile Health</span>
                  <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary);">${completionScore}%</span>
                </div>
                <div style="background: #e2e8f0; height: 6px; border-radius: 9999px; overflow: hidden;">
                  <div style="background: var(--primary); height: 100%; width: ${completionScore}%; border-radius: 9999px;"></div>
                </div>
                <div style="font-size: 0.73rem; color: var(--text-muted); margin-top: 6px;">
                  ${completionScore === 100 ? "Profile fully completed &amp; verified." : "Complete phone &amp; donor history to reach 100%."}
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button id="profileEditModalBtn" class="button button-primary" style="width: 100%; border-radius: 10px; font-size: 0.88rem; padding: 10px;">
                  ${icons.edit(15, "#ffffff")} Edit Profile
                </button>
                <button id="profileSignOutBtn" class="button button-outline" style="width: 100%; border-radius: 10px; font-size: 0.88rem; padding: 9px;">
                  Sign Out (This Device)
                </button>
              </div>
            </div>

            <!-- Account Activity Card -->
            <div class="profile-card">
              <div class="profile-card-header">
                <h3 class="profile-card-title">
                  ${icons.auditLog(16, "var(--primary)")} Account Activity
                </h3>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted); display:flex; flex-direction:column; gap: 10px;">
                <div>
                  <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px;">Member Since</div>
                  <div style="color: var(--navy); font-weight: 600;">${memberSince}</div>
                </div>
                <div>
                  <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px;">Last Sign In</div>
                  <div style="color: var(--navy); font-weight: 600;">${lastSignIn}</div>
                </div>
                <div>
                  <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px;">Authentication Mode</div>
                  <div style="color: var(--navy); font-weight: 600;">${user.googleSubject ? "Google Account" : "Password &amp; OTP Authentication"}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Personal Info, Donor Profile, Verification & Security -->
          <div>
            <!-- Section 1: Personal Information -->
            <div class="profile-card">
              <div class="profile-card-header">
                <h3 class="profile-card-title">
                  ${icons.users(18, "var(--primary)")} Personal Information
                </h3>
                <span class="badge" style="background:#fcebec; color:var(--primary); font-size:0.75rem;">VERIFIED RECORD</span>
              </div>
              <div class="profile-info-grid">
                <div class="profile-info-item">
                  <div class="profile-info-label">${icons.users(13, "var(--text-muted)")} Full Name</div>
                  <div class="profile-info-value">${user.fullName || "—"}</div>
                </div>
                <div class="profile-info-item">
                  <div class="profile-info-label">${icons.mail(13, "var(--text-muted)")} Email Address</div>
                  <div class="profile-info-value">${user.email}</div>
                </div>
                <div class="profile-info-item">
                  <div class="profile-info-label">${icons.phone(13, "var(--text-muted)")} Phone Number</div>
                  <div class="profile-info-value">${user.phoneNumber || "Not provided"}</div>
                </div>
                <div class="profile-info-item">
                  <div class="profile-info-label">${icons.bloodDrop(13, "var(--primary)")} Blood Group</div>
                  <div class="profile-info-value" style="color: var(--primary); font-weight:750;">
                    ${donorProfile ? donorProfile.bloodGroup : "Not registered"}
                  </div>
                </div>
                <div class="profile-info-item">
                  <div class="profile-info-label">${icons.mapPin(13, "var(--text-muted)")} Location</div>
                  <div class="profile-info-value">
                    ${donorProfile?.location?.city ? `${donorProfile.location.city}, ${donorProfile.location.state || "IN"}` : "Pan-India"}
                  </div>
                </div>
                <div class="profile-info-item">
                  <div class="profile-info-label">${icons.shieldCheck(13, "var(--text-muted)")} Preferred Language</div>
                  <div class="profile-info-value" style="text-transform: capitalize;">
                    ${user.preferredLanguage || "English"}
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2: Blood Donation Profile (If registered or prompted) -->
            <div class="profile-card" style="border-left: 4px solid var(--primary);">
              <div class="profile-card-header">
                <h3 class="profile-card-title">
                  ${icons.bloodDrop(18, "var(--primary)")} Donation Profile
                </h3>
                ${donorProfile ? `
                  <a href="#/donor/dashboard" class="button button-outline" style="padding: 4px 12px; font-size: 0.8rem; border-radius: 9999px;">
                    Open Donor Hub
                  </a>
                ` : `
                  <a href="#/donor/register" class="button button-primary" style="padding: 4px 12px; font-size: 0.8rem; border-radius: 9999px;">
                    Register as Donor
                  </a>
                `}
              </div>
              ${donorProfile ? `
                <div class="profile-info-grid">
                  <div class="profile-info-item">
                    <div class="profile-info-label">Blood Group</div>
                    <div class="profile-info-value" style="color:var(--primary); font-size:1.15rem; font-weight:800;">${donorProfile.bloodGroup}</div>
                  </div>
                  <div class="profile-info-item">
                    <div class="profile-info-label">Availability Status</div>
                    <div class="profile-info-value" style="color: #00a477; font-weight:700;">
                      ● ${donorProfile.availabilityStatus || "AVAILABLE"}
                    </div>
                  </div>
                  <div class="profile-info-item">
                    <div class="profile-info-label">Last Donation</div>
                    <div class="profile-info-value">
                      ${donorProfile.lastDonationDate ? new Date(donorProfile.lastDonationDate).toLocaleDateString() : "Never reported"}
                    </div>
                  </div>
                  <div class="profile-info-item">
                    <div class="profile-info-label">Discovery Mode</div>
                    <div class="profile-info-value">
                      ${donorProfile.consents?.discoverable ? "Public in Directory" : "Private / Hospital Alert Only"}
                    </div>
                  </div>
                </div>
              ` : `
                <div style="background:#fff7f7; border:1px solid #fee2e2; border-radius:12px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                  <div>
                    <div style="font-weight:700; color:var(--navy); font-size:0.92rem; margin-bottom:2px;">Opt in as a Voluntary Blood Donor</div>
                    <div style="font-size:0.82rem; color:var(--text-muted);">Receive verified emergency blood requests and help save lives in your city.</div>
                  </div>
                  <a href="#/donor/register" class="button button-primary" style="font-size:0.85rem; padding:7px 16px; border-radius:9999px;">
                    Enroll Now
                  </a>
                </div>
              `}
            </div>

            <!-- Section 3: Account Verification -->
            <div class="profile-card">
              <div class="profile-card-header">
                <h3 class="profile-card-title">
                  ${icons.shieldCheck(18, "#00a477")} Account Verification
                </h3>
              </div>
              <div style="display:flex; flex-direction:column; gap:10px;">
                <div class="profile-session-card" style="margin-bottom:0; ${isEmailVerified ? "background:#ecfdf3; border-color:#a7f3d0;" : ""}">
                  <div style="display:flex; align-items:center; gap:12px;">
                    <div style="color: ${isEmailVerified ? "#00a477" : "#e58a00"};">
                      ${isEmailVerified ? icons.checkCircle(20, "#00a477") : icons.alertTriangle(20, "#e58a00")}
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size:0.9rem; color: var(--navy);">Email Address Verification</div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">${user.email} · ${isEmailVerified ? "Confirmed verified identity" : "Pending confirmation"}</div>
                    </div>
                  </div>
                  <span class="badge ${isEmailVerified ? "badge-active" : ""}" style="font-size:0.75rem;">
                    ${isEmailVerified ? "VERIFIED" : "PENDING"}
                  </span>
                </div>
              </div>
            </div>

            <!-- Section 4: Active Sessions & Device Management -->
            <div class="profile-card">
              <div class="profile-card-header">
                <h3 class="profile-card-title">
                  ${icons.lock(18, "var(--primary)")} Active Sessions (${sessions.length})
                </h3>
                ${sessions.length > 1 ? `
                  <button id="profileSignOutAllBtn" class="button button-outline" style="border-color:#fca5a5; color:#dc2626; font-size:0.8rem; padding: 4px 12px; border-radius:9999px;">
                    Logout All Other Devices
                  </button>
                ` : ""}
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${sessions.map((s) => `
                  <div class="profile-session-card ${s.isCurrent ? "current" : ""}">
                    <div>
                      <div style="font-weight: 700; color: var(--navy); font-size: 0.88rem; display:flex; align-items:center; gap:6px;">
                        ${s.isCurrent ? "★ This Device (Current Browser)" : "Other Device / Browser Session"}
                      </div>
                      <div style="color: var(--text-muted); font-size: 0.76rem; margin-top: 2px;">
                        IP: ${s.ipAddress} · Last Active: ${new Date(s.lastActiveAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      ${s.isCurrent ? `
                        <span class="badge badge-active" style="font-size:0.74rem;">CURRENT</span>
                      ` : `
                        <span class="badge" style="background:#f1f5f9; color:var(--text-muted); font-size:0.74rem;">ACTIVE</span>
                      `}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Section 5: Account & Security Settings -->
            <div class="profile-card">
              <div class="profile-card-header">
                <h3 class="profile-card-title">
                  ${icons.lock(18, "var(--navy)")} Account &amp; Security Settings
                </h3>
              </div>
              <div>
                <div class="profile-security-row">
                  <div>
                    <div style="font-weight: 700; color: var(--navy); font-size: 0.9rem;">Change Password</div>
                    <div style="color: var(--text-muted); font-size: 0.78rem;">Update your account password with your current credentials.</div>
                  </div>
                  <button id="openChangePasswordModalBtn" class="button button-outline" style="font-size: 0.82rem; padding: 6px 14px; border-radius: 8px;">
                    Change Password
                  </button>
                </div>

                <div class="profile-security-row">
                  <div>
                    <div style="font-weight: 700; color: var(--navy); font-size: 0.9rem;">Privacy &amp; Data Consent</div>
                    <div style="color: var(--text-muted); font-size: 0.78rem;">Review HIPAA and national blood coordination privacy practices.</div>
                  </div>
                  <a href="#/privacy" class="button button-outline" style="font-size: 0.82rem; padding: 6px 14px; border-radius: 8px;">
                    Review Policy
                  </a>
                </div>

                <div class="profile-security-row" style="border-color: #fee2e2; background: #fff7f7;">
                  <div>
                    <div style="font-weight: 700; color: #dc2626; font-size: 0.9rem;">Sign Out All Sessions</div>
                    <div style="color: var(--text-muted); font-size: 0.78rem;">Revoke all authentication refresh tokens across all browsers immediately.</div>
                  </div>
                  <button id="logoutAllBtn" class="button button-outline" style="font-size: 0.82rem; padding: 6px 14px; border-radius: 8px; border-color:#fca5a5; color:#dc2626;">
                    Sign Out All
                  </button>
                </div>
              </div>
            </div>
          </div>
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
              <input type="password" id="currentPasswordInput" class="form-input" placeholder="Enter current password" required>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label class="form-label" for="newPasswordInput">New Password</label>
              <input type="password" id="newPasswordInput" class="form-input" placeholder="At least 8 characters" minlength="8" required>
            </div>
            <div class="form-group" style="margin-bottom:20px;">
              <label class="form-label" for="confirmPasswordInput">Confirm New Password</label>
              <input type="password" id="confirmPasswordInput" class="form-input" placeholder="Re-enter new password" minlength="8" required>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:10px;">
              <button type="button" id="cancelChangePasswordModalBtn" class="button button-outline" style="padding:8px 16px;">Cancel</button>
              <button type="submit" id="savePasswordBtn" class="button button-primary" style="padding:8px 20px;">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Edit Profile Modal Wireup
    const editModal = document.getElementById("profileEditModal");
    const openModalBtn = document.getElementById("profileEditModalBtn");
    const closeModalBtn = document.getElementById("closeEditModalBtn");
    const cancelModalBtn = document.getElementById("cancelEditModalBtn");
    const editForm = document.getElementById("editProfileForm");

    openModalBtn?.addEventListener("click", () => {
      if (editModal) editModal.style.display = "flex";
    });

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
    document.getElementById("profileSignOutBtn")?.addEventListener("click", () => {
      authState.logout();
    });

    const handleSignOutAll = async () => {
      if (!confirm("Are you sure you want to sign out from all devices? You will need to log back in.")) {
        return;
      }
      try {
        await api.logoutAll();
      } catch (err) {}
      await authState.logout();
    };

    document.getElementById("profileSignOutAllBtn")?.addEventListener("click", handleSignOutAll);
    document.getElementById("logoutAllBtn")?.addEventListener("click", handleSignOutAll);
  }
};
