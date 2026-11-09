import { icons } from "./icons.js";
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
        <p class="eyebrow">Direct Volunteer Coordination</p>
        <h1 style="font-size: 2rem; margin: 4px 0 8px;">Find Opted-In Blood Donors</h1>
        <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">
          Search active, voluntary blood donors by blood group, city, or 6-digit postal PIN code.
        </p>
      </section>

      <!-- Search Controls -->
      <div class="auth-card" style="max-width: 1200px; margin: 0 auto 24px; text-align: left;">
        <form id="donorSearchForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; align-items: end;">
          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="searchBloodGroup">Blood Group</label>
            <select id="searchBloodGroup" class="form-input">
              <option value="">All Blood Groups</option>
              ${BLOOD_GROUPS.map((bg) => `<option value="${bg}" ${bloodGroup === bg ? "selected" : ""}>${bg}</option>`).join("")}
            </select>
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="searchCity">City</label>
            <input type="text" id="searchCity" class="form-input" placeholder="e.g. Mumbai, Delhi" value="${escapeHtml(city)}">
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="searchPinCode">PIN Code</label>
            <input type="text" id="searchPinCode" class="form-input" maxlength="6" placeholder="6-digit PIN" value="${escapeHtml(pinCode)}">
          </div>

          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="searchAvailability">Availability</label>
            <select id="searchAvailability" class="form-input">
              <option value="">Any Status</option>
              <option value="AVAILABLE" ${availabilityStatus === "AVAILABLE" ? "selected" : ""}>Available Now</option>
              <option value="UNAVAILABLE" ${availabilityStatus === "UNAVAILABLE" ? "selected" : ""}>Unavailable</option>
            </select>
          </div>

          <div style="display: flex; gap: 8px;">
            <button type="submit" class="button" style="flex: 1; height: 42px;">Search</button>
            <button type="button" id="clearSearchBtn" class="button button-outline" style="height: 42px; padding: 0 14px;">Reset</button>
          </div>
        </form>
      </div>

      <!-- Results Container -->
      <div id="donorSearchResults" style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <div class="spinner" style="margin: 0 auto 10px;"></div>
          Searching active donors...
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
            <h3 style="margin: 0 0 8px;">No matching donors found</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 450px; margin: 0 auto 16px;">
              Try broadening your search criteria or searching for nearby cities and PIN codes.
            </p>
            <a href="#/donor/register" class="button button-outline" style="font-size: 0.88rem;">Register as a Donor</a>
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

      // Attach In-App Alert handlers
      resultsEl.querySelectorAll(".send-donor-alert-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const state = authState.getState();
          if (!state.isAuthenticated) {
            window.location.hash = "#/login?error=auth_required";
            return;
          }

          const donorId = btn.getAttribute("data-id");
          const donorName = btn.getAttribute("data-name");
          const donorBg = btn.getAttribute("data-bg");
          const donorCity = btn.getAttribute("data-city");

          openDonorAlertModal(donorId, donorName, donorBg, donorCity);
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
            Direct Volunteer Coordination
          </p>
          <h1 style="font-size: 2.2rem; margin: 4px 0 8px;">Register as a Blood Donor</h1>
          <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">
            Help save lives in your community by joining the voluntary donor network.
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
              <label class="form-label" for="donorAge">Age (18 - 65) *</label>
              <input type="number" id="donorAge" class="form-input" min="18" max="65" placeholder="e.g. 25" required>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 16px; margin: 8px 0 14px;">
            <h4 style="margin: 0 0 12px; font-size: 0.95rem; color: var(--text-main);">Residential Location</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group" style="position:relative;">
                <label class="form-label" for="donorCity">City *</label>
                <input type="text" id="donorCity" class="form-input" placeholder="e.g. Pune, Chandigarh" autocomplete="off" required>
                <div id="donorCitySuggestions" style="position:absolute; top:100%; left:0; right:0; background:#fff; border:1px solid var(--border); border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.1); max-height:180px; overflow-y:auto; z-index:99; display:none;"></div>
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
                <strong>Public Donor Discovery:</strong> Allow verified requesters to discover your blood group and city in search results.
              </span>
            </label>

            <label style="display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; cursor: pointer;">
              <input type="checkbox" id="consentNotifications" checked style="margin-top: 3px;">
              <span style="font-size: 0.85rem; color: var(--text-main);">
                <strong>Emergency Notifications:</strong> Receive urgent blood donation alerts when patients in your area need your blood group.
              </span>
            </label>

            <label style="display: flex; gap: 10px; align-items: flex-start; cursor: pointer;">
              <input type="checkbox" id="consentContactSharing" style="margin-top: 3px;">
              <span style="font-size: 0.85rem; color: var(--text-main);">
                <strong>Contact Information Sharing:</strong> Share selected contact info directly on search cards. (Unchecked by default for privacy).
              </span>
            </label>
          </div>

          <button type="submit" id="createProfileSubmitBtn" class="button" style="width: 100%;">
            <span>Complete Donor Registration</span>
          </button>
        </form>
      </div>
      </div>
    `;

    // Setup City / PIN Code Auto-lookup
    const donorCityInput = document.getElementById("donorCity");
    const donorDistrictInput = document.getElementById("donorDistrict");
    const donorStateInput = document.getElementById("donorState");
    const donorPinInput = document.getElementById("donorPinCode");
    const donorCitySuggs = document.getElementById("donorCitySuggestions");

    let donorCityDebounce = null;
    if (donorCityInput) {
      donorCityInput.addEventListener("input", () => {
        clearTimeout(donorCityDebounce);
        const query = donorCityInput.value.trim();
        if (query.length < 3) {
          if (donorCitySuggs) donorCitySuggs.style.display = "none";
          return;
        }

        donorCityDebounce = setTimeout(async () => {
          try {
            const res = await api.lookupCity(query);
            const data = await res.json();
            if (data.success && data.data && data.data.length > 0) {
              donorCitySuggs.innerHTML = data.data.map(item => `
                <div class="donor-city-opt" style="padding:10px 14px; cursor:pointer; font-size:0.85rem; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;"
                  data-city="${item.city || query}"
                  data-district="${item.district}"
                  data-state="${item.state}"
                  data-pin="${item.pinCode}">
                  <div>
                    <div style="font-weight:600; color:#1e293b;">${item.name || item.city}</div>
                    <div style="font-size:0.75rem; color:#64748b;">${item.district ? item.district + ', ' : ''}${item.state}</div>
                  </div>
                  <div style="font-size:0.82rem; font-weight:500; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:4px;">
                    ${item.pinCode}
                  </div>
                </div>
              `).join("");
              donorCitySuggs.style.display = "block";

              donorCitySuggs.querySelectorAll(".donor-city-opt").forEach(el => {
                el.addEventListener("mouseenter", () => { el.style.background = "#f8fafc"; });
                el.addEventListener("mouseleave", () => { el.style.background = "#fff"; });
                el.addEventListener("click", () => {
                  donorCityInput.value = el.getAttribute("data-city");
                  donorDistrictInput.value = el.getAttribute("data-district") || "";
                  donorStateInput.value = el.getAttribute("data-state") || "";
                  donorPinInput.value = el.getAttribute("data-pin") || "";
                  donorCitySuggs.style.display = "none";
                });
              });
            } else {
              donorCitySuggs.style.display = "none";
            }
          } catch (e) {
            donorCitySuggs.style.display = "none";
          }
        }, 300);
      });

      document.addEventListener("click", (e) => {
        if (!donorCityInput.contains(e.target) && !donorCitySuggs.contains(e.target)) {
          donorCitySuggs.style.display = "none";
        }
      });
    }

    if (donorPinInput) {
      donorPinInput.addEventListener("input", async () => {
        const pin = donorPinInput.value.trim();
        if (/^\d{6}$/.test(pin)) {
          try {
            const res = await api.lookupPinCode(pin);
            const data = await res.json();
            if (data.success && data.data) {
              if (data.data.state && !donorStateInput.value) donorStateInput.value = data.data.state;
              if (data.data.district && !donorDistrictInput.value) donorDistrictInput.value = data.data.district;
              if (data.data.city && !donorCityInput.value) donorCityInput.value = data.data.city;
            }
          } catch (e) {}
        }
      });
    }

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
            Direct Volunteer Coordination
          </p>
          <h1 style="font-size: 2.2rem; margin: 4px 0 8px;">Edit Donor Profile</h1>
          <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">
            Update your location and donation details.
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
          btn.innerHTML = `<span>Save</span>`;
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
        <h2 style="margin: 0 0 8px;">Availability Status</h2>
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
        <h2 style="margin: 0 0 8px;">Privacy & Consent Settings</h2>
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
          <div>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg> ${escapeHtml(d.location.district)}, ${escapeHtml(d.location.state)} (${d.location.pinCode})</div>
          <div>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg> Preferred: ${d.preferredContactMethod}</div>
          ${d.donor?.email ? `<div style="color:var(--text-main);">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg> ${escapeHtml(d.donor.email)}</div>` : ""}
          ${d.donor?.phoneNumber ? `<div style="color:var(--text-main);">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg> ${escapeHtml(d.donor.phoneNumber)}</div>` : ""}
        </div>
      </div>

      <div style="border-top: 1px solid var(--border); padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
        <span class="badge ${isAvailable ? "badge-active" : ""}" style="font-size: 0.75rem;">
          ${isAvailable ? "● Available" : "Unavailable"}
        </span>

        ${isAvailable ? `
          <button class="button button-outline send-donor-alert-btn" data-id="${d.id || d._id}" data-name="${escapeHtml(name)}" data-bg="${d.bloodGroup}" data-city="${escapeHtml(d.location.city)}" style="font-size: 0.78rem; padding: 4px 10px; display: inline-flex; align-items: center; gap: 4px;">
            🔔 In-App Alert
          </button>
        ` : `
          <span style="font-size: 0.75rem; color: var(--text-muted);">
            Joined ${new Date(d.createdAt).toLocaleDateString()}
          </span>
        `}
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
          <div style="font-size: 2.2rem; font-weight: 800; color: white; background: var(--primary); width: 68px; height: 68px; border-radius: 12px; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 12px rgba(220,38,38,0.25);">
            ${donor.bloodGroup}
          </div>
          <div>
            <h2 style="margin: 0 0 4px; font-size: 1.4rem; color: var(--text-main); font-weight: 800;">${escapeHtml(user.fullName || "Donor")}</h2>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">
              ${donor.age} yrs · ${escapeHtml(donor.location.city)}, ${escapeHtml(donor.location.state)} (${donor.location.pinCode})
            </p>
          </div>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <span class="badge ${isAvailable ? "badge-active" : ""}" style="font-size: 0.82rem; padding: 6px 14px; font-weight: 600;">
            ${isAvailable ? "● AVAILABLE TO DONATE" : "○ CURRENTLY UNAVAILABLE"}
          </span>
          <span class="badge ${donor.publicDiscoveryConsent ? "badge-active" : ""}" style="font-size: 0.82rem; padding: 6px 14px; font-weight: 600;">
            ${donor.publicDiscoveryConsent ? "PUBLICLY DISCOVERABLE" : "HIDDEN FROM SEARCH"}
          </span>
        </div>
      </div>
    </div>

    <!-- Quick Action Navigation Tiles in Clean 3-Column Grid -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
      <a href="#/donor/edit" class="auth-card" style="padding: 20px; text-decoration:none; color:inherit; border:1px solid var(--border); border-radius: 12px; display:flex; flex-direction:column; align-items:center; text-align:center; transition: all 0.2s ease;">
        <div style="font-size: 2rem; margin-bottom: 10px;">✏️</div>
        <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px; color: var(--text-main);">Edit Profile</div>
        <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">Update city, state, pin code, age, and preferred channel.</div>
      </a>

      <a href="#/donor/availability" class="auth-card" style="padding: 20px; text-decoration:none; color:inherit; border:1px solid var(--border); border-radius: 12px; display:flex; flex-direction:column; align-items:center; text-align:center; transition: all 0.2s ease;">
        <div style="font-size: 2rem; margin-bottom: 10px;">⏱️</div>
        <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px; color: var(--text-main);">Availability Toggle</div>
        <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">Instantly switch between Available and Unavailable status.</div>
      </a>

      <a href="#/donor/consent" class="auth-card" style="padding: 20px; text-decoration:none; color:inherit; border:1px solid var(--border); border-radius: 12px; display:flex; flex-direction:column; align-items:center; text-align:center; transition: all 0.2s ease;">
        <div style="font-size: 2rem; margin-bottom: 10px;">🛡️</div>
        <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px; color: var(--text-main);">Privacy & Consents</div>
        <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">Manage public directory visibility and notification rules.</div>
      </a>
    </div>

    <!-- Detailed Profile View -->
    <div class="auth-card" style="padding: 24px; border-radius: 12px;">
      <h3 style="margin: 0 0 18px; font-size: 1.1rem; border-bottom: 1px solid var(--border); padding-bottom: 12px; color: var(--text-main); font-weight: 700;">
        Profile & Privacy Summary
      </h3>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; font-size: 0.9rem;">
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Blood Group</span>
          <div style="font-weight:700; font-size:1.2rem; color:var(--primary); margin-top:2px;">${donor.bloodGroup}</div>
        </div>

        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Location</span>
          <div style="font-weight:600; margin-top:2px;">${escapeHtml(donor.location.city)}, ${escapeHtml(donor.location.district)}</div>
          <div style="color:var(--text-muted); font-size:0.82rem;">${escapeHtml(donor.location.state)} · ${donor.location.pinCode}</div>
        </div>

        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Contact Preference</span>
          <div style="font-weight:600; margin-top:2px;">${donor.preferredContactMethod}</div>
          <div style="color:var(--text-muted); font-size:0.82rem;">
            Sharing: ${donor.contactSharingConsent ? "Enabled (Public)" : "Protected (In-App only)"}
          </div>
        </div>

        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Last Donation Date</span>
          <div style="font-weight:600; margin-top:2px;">
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

function openDonorAlertModal(donorId, donorName, donorBg, donorCity) {
  let modal = document.getElementById("donorAlertModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "donorAlertModal";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-backdrop" id="alertModalBackdrop" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:9999;">
      <div class="modal-content auth-card" onclick="event.stopPropagation()" style="max-width:480px; width:90%; padding:24px; text-align:left; background:#fff; border-radius:12px;">
        <h3 style="margin:0 0 6px 0; font-size:1.25rem;">🔔 Send In-App Alert to ${donorName}</h3>
        <p style="color:var(--text-muted); font-size:0.88rem; margin:0 0 16px 0;">
          This will trigger an urgent in-app notification directly into the donor's alert center.
        </p>

        <form id="sendDonorAlertForm" style="display:flex; flex-direction:column; gap:12px;">
          <div>
            <label class="form-label" for="alertHospital" style="font-size:0.85rem; font-weight:600;">Hospital / Facility *</label>
            <input type="text" id="alertHospital" class="form-input" placeholder="e.g. AIIMS Delhi" required style="width:100%;">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label class="form-label" for="alertBloodGroup" style="font-size:0.85rem; font-weight:600;">Blood Group</label>
              <input type="text" id="alertBloodGroup" class="form-input" value="${donorBg}" readonly style="width:100%; background:#f1f5f9;">
            </div>
            <div>
              <label class="form-label" for="alertContact" style="font-size:0.85rem; font-weight:600;">Your Phone / Contact *</label>
              <input type="text" id="alertContact" class="form-input" placeholder="e.g. 9876543210" required style="width:100%;">
            </div>
          </div>

          <div>
            <label class="form-label" for="alertMessage" style="font-size:0.85rem; font-weight:600;">Requirement Note</label>
            <textarea id="alertMessage" class="form-input" placeholder="Briefly specify patient condition or ward..." style="width:100%; height:65px;"></textarea>
          </div>

          <div id="alertModalMsg" style="font-size:0.85rem; display:none;"></div>

          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
            <button type="button" id="closeAlertModalBtn" class="button button-outline" style="font-size:0.86rem; padding:6px 14px;">Cancel</button>
            <button type="submit" id="submitAlertModalBtn" class="button" style="font-size:0.86rem; padding:6px 16px;">Send Emergency Alert</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const close = () => { modal.innerHTML = ""; };
  document.getElementById("closeAlertModalBtn")?.addEventListener("click", close);
  document.getElementById("alertModalBackdrop")?.addEventListener("click", close);

  document.getElementById("sendDonorAlertForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById("alertModalMsg");
    const submitBtn = document.getElementById("submitAlertModalBtn");

    if (msgEl) msgEl.style.display = "none";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    try {
      const payload = {
        hospitalName: document.getElementById("alertHospital")?.value?.trim(),
        bloodGroup: donorBg,
        city: donorCity,
        contactNumber: document.getElementById("alertContact")?.value?.trim(),
        message: document.getElementById("alertMessage")?.value?.trim()
      };

      const res = await api.sendDonorAlert(donorId, payload);
      const data = await res.json();

      if (res.status === 401) {
        window.location.hash = "#/login?error=auth_required";
        close();
        return;
      }

      if (res.ok && data.success) {
        alert(data.message || "Alert sent to donor!");
        close();
      } else {
        throw new Error(data.message || "Failed to dispatch alert.");
      }
    } catch (err) {
      if (msgEl) {
        msgEl.textContent = err.message;
        msgEl.style.color = "#dc2626";
        msgEl.style.display = "block";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Emergency Alert";
      }
    }
  });
}

