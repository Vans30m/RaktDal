import { t } from "./i18n/i18n.js";
import { api } from "./api.js";
import { authState } from "./auth.js";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const donorViews = {
  /**
   * 1. Public Donor Discovery & Search Page
   * Route: #/find-blood or #/donors
   */
  async renderDonorSearch(container, params = new URLSearchParams()) {
    const bloodGroup = params.get("bloodGroup") || "";
    const city = params.get("city") || "";
    const pinCode = params.get("pinCode") || "";
    const availabilityStatus = params.get("availabilityStatus") || "";
    const page = parseInt(params.get("page") || "1", 10);

    container.innerHTML = `
      <section class="donor-search-header" style="text-align: center; margin-bottom: 24px;">
        <p class="eyebrow">${t("donor.discoveryEyebrow")}</p>
        <h1 style="font-size: 2rem; margin: 4px 0 8px;">${t("donor.searchTitle")}</h1>
        <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">
          ${t("donor.searchSubtitle")}
        </p>
      </section>

      <!-- Search Controls -->
      <div class="auth-card" style="max-width: 1200px; margin: 0 auto 24px; text-align: left;">
        <form id="donorSearchForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; align-items: end;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="searchBloodGroup">${t("donor.bloodGroupLabel")}</label>
            <select id="searchBloodGroup" class="form-input">
              <option value="">${t("donor.allBloodGroups")}</option>
              ${BLOOD_GROUPS.map((bg) => `<option value="${bg}" ${bloodGroup === bg ? "selected" : ""}>${bg}</option>`).join("")}
            </select>
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="searchCity">${t("donor.cityLabel")}</label>
            <input type="text" id="searchCity" class="form-input" placeholder="${t("donor.cityPlaceholder")}" value="${escapeHtml(city)}">
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="searchPinCode">${t("donor.pinCodeLabel")}</label>
            <input type="text" id="searchPinCode" class="form-input" maxlength="6" placeholder="${t("donor.pinCodePlaceholder")}" value="${escapeHtml(pinCode)}">
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="searchAvailability">${t("donor.availabilityLabel")}</label>
            <select id="searchAvailability" class="form-input">
              <option value="">${t("donor.anyStatus")}</option>
              <option value="AVAILABLE" ${availabilityStatus === "AVAILABLE" ? "selected" : ""}>${t("donor.availableNow")}</option>
              <option value="UNAVAILABLE" ${availabilityStatus === "UNAVAILABLE" ? "selected" : ""}>${t("common.unavailable")}</option>
            </select>
          </div>

          <div style="display: flex; gap: 8px;">
            <button type="submit" class="button" style="flex: 1; height: 42px;">${t("common.search")}</button>
            <button type="button" id="clearSearchBtn" class="button button-outline" style="height: 42px; padding: 0 14px;">${t("common.reset")}</button>
          </div>
        </form>
      </div>

      <!-- Results Container -->
      <div id="donorSearchResults" style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <div class="spinner" style="margin: 0 auto 10px;"></div>
          ${t("donor.searchingDonors")}
        </div>
      </div>
    `;

    // Handle form submit
    const form = document.getElementById("donorSearchForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const bg = document.getElementById("searchBloodGroup").value;
      const c = document.getElementById("searchCity").value.trim();
      const pin = document.getElementById("searchPinCode").value.trim();
      const avail = document.getElementById("searchAvailability").value;

      const q = new URLSearchParams();
      if (bg) q.set("bloodGroup", bg);
      if (c) q.set("city", c);
      if (pin) q.set("pinCode", pin);
      if (avail) q.set("availabilityStatus", avail);
      q.set("page", "1");

      window.location.hash = `#/find-blood?${q.toString()}`;
    });

    document.getElementById("clearSearchBtn").addEventListener("click", () => {
      window.location.hash = "#/find-blood";
    });

    // Execute search
    try {
      const res = await api.searchDonors({
        bloodGroup,
        city,
        pinCode,
        availabilityStatus,
        page,
        limit: 9
      });
      const data = await res.json();

      const resultsEl = document.getElementById("donorSearchResults");
      if (!res.ok) {
        resultsEl.innerHTML = `
          <div class="alert alert-error" style="text-align: center;">
            ${data.message || "Failed to load donors."}
          </div>
        `;
        return;
      }

      const { donors, pagination } = data.data || { donors: [], pagination: {} };

      if (!donors || donors.length === 0) {
        resultsEl.innerHTML = `
          <div class="auth-card" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">🩸</div>
            <h3 style="margin: 0 0 8px;">${t("donor.noDonorsFound")}</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 450px; margin: 0 auto 16px;">
              ${t("donor.noDonorsSub")}
            </p>
            <a href="#/donor/register" class="button button-outline" style="font-size: 0.88rem;">${t("donor.registerAsDonorBtn")}</a>
          </div>
        `;
        return;
      }

      // Render Donor Cards
      resultsEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">
            Found <strong>${pagination.total}</strong> opted-in donor${pagination.total === 1 ? "" : "s"}
          </p>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Self-reported availability · Confirm suitability</span>
        </div>

        <div class="donors-grid">
          ${donors.map((d) => renderDonorCard(d)).join("")}
        </div>

        <!-- Pagination Controls -->
        ${renderPagination(pagination, params)}
      `;

      // Attach pagination click handlers
      resultsEl.querySelectorAll(".pagination-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetPage = btn.getAttribute("data-page");
          const q = new URLSearchParams(params);
          q.set("page", targetPage);
          window.location.hash = `#/find-blood?${q.toString()}`;
        });
      });
    } catch (err) {
      const resultsEl = document.getElementById("donorSearchResults");
      if (resultsEl) {
        resultsEl.innerHTML = `
          <div class="alert alert-error" style="text-align: center;">
            Network error. Unable to fetch donors. Please check connection.
          </div>
        `;
      }
    }
  },

  /**
   * 2. Donor Dashboard & Management Hub
   * Route: #/donor/dashboard
   */
  async renderDonorDashboard(container) {
    container.innerHTML = `
      <div style="max-width: 840px; margin: 0 auto; text-align: left;">
        <div id="donorDashMsg"></div>
        <div id="donorDashContent">
          <div style="text-align:center; padding: 40px;">
            <div class="spinner" style="margin: 0 auto 12px;"></div>
            <p style="color:var(--text-muted);">Loading your donor profile...</p>
          </div>
        </div>
      </div>
    `;

    const contentEl = document.getElementById("donorDashContent");
    const msgEl = document.getElementById("donorDashMsg");

    try {
      const res = await api.getMyDonorProfile();
      const body = await res.json();

      if (res.status === 404) {
        // No profile exists yet -> prompt user to create one
        contentEl.innerHTML = `
          <div class="auth-card" style="text-align: center; padding: 48px 24px;">
            <img src="assets/logo-removebg.png" alt="RaktDal Logo" class="brand-logo" style="width: 48px; height: 48px; margin: 0 auto 16px; display: block; object-fit: contain;">
            <h2>Become a Blood Donor</h2>
            <p class="subtitle" style="max-width: 500px; margin: 0 auto 20px;">
              Join RaktDal's voluntary donor network to help patients in emergency need across India.
            </p>
            <a href="#/donor/register" class="button" style="padding: 10px 24px; font-size: 1rem;">
              Create Donor Profile
            </a>
          </div>
        `;
        return;
      }

      if (!res.ok) {
        msgEl.innerHTML = `<div class="alert alert-error">${body.message || "Failed to load donor profile."}</div>`;
        return;
      }

      const donor = body.data?.donor;
      renderActiveDashboard(contentEl, donor);
    } catch (err) {
      contentEl.innerHTML = `
        <div class="alert alert-error">Failed to connect to server. Please try again.</div>
      `;
    }
  },

  /**
   * 3. Create Donor Profile Form
   * Route: #/donor/register
   */
  async renderCreateProfile(container) {
    // Check if user already has a profile
    try {
      const checkRes = await api.getMyDonorProfile();
      if (checkRes.ok) {
        window.location.hash = "#/donor/dashboard";
        return;
      }
    } catch (e) {
      // Continue to form
    }

    container.innerHTML = `
      <div class="requests-container" style="max-width: 800px; margin: 0 auto; padding: 20px 16px;">
        <section class="donor-search-header" style="text-align: center; margin-bottom: 28px;">
          <p class="eyebrow" style="color: var(--red); font-size: 0.8rem; font-weight: 750; letter-spacing: 0.12em; text-transform: uppercase;">
            ${t("donor.discoveryEyebrow")}
          </p>
          <h1 style="font-size: 2.2rem; margin: 4px 0 8px;">${t("donor.registerTitle")}</h1>
          <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">
            ${t("donor.registerSubtitle")}
          </p>
        </section>

        <div class="auth-card" style="max-width: 800px; margin: 0 auto; text-align: left; padding: 32px 28px;">

        <div id="createDonorMsg"></div>

        <form id="createDonorForm" novalidate>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label" for="donorBloodGroup">Blood Group *</label>
              <select id="donorBloodGroup" class="form-input" required>
                <option value="">Select blood group</option>
                ${BLOOD_GROUPS.map((bg) => `<option value="${bg}">${bg}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="donorAge">${t("donor.ageLabel")} *</label>
              <input type="number" id="donorAge" class="form-input" min="18" max="65" placeholder="e.g. 25" required>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 16px; margin: 8px 0 14px;">
            <h4 style="margin: 0 0 12px; font-size: 0.95rem; color: var(--text-main);">${t("donor.residentialLocation")}</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label" for="donorCity">City *</label>
                <input type="text" id="donorCity" class="form-input" placeholder="e.g. Pune" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="donorDistrict">District *</label>
                <input type="text" id="donorDistrict" class="form-input" placeholder="e.g. Pune" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label" for="donorState">State *</label>
                <input type="text" id="donorState" class="form-input" placeholder="e.g. Maharashtra" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="donorPinCode">PIN Code *</label>
                <input type="text" id="donorPinCode" class="form-input" maxlength="6" placeholder="e.g. 411001" required>
              </div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 16px; margin: 8px 0 14px;">
            <h4 style="margin: 0 0 12px; font-size: 0.95rem; color: var(--text-main);">Availability & History</h4>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label" for="donorAvailability">Availability Status</label>
                <select id="donorAvailability" class="form-input">
                  <option value="AVAILABLE">Available to Donate</option>
                  <option value="UNAVAILABLE">Currently Unavailable</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="donorLastDate">Last Donation Date (Private, Optional)</label>
                <input type="date" id="donorLastDate" class="form-input" max="${new Date().toISOString().split("T")[0]}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="donorContactMethod">Preferred Contact Channel</label>
              <select id="donorContactMethod" class="form-input">
                <option value="IN_APP">In-App Notification (Safest - hides phone/email)</option>
                <option value="EMAIL">Email</option>
                <option value="PHONE">Phone / WhatsApp</option>
              </select>
            </div>
          </div>

          <!-- Independent Consent Management -->
          <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 14px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 8px; font-size: 0.92rem; color: var(--primary);">Consent Preferences</h4>
            
            <label style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; cursor: pointer;">
              <input type="checkbox" id="consentPublicDiscovery" checked style="margin-top: 3px;">
              <span style="font-size: 0.85rem; color: var(--text-main);">
                <strong>Public Donor Discovery:</strong> ${t("donor.consentPublic")}
              </span>
            </label>

            <label style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; cursor: pointer;">
              <input type="checkbox" id="consentNotifications" checked style="margin-top: 3px;">
              <span style="font-size: 0.85rem; color: var(--text-main);">
                <strong>Emergency Notifications:</strong> ${t("donor.consentEmergency")}
              </span>
            </label>

            <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer;">
              <input type="checkbox" id="consentContactSharing" style="margin-top: 3px;">
              <span style="font-size: 0.85rem; color: var(--text-main);">
                <strong>Contact Information Sharing:</strong> ${t("donor.consentContact")}
              </span>
            </label>
          </div>

          <button type="submit" id="createProfileSubmitBtn" class="button" style="width: 100%;">
            <span>${t("donor.completeRegistrationBtn")}</span>
          </button>
        </form>
      </div>
      </div>
    `;

    document.getElementById("createDonorForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msgEl = document.getElementById("createDonorMsg");
      const btn = document.getElementById("createProfileSubmitBtn");

      const payload = {
        bloodGroup: document.getElementById("donorBloodGroup").value,
        age: parseInt(document.getElementById("donorAge").value, 10),
        location: {
          city: document.getElementById("donorCity").value.trim(),
          district: document.getElementById("donorDistrict").value.trim(),
          state: document.getElementById("donorState").value.trim(),
          pinCode: document.getElementById("donorPinCode").value.trim()
        },
        availabilityStatus: document.getElementById("donorAvailability").value,
        lastDonationDate: document.getElementById("donorLastDate").value || null,
        preferredContactMethod: document.getElementById("donorContactMethod").value,
        publicDiscoveryConsent: document.getElementById("consentPublicDiscovery").checked,
        notificationConsent: document.getElementById("consentNotifications").checked,
        contactSharingConsent: document.getElementById("consentContactSharing").checked
      };

      if (!payload.bloodGroup || !payload.age || !payload.location.city || !payload.location.pinCode) {
        msgEl.innerHTML = `<div class="alert alert-error">Please fill in all required fields marked with *.</div>`;
        return;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = `<div class="btn-spinner"></div><span>Saving Profile...</span>`;

        const res = await api.createDonorProfile(payload);
        const data = await res.json();

        if (res.ok) {
          msgEl.innerHTML = `<div class="alert alert-success">${data.message || "Profile created successfully!"}</div>`;
          setTimeout(() => {
            window.location.hash = "#/donor/dashboard";
          }, 1000);
        } else {
          msgEl.innerHTML = `<div class="alert alert-error">${data.message || "Failed to create donor profile."}</div>`;
        }
      } catch (err) {
        msgEl.innerHTML = `<div class="alert alert-error">Network error. Please try again.</div>`;
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<span>Complete Donor Registration</span>`;
      }
    });
  },

  /**
   * 4. Edit Donor Profile Form
   * Route: #/donor/edit
   */
  async renderEditProfile(container) {
    container.innerHTML = `
      <div class="requests-container" style="max-width: 800px; margin: 0 auto; padding: 20px 16px;">
        <section class="donor-search-header" style="text-align: center; margin-bottom: 28px;">
          <p class="eyebrow" style="color: var(--red); font-size: 0.8rem; font-weight: 750; letter-spacing: 0.12em; text-transform: uppercase;">
            ${t("donor.discoveryEyebrow")}
          </p>
          <h1 style="font-size: 2.2rem; margin: 4px 0 8px;">${t("donor.editProfileTitle")}</h1>
          <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">
            ${t("donor.editProfileSubtitle")}
          </p>
        </section>

        <div class="auth-card" style="max-width: 800px; margin: 0 auto; text-align: left; padding: 32px 28px;">
          <div id="editDonorMsg"></div>
          <div id="editDonorFormContainer">
            <div style="text-align:center; padding:30px;"><div class="spinner"></div></div>
          </div>
        </div>
      </div>
    `;

    try {
      const res = await api.getMyDonorProfile();
      const body = await res.json();
      const formContainer = document.getElementById("editDonorFormContainer");

      if (!res.ok || !body.data?.donor) {
        window.location.hash = "#/donor/register";
        return;
      }

      const d = body.data.donor;
      const formattedDate = d.lastDonationDate ? new Date(d.lastDonationDate).toISOString().split("T")[0] : "";

      formContainer.innerHTML = `
        <form id="editDonorForm" novalidate>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label" for="editBloodGroup">Blood Group</label>
              <select id="editBloodGroup" class="form-input" required>
                ${BLOOD_GROUPS.map((bg) => `<option value="${bg}" ${d.bloodGroup === bg ? "selected" : ""}>${bg}</option>`).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="editAge">Age (18 - 65)</label>
              <input type="number" id="editAge" class="form-input" min="18" max="65" value="${d.age}" required>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 16px; margin: 8px 0 14px;">
            <h4 style="margin: 0 0 12px; font-size: 0.95rem; color: var(--text-main);">Residential Location</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label" for="editCity">City</label>
                <input type="text" id="editCity" class="form-input" value="${escapeHtml(d.location.city)}" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="editDistrict">District</label>
                <input type="text" id="editDistrict" class="form-input" value="${escapeHtml(d.location.district)}" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label" for="editState">State</label>
                <input type="text" id="editState" class="form-input" value="${escapeHtml(d.location.state)}" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="editPinCode">PIN Code</label>
                <input type="text" id="editPinCode" class="form-input" maxlength="6" value="${escapeHtml(d.location.pinCode)}" required>
              </div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 16px; margin: 8px 0 14px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label" for="editContactMethod">Preferred Contact</label>
                <select id="editContactMethod" class="form-input">
                  <option value="IN_APP" ${d.preferredContactMethod === "IN_APP" ? "selected" : ""}>In-App</option>
                  <option value="EMAIL" ${d.preferredContactMethod === "EMAIL" ? "selected" : ""}>Email</option>
                  <option value="PHONE" ${d.preferredContactMethod === "PHONE" ? "selected" : ""}>Phone</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="editLastDate">Last Donation Date (Private)</label>
                <input type="date" id="editLastDate" class="form-input" value="${formattedDate}" max="${new Date().toISOString().split("T")[0]}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="editProfileStatus">Profile Status</label>
              <select id="editProfileStatus" class="form-input">
                <option value="ACTIVE" ${d.profileStatus === "ACTIVE" ? "selected" : ""}>Active (Visible in searches)</option>
                <option value="INACTIVE" ${d.profileStatus === "INACTIVE" ? "selected" : ""}>Inactive (Hidden from searches)</option>
              </select>
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="submit" id="editSubmitBtn" class="button" style="flex: 1;">Save Changes</button>
            <a href="#/donor/dashboard" class="button button-outline">Cancel</a>
          </div>
        </form>
      `;

      document.getElementById("editDonorForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const msgEl = document.getElementById("editDonorMsg");
        const btn = document.getElementById("editSubmitBtn");

        const payload = {
          bloodGroup: document.getElementById("editBloodGroup").value,
          age: parseInt(document.getElementById("editAge").value, 10),
          location: {
            city: document.getElementById("editCity").value.trim(),
            district: document.getElementById("editDistrict").value.trim(),
            state: document.getElementById("editState").value.trim(),
            pinCode: document.getElementById("editPinCode").value.trim()
          },
          preferredContactMethod: document.getElementById("editContactMethod").value,
          lastDonationDate: document.getElementById("editLastDate").value || null,
          profileStatus: document.getElementById("editProfileStatus").value
        };

        try {
          btn.disabled = true;
          btn.innerHTML = `<div class="btn-spinner"></div><span>Saving...</span>`;

          const updateRes = await api.updateMyDonorProfile(payload);
          const updateData = await updateRes.json();

          if (updateRes.ok) {
            msgEl.innerHTML = `<div class="alert alert-success">${updateData.message || "Profile updated!"}</div>`;
            setTimeout(() => {
              window.location.hash = "#/donor/dashboard";
            }, 800);
          } else {
            msgEl.innerHTML = `<div class="alert alert-error">${updateData.message || "Update failed."}</div>`;
          }
        } catch (err) {
          msgEl.innerHTML = `<div class="alert alert-error">Network error.</div>`;
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<span>${t("common.save")}</span>`;
        }
      });
    } catch (e) {
      container.innerHTML = `<div class="alert alert-error">Could not load profile to edit.</div>`;
    }
  },

  /**
   * 5. Donor Availability Settings
   * Route: #/donor/availability
   */
  async renderAvailabilitySettings(container) {
    container.innerHTML = `
      <div class="auth-card" style="max-width: 540px; text-align: left;">
        <h2 style="margin: 0 0 8px;">${t("donor.availabilityStatus")}</h2>
        <p class="subtitle">Quickly toggle whether you can respond to urgent donation calls.</p>
        
        <div id="availMsg"></div>

        <div id="availFormContent">
          <div style="text-align:center; padding: 20px;"><div class="spinner"></div></div>
        </div>
      </div>
    `;

    try {
      const res = await api.getMyDonorProfile();
      const body = await res.json();
      const content = document.getElementById("availFormContent");

      if (!res.ok || !body.data?.donor) {
        window.location.hash = "#/donor/register";
        return;
      }

      const d = body.data.donor;
      const isAvailable = d.availabilityStatus === "AVAILABLE";

      content.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 18px; margin: 16px 0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight: 700; font-size: 1.1rem; color: ${isAvailable ? "var(--success)" : "var(--text-muted)"}">
                ${isAvailable ? "● AVAILABLE TO DONATE" : "○ CURRENTLY UNAVAILABLE"}
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 6px 0 0;">
                ${isAvailable ? "You appear in search results as ready to donate." : "You are hidden from emergency matching until you re-enable availability."}
              </p>
            </div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; margin-top: 20px;">
          <button id="toggleAvailBtn" class="button ${isAvailable ? "button-outline" : ""}" style="width: 100%;">
            ${isAvailable ? "Set Status to UNAVAILABLE" : "Set Status to AVAILABLE"}
          </button>
          <a href="#/donor/dashboard" class="button button-outline" style="text-align:center;">Back to Dashboard</a>
        </div>
      `;

      document.getElementById("toggleAvailBtn").addEventListener("click", async () => {
        const nextStatus = isAvailable ? "UNAVAILABLE" : "AVAILABLE";
        const btn = document.getElementById("toggleAvailBtn");
        const msgEl = document.getElementById("availMsg");

        try {
          btn.disabled = true;
          const patchRes = await api.updateDonorAvailability(nextStatus);
          const patchData = await patchRes.json();

          if (patchRes.ok) {
            msgEl.innerHTML = `<div class="alert alert-success">${patchData.message}</div>`;
            setTimeout(() => {
              donorViews.renderAvailabilitySettings(container);
            }, 600);
          } else {
            msgEl.innerHTML = `<div class="alert alert-error">${patchData.message || "Failed to update."}</div>`;
            btn.disabled = false;
          }
        } catch (e) {
          msgEl.innerHTML = `<div class="alert alert-error">Network error.</div>`;
          btn.disabled = false;
        }
      });
    } catch (e) {
      container.innerHTML = `<div class="alert alert-error">Could not load availability settings.</div>`;
    }
  },

  /**
   * 6. Donor Consent Management Page
   * Route: #/donor/consent
   */
  async renderConsentSettings(container) {
    container.innerHTML = `
      <div class="auth-card" style="max-width: 600px; text-align: left;">
        <h2 style="margin: 0 0 8px;">${t("donor.privacySettings")}</h2>
        <p class="subtitle">Control exactly how and where your information is used. Changes are strictly logged for your protection.</p>
        
        <div id="consentSettingsMsg"></div>

        <div id="consentFormContent">
          <div style="text-align:center; padding: 24px;"><div class="spinner"></div></div>
        </div>
      </div>
    `;

    try {
      const res = await api.getMyDonorProfile();
      const body = await res.json();
      const content = document.getElementById("consentFormContent");

      if (!res.ok || !body.data?.donor) {
        window.location.hash = "#/donor/register";
        return;
      }

      const d = body.data.donor;

      content.innerHTML = `
        <form id="consentSettingsForm">
          <div style="display:flex; flex-direction:column; gap:16px; margin: 18px 0 24px;">
            
            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:14px;">
              <label style="display:flex; gap:12px; cursor:pointer;">
                <input type="checkbox" id="settingPublicDiscovery" ${d.publicDiscoveryConsent ? "checked" : ""} style="margin-top:4px;">
                <div>
                  <div style="font-weight:600; font-size:0.95rem;">Public Donor Discovery</div>
                  <div style="font-size:0.83rem; color:var(--text-muted); margin-top:2px;">
                    When enabled, patients and hospital coordinators can discover your blood group and city in public directory searches.
                  </div>
                </div>
              </label>
            </div>

            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:14px;">
              <label style="display:flex; gap:12px; cursor:pointer;">
                <input type="checkbox" id="settingNotificationConsent" ${d.notificationConsent ? "checked" : ""} style="margin-top:4px;">
                <div>
                  <div style="font-weight:600; font-size:0.95rem;">Urgent Donation Notifications</div>
                  <div style="font-size:0.83rem; color:var(--text-muted); margin-top:2px;">
                    Receive alerts when emergency requests matching your blood group are submitted within your city.
                  </div>
                </div>
              </label>
            </div>

            <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:14px;">
              <label style="display:flex; gap:12px; cursor:pointer;">
                <input type="checkbox" id="settingContactSharing" ${d.contactSharingConsent ? "checked" : ""} style="margin-top:4px;">
                <div>
                  <div style="font-weight:600; font-size:0.95rem;">Contact Information Sharing</div>
                  <div style="font-size:0.83rem; color:var(--text-muted); margin-top:2px;">
                    Expose your preferred contact details directly on public donor cards. (Keep disabled for highest privacy).
                  </div>
                </div>
              </label>
            </div>

          </div>

          <div style="display:flex; gap:10px;">
            <button type="submit" id="saveConsentBtn" class="button" style="flex:1;">Save Privacy Consents</button>
            <a href="#/donor/dashboard" class="button button-outline">Cancel</a>
          </div>
        </form>
      `;

      document.getElementById("consentSettingsForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const msgEl = document.getElementById("consentSettingsMsg");
        const btn = document.getElementById("saveConsentBtn");

        const consents = {
          publicDiscoveryConsent: document.getElementById("settingPublicDiscovery").checked,
          notificationConsent: document.getElementById("settingNotificationConsent").checked,
          contactSharingConsent: document.getElementById("settingContactSharing").checked
        };

        try {
          btn.disabled = true;
          btn.innerHTML = `<div class="btn-spinner"></div><span>Updating...</span>`;

          const patchRes = await api.updateDonorConsent(consents);
          const patchData = await patchRes.json();

          if (patchRes.ok) {
            msgEl.innerHTML = `<div class="alert alert-success">${patchData.message}</div>`;
            setTimeout(() => {
              window.location.hash = "#/donor/dashboard";
            }, 800);
          } else {
            msgEl.innerHTML = `<div class="alert alert-error">${patchData.message || "Update failed."}</div>`;
          }
        } catch (e) {
          msgEl.innerHTML = `<div class="alert alert-error">Network error.</div>`;
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<span>Save Privacy Consents</span>`;
        }
      });
    } catch (e) {
      container.innerHTML = `<div class="alert alert-error">Could not load consent settings.</div>`;
    }
  }
};

/**
 * Helper: Renders public donor card for discovery
 */
function renderDonorCard(d) {
  const isAvailable = d.availabilityStatus === "AVAILABLE";
  const name = d.donor?.fullName || "Volunteer Donor";
  const initial = name.charAt(0).toUpperCase();

  return `
    <div class="donor-card">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div style="display: flex; gap: 10px; align-items: center;">
            ${
              d.donor?.profileImage
                ? `<img src="${d.donor.profileImage}" style="width: 40px; height: 40px; border-radius: 50%;" alt="">`
                : `<div class="user-nav-avatar" style="width: 40px; height: 40px; font-size: 1rem;">${initial}</div>`
            }
            <div>
              <div style="font-weight: 600; font-size: 0.95rem;">${escapeHtml(name)}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${d.age} yrs · ${d.location.city}</div>
            </div>
          </div>

          <span style="font-size: 1.25rem; font-weight: 800; color: var(--primary); background: #fee2e2; padding: 4px 10px; border-radius: 6px;">
            ${d.bloodGroup}
          </span>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.5;">
          <div>📍 ${escapeHtml(d.location.district)}, ${escapeHtml(d.location.state)} (${d.location.pinCode})</div>
          <div>📞 Preferred: ${d.preferredContactMethod}</div>
          ${d.donor?.email ? `<div style="color:var(--text-main);">✉️ ${escapeHtml(d.donor.email)}</div>` : ""}
          ${d.donor?.phoneNumber ? `<div style="color:var(--text-main);">📱 ${escapeHtml(d.donor.phoneNumber)}</div>` : ""}
        </div>
      </div>

      <div style="border-top: 1px solid var(--border); padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
        <span class="badge ${isAvailable ? "badge-active" : ""}" style="font-size: 0.75rem;">
          ${isAvailable ? "● Available" : "Unavailable"}
        </span>

        <span style="font-size: 0.75rem; color: var(--text-muted);">
          Joined ${new Date(d.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  `;
}

/**
 * Helper: Renders active donor dashboard details
 */
function renderActiveDashboard(container, donor) {
  const isAvailable = donor.availabilityStatus === "AVAILABLE";
  const user = authState.getState().user || donor.user || {};

  container.innerHTML = `
    <!-- Top Hero Card -->
    <div class="auth-card" style="padding: 24px; margin-bottom: 20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; gap:16px; align-items:center;">
          <div style="font-size: 2.2rem; font-weight: 800; color: white; background: var(--primary); width: 68px; height: 68px; border-radius: 12px; display:flex; align-items:center; justify-content:center;">
            ${donor.bloodGroup}
          </div>
          <div>
            <h2 style="margin: 0 0 4px; font-size: 1.35rem;">${escapeHtml(user.fullName || "Donor")}</h2>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">
              ${donor.age} yrs · ${donor.location.city}, ${donor.location.state} (${donor.location.pinCode})
            </p>
          </div>
        </div>

        <div style="display:flex; gap:8px;">
          <span class="badge ${isAvailable ? "badge-active" : ""}" style="font-size: 0.85rem; padding: 6px 12px;">
            ${isAvailable ? "● Available to Donate" : "○ Currently Unavailable"}
          </span>
          <span class="badge ${donor.publicDiscoveryConsent ? "badge-active" : ""}" style="font-size: 0.85rem; padding: 6px 12px;">
            ${donor.publicDiscoveryConsent ? "Publicly Discoverable" : "Hidden"}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Action Navigation Tiles -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 24px;">
      <a href="#/donor/availability" class="auth-card" style="padding: 16px; text-decoration:none; color:inherit; border:1px solid var(--border); transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 6px;">⏱️</div>
        <div style="font-weight: 700; margin-bottom: 4px;">Availability Toggle</div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">Quickly switch between Available and Unavailable status.</div>
      </a>

      <a href="#/donor/consent" class="auth-card" style="padding: 16px; text-decoration:none; color:inherit; border:1px solid var(--border); transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 6px;">🛡️</div>
        <div style="font-weight: 700; margin-bottom: 4px;">Privacy & Consents</div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">Manage public discovery, notifications, and contact sharing.</div>
      </a>

      <a href="#/donor/edit" class="auth-card" style="padding: 16px; text-decoration:none; color:inherit; border:1px solid var(--border); transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 6px;">✏️</div>
        <div style="font-weight: 700; margin-bottom: 4px;">Edit Profile</div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">Update residential location, age, and preferred channel.</div>
      </a>
    </div>

    <!-- Detailed Profile View -->
    <div class="auth-card" style="padding: 20px;">
      <h3 style="margin: 0 0 16px; font-size: 1.05rem; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
        Profile & Privacy Summary
      </h3>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; font-size: 0.88rem;">
        <div>
          <span style="color:var(--text-muted);">Blood Group:</span>
          <div style="font-weight:600; font-size:1.1rem; color:var(--primary);">${donor.bloodGroup}</div>
        </div>

        <div>
          <span style="color:var(--text-muted);">Location:</span>
          <div style="font-weight:600;">${escapeHtml(donor.location.city)}, ${escapeHtml(donor.location.district)}</div>
          <div style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(donor.location.state)} · ${donor.location.pinCode}</div>
        </div>

        <div>
          <span style="color:var(--text-muted);">Contact Preference:</span>
          <div style="font-weight:600;">${donor.preferredContactMethod}</div>
          <div style="color:var(--text-muted); font-size:0.8rem;">
            Contact Sharing: ${donor.contactSharingConsent ? "Enabled" : "Disabled (Protected)"}
          </div>
        </div>

        <div>
          <span style="color:var(--text-muted);">Last Donation Date:</span>
          <div style="font-weight:600;">
            ${donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : "Not specified"}
          </div>
          <div style="color:var(--text-muted); font-size:0.78rem;">🔒 Private to you only</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Helper: Pagination buttons
 */
function renderPagination(pagination, currentParams) {
  if (!pagination || pagination.totalPages <= 1) return "";

  const page = pagination.page;
  const total = pagination.totalPages;

  return `
    <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 24px;">
      <button class="button button-outline pagination-btn" data-page="${page - 1}" ${!pagination.hasPrevPage ? "disabled" : ""} style="padding: 6px 14px;">
        Previous
      </button>

      <span style="font-size: 0.88rem; color: var(--text-muted);">
        Page ${page} of ${total}
      </span>

      <button class="button button-outline pagination-btn" data-page="${page + 1}" ${!pagination.hasNextPage ? "disabled" : ""} style="padding: 6px 14px;">
        Next
      </button>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

