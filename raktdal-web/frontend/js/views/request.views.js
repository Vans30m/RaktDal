import { api } from "../api.js";
import { authState } from "../auth.js";
import { toast } from "../toast.js";
import { icons } from "../icons.js";

export const requestViews = {
async renderBloodRequests(params) {
    this.renderLoader("Fetching active blood requests...");
    try {
      const city = params.get("city") || "";
      const bloodGroup = params.get("bloodGroup") || "";
      const urgency = params.get("urgency") || "";
      const statusFilter = params.get("status") || "";

      const queryObj = {};
      if (city) queryObj.city = city;
      if (bloodGroup) queryObj.bloodGroup = bloodGroup;
      if (urgency) queryObj.urgency = urgency;
      if (statusFilter) queryObj.status = statusFilter;

      const res = await api.getBloodRequests(queryObj);
      const data = await res.json();
      const requests = (data.success && data.data && data.data.requests) ? data.data.requests : [];
      const state = authState.getState();

      this.appContainer.innerHTML = `
        <div class="find-donors-hero-section">
          <div class="find-donors-hero-inner">
            <div class="find-donors-hero-text">
              <div class="find-donors-badge">
                <span>EMERGENCY &amp; SCHEDULED REQUIREMENTS</span>
              </div>
              <h1 class="find-donors-hero-title">
                Blood <span class="accent-text">Requests</span>
              </h1>
              <p class="find-donors-hero-sub">
                Browse emergency and scheduled blood requirements across verified hospitals and healthcare centers.
              </p>
              <div style="display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; margin-top:14px;">
                <a href="#/requests/my" class="button button-outline" style="padding: 7px 18px; font-size: 0.88rem; border-radius: 9999px;">
                  My Requests
                </a>
                <a href="#/requests/create" class="button" style="padding: 7px 20px; font-size: 0.88rem; border-radius: 9999px;">
                  + Create Request
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="find-donors-body-wrapper" style="padding-top: 24px;">
          <div class="find-donors-search-card" style="padding: 16px 20px; margin-bottom: 22px; border-radius: 14px;">
            <div class="find-donors-search-form request-filter-responsive-form">
              <div class="form-group" style="margin:0;">
                <label class="form-label" for="filterBloodGroup" style="font-size:0.75rem; font-weight:700; margin-bottom:4px; display:block; color:var(--navy);">Blood Group</label>
                <select id="filterBloodGroup" class="form-input" style="height:38px; font-size:0.86rem; padding: 0 10px; width:100%;">
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

              <div class="form-group" style="margin:0;">
                <label class="form-label" for="filterCity" style="font-size:0.75rem; font-weight:700; margin-bottom:4px; display:block; color:var(--navy);">City</label>
                <input type="text" id="filterCity" class="form-input" style="height:38px; font-size:0.86rem; padding: 0 10px; width:100%;" placeholder="e.g. Delhi, Mumbai" value="${city}">
              </div>

              <div class="form-group" style="margin:0;">
                <label class="form-label" for="filterUrgency" style="font-size:0.75rem; font-weight:700; margin-bottom:4px; display:block; color:var(--navy);">Urgency</label>
                <select id="filterUrgency" class="form-input" style="height:38px; font-size:0.86rem; padding: 0 10px; width:100%;">
                  <option value="">All Urgencies</option>
                  <option value="CRITICAL" ${urgency === "CRITICAL" ? "selected" : ""}>Critical</option>
                  <option value="HIGH" ${urgency === "HIGH" ? "selected" : ""}>High</option>
                  <option value="MEDIUM" ${urgency === "MEDIUM" ? "selected" : ""}>Medium</option>
                  <option value="LOW" ${urgency === "LOW" ? "selected" : ""}>Low</option>
                </select>
              </div>

              <div class="find-donors-btn-group" style="gap:8px;">
                <button id="applyFiltersBtn" class="find-donors-search-btn" style="height:38px; font-size:0.86rem;">Filter</button>
                <button id="resetFiltersBtn" class="find-donors-reset-btn" style="height:38px; font-size:0.86rem; padding: 0 14px;">Reset</button>
              </div>
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
                      
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
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
  },

  renderCreateBloodRequest() {
    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width:680px; text-align:left;">
        <h2 style="margin:0 0 6px 0;">Create Blood Request</h2>
        <p class="subtitle" style="margin-bottom:24px;">
          Submit a new requirement for urgent or planned transfusion needs. All requests are verified for safety.
        </p>

        <form id="createRequestForm" style="display:flex; flex-direction:column; gap:16px;">
          <div class="responsive-form-row">
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

          <div class="responsive-form-row">
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

          <div class="responsive-form-row-3">
            <div style="position:relative;">
              <label class="filter-label" for="reqCity">City *</label>
              <input type="text" id="reqCity" class="filter-input" style="width:100%; margin-top:4px;" placeholder="e.g. Chandigarh, Delhi" autocomplete="off" required>
              <div id="citySuggestions" style="position:absolute; top:100%; left:0; right:0; background:#fff; border:1px solid var(--border, #cbd5e1); border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.1); max-height:200px; overflow-y:auto; z-index:99; display:none;"></div>
            </div>
            <div>
              <label class="filter-label" for="reqState">State *</label>
              <input type="text" id="reqState" class="filter-input" style="width:100%; margin-top:4px;" placeholder="State" required>
            </div>
            <div>
              <label class="filter-label" for="reqPin">Pin Code *</label>
              <input type="text" id="reqPin" class="filter-input" style="width:100%; margin-top:4px;" placeholder="6-digit PIN" maxlength="6" required>
            </div>
          </div>

          <div class="responsive-form-row">
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

    // Location API: Auto-fetch State & PIN Code on City or PIN Code input
    const cityInput = document.getElementById("reqCity");
    const stateInput = document.getElementById("reqState");
    const pinInput = document.getElementById("reqPin");
    const suggestionsBox = document.getElementById("citySuggestions");

    let debounceTimer = null;

    if (cityInput) {
      cityInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        const query = cityInput.value.trim();
        if (query.length < 3) {
          if (suggestionsBox) suggestionsBox.style.display = "none";
          return;
        }

        debounceTimer = setTimeout(async () => {
          try {
            const res = await api.lookupCity(query);
            const data = await res.json();
            if (data.success && data.data && data.data.length > 0) {
              suggestionsBox.innerHTML = data.data.map(item => `
                <div class="city-option" style="padding:10px 14px; cursor:pointer; font-size:0.88rem; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;"
                  data-city="${item.city || query}"
                  data-state="${item.state}"
                  data-district="${item.district}"
                  data-pin="${item.pinCode}">
                  <div>
                    <div style="font-weight:600; color:#1e293b;">${item.name || item.city}</div>
                    <div style="font-size:0.78rem; color:#64748b;">${item.district ? item.district + ', ' : ''}${item.state}</div>
                  </div>
                  <div style="font-size:0.85rem; font-weight:500; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:4px;">
                    ${item.pinCode}
                  </div>
                </div>
              `).join("");
              suggestionsBox.style.display = "block";

              suggestionsBox.querySelectorAll(".city-option").forEach(el => {
                el.addEventListener("mouseenter", () => { el.style.background = "#f8fafc"; });
                el.addEventListener("mouseleave", () => { el.style.background = "#fff"; });
                el.addEventListener("click", () => {
                  cityInput.value = el.getAttribute("data-city");
                  stateInput.value = el.getAttribute("data-state") || "";
                  pinInput.value = el.getAttribute("data-pin") || "";
                  suggestionsBox.style.display = "none";
                });
              });
            } else {
              suggestionsBox.style.display = "none";
            }
          } catch (err) {
            suggestionsBox.style.display = "none";
          }
        }, 250);
      });

      document.addEventListener("click", (e) => {
        if (!cityInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
          suggestionsBox.style.display = "none";
        }
      });
    }

    if (pinInput) {
      pinInput.addEventListener("input", async () => {
        const pin = pinInput.value.trim();
        if (/^\d{6}$/.test(pin)) {
          try {
            const res = await api.lookupPinCode(pin);
            const data = await res.json();
            if (data.success && data.data) {
              if (data.data.state && !stateInput.value) stateInput.value = data.data.state;
              if (data.data.city && !cityInput.value) cityInput.value = data.data.city;
            }
          } catch (e) {}
        }
      });
    }

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
          const createdReq = data.data?.request || data.data;
          const reqId = createdReq?._id || createdReq?.id;
          if (reqId) {
            window.location.hash = `#/requests/${reqId}`;
          } else {
            window.location.hash = `#/requests`;
          }
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
  },

  async renderBloodRequestDetail(requestId) {
    this.renderLoader("Loading request details...");
    try {
      const res = await api.getBloodRequestById(requestId);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Blood request not found");
      }

      const r = data.data?.request || data.data;
      const state = authState.getState();
      const currentUserId = state.user?.id || state.user?._id;
      const creatorId = r.createdByUserId?._id || r.createdByUserId;
      const isOwner = currentUserId && creatorId && String(currentUserId) === String(creatorId);

      // Check if current user has already submitted a donation offer
      let myExistingResponse = null;
      let incomingResponses = [];

      if (isOwner) {
        try {
          const respRes = await api.getRequestResponses(requestId);
          if (respRes.ok) {
            const respData = await respRes.json();
            incomingResponses = respData.data?.responses || [];
          }
        } catch (e) {
          console.warn("Could not load incoming responses", e);
        }
      } else if (state.isAuthenticated) {
        // Find if user already submitted an offer
        try {
          const respRes = await api.getRequestResponses(requestId);
          if (respRes.ok) {
            const respData = await respRes.json();
            const list = respData.data?.responses || [];
            myExistingResponse = list.find(resItem => {
              const resUserId = resItem.donorUserId?._id || resItem.donorUserId;
              return String(resUserId) === String(currentUserId) && resItem.status !== "WITHDRAWN";
            });
          }
        } catch (e) {
          // If 403, we check if user has local confirmation or we handle in error
        }
      }

      this.appContainer.innerHTML = `
        <div class="requests-container" style="max-width:840px;">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${r.location?.city || "Unknown"}, ${r.location?.state || ""} — Pin: ${r.location?.pinCode || "N/A"}</span>
            </div>

            <div class="request-details-grid request-details-grid-responsive" style="margin-bottom:24px;">
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

            ${isOwner ? `
              <!-- Requester Panel: Incoming Donor Offers -->
              <div style="margin-top:24px; border-top:1px solid var(--border); padding-top:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                  <h3 style="margin:0; font-size:1.15rem; display:flex; align-items:center; gap:8px;">
                    <span>📥 Incoming Donor Offers</span>
                    <span class="badge ${incomingResponses.length > 0 ? "badge-active" : ""}" style="font-size:0.8rem;">
                      ${incomingResponses.length} Offer${incomingResponses.length === 1 ? "" : "s"}
                    </span>
                  </h3>
                </div>

                ${incomingResponses.length === 0 ? `
                  <div style="background:#f8fafc; border:1px dashed var(--border); border-radius:8px; padding:18px; text-align:center; color:var(--text-muted); font-size:0.88rem;">
                    No donors have submitted donation offers yet. Matching donors in your city will be notified.
                  </div>
                ` : `
                  <div style="display:flex; flex-direction:column; gap:12px;">
                    ${incomingResponses.map(resp => {
                      const donorName = resp.sharedContactInfo?.fullName || resp.donorUserId?.fullName || "Volunteer Donor";
                      const donorPhone = resp.sharedContactInfo?.phone || "";
                      const donorEmail = resp.sharedContactInfo?.email || "";
                      return `
                        <div style="background:#ffffff; border:1px solid var(--border); border-left:4px solid var(--primary); border-radius:8px; padding:14px;">
                          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
                            <div>
                              <div style="font-weight:700; font-size:1rem; color:var(--text-main);">${donorName}</div>
                              <div style="font-size:0.86rem; color:var(--primary); font-weight:600; margin-top:2px;">
                                🩸 Offered ${resp.unitsOffered} Unit(s)
                              </div>
                            </div>
                            <span class="badge badge-active" style="font-size:0.75rem;">Status: ${resp.status}</span>
                          </div>

                          ${resp.notes ? `
                            <div style="margin:10px 0; font-size:0.88rem; background:#f8fafc; padding:8px 12px; border-radius:6px; color:#334155;">
                              "${resp.notes}"
                            </div>
                          ` : ""}

                          <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:16px; font-size:0.85rem; color:var(--text-muted);">
                            ${donorPhone ? `
                              <div style="display:flex; align-items:center; gap:6px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <a href="tel:${donorPhone}" style="color:var(--primary); font-weight:600; text-decoration:none;">${donorPhone}</a>
                              </div>
                            ` : `<span style="font-size:0.8rem; color:var(--text-muted);">(Phone not shared)</span>`}

                            ${donorEmail ? `
                              <div style="display:flex; align-items:center; gap:6px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <a href="mailto:${donorEmail}" style="color:var(--text-main); text-decoration:none;">${donorEmail}</a>
                              </div>
                            ` : ""}
                          </div>

                          <div style="margin-top:12px; display:flex; gap:8px; justify-content:flex-end;">
                            ${donorPhone ? `
                              <a href="tel:${donorPhone}" class="button" style="padding:5px 12px; font-size:0.82rem; background:#16a34a; border-color:#16a34a;">
                                📞 Call Donor
                              </a>
                            ` : ""}
                            ${donorEmail ? `
                              <a href="mailto:${donorEmail}?subject=Blood%20Donation%20Coordination%20-%20${encodeURIComponent(r.hospitalName)}" class="button button-outline" style="padding:5px 12px; font-size:0.82rem;">
                                ✉️ Email Donor
                              </a>
                            ` : ""}
                            <button class="button mark-fulfilled-btn" style="padding:5px 12px; font-size:0.82rem;">
                              Mark Fulfilled
                            </button>
                          </div>
                        </div>
                      `;
                    }).join("")}
                  </div>
                `}
              </div>
            ` : ""}

            <div style="border-top:1px solid var(--border); margin-top:24px; padding-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
              <div>
                ${state.isAdmin ? `
                  <button id="adminVerifyBtn" class="button" style="background:#0369a1; border-color:#0369a1; font-size:0.88rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 12 11 14 15 10"></polyline>
                    </svg> Admin: Verify Request
                  </button>
                ` : ""}
              </div>

              <div style="display:flex; gap:12px; align-items:center;">
                ${isOwner ? `
                  <button id="markFulfilledBtn" class="button button-outline" style="font-size:0.88rem;">Mark Fulfilled</button>
                  <button id="cancelRequestBtn" class="button button-outline" style="color:#d97706; border-color:#fde68a; font-size:0.88rem;">Cancel Request</button>
                  <button id="deleteRequestBtn" class="button button-outline" style="color:#dc2626; border-color:#fecaca; font-size:0.88rem;">🗑️ Delete Request</button>
                ` : `
                  ${myExistingResponse ? `
                    <button class="button" disabled style="background:#16a34a; border-color:#16a34a; cursor:default; opacity:0.95;">
                      ✓ You have offered to donate (${myExistingResponse.unitsOffered} unit)
                    </button>
                  ` : (r.status === "ACTIVE" || r.status === "RESPONSES_RECEIVED") ? `
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
        requestViews.openDonationModal.call(this, requestId, r);
      });

      // Handle requester actions
      document.querySelectorAll(".mark-fulfilled-btn, #markFulfilledBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (confirm("Mark this blood request as fulfilled?")) {
            try {
              const res = await api.updateRequestStatus(requestId, "FULFILLED", "Fulfilled by user");
              const data = await res.json().catch(() => ({}));
              if (res.ok && data.success) {
                toast.success("Blood request successfully marked as fulfilled.");
                this.renderBloodRequestDetail(requestId);
              } else {
                toast.error(data.message || "Failed to update request status.");
              }
            } catch (err) {
              toast.error(err.message || "Network error updating request.");
            }
          }
        });
      });

      document.getElementById("cancelRequestBtn")?.addEventListener("click", async () => {
        if (confirm("Are you sure you want to cancel this blood request?")) {
          try {
            const res = await api.updateRequestStatus(requestId, "CANCELLED", "Cancelled by requester");
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success) {
              toast.success("Blood request has been cancelled.");
              this.renderBloodRequestDetail(requestId);
            } else {
              toast.error(data.message || "Failed to cancel request.");
            }
          } catch (err) {
            toast.error(err.message || "Network error cancelling request.");
          }
        }
      });

      document.getElementById("deleteRequestBtn")?.addEventListener("click", async () => {
        if (confirm("Permanently delete this blood request? This action cannot be undone.")) {
          try {
            const res = await api.deleteBloodRequest(requestId);
            const data = await res.json();
            if (res.ok && data.success) {
              toast.success("Request permanently deleted.");
              window.location.hash = "#/requests/my";
            } else {
              toast.error(data.message || "Failed to delete request.");
            }
          } catch (e) {
            toast.error(e.message || "Failed to delete request.");
          }
        }
      });

      // Platform admin verification
      document.getElementById("adminVerifyBtn")?.addEventListener("click", async () => {
        const approved = confirm("Approve and activate this blood request?\nClick OK to Approve, or Cancel to Reject.");
        const status = approved ? "APPROVED" : "REJECTED";
        const note = prompt(
          approved ? "Approval / Verification note:" : "Reason for rejection:",
          approved ? "Verified authentic hospital requirement" : "Incomplete or unverifiable hospital details"
        ) || "";
        const res = await api.verifyBloodRequest(requestId, status, note);
        if (res.ok) {
          toast.success(`Request marked as ${status}`);
        } else {
          const d = await res.json().catch(() => ({}));
          toast.error(d.message || "Failed to update request verification status.");
        }
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
  },

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
        const unitsVal = parseInt(document.getElementById("offerUnits")?.value, 10);
        const msgVal = document.getElementById("offerMessage")?.value?.trim() || "";
        const consentVal = document.getElementById("contactConsentCheck")?.checked || false;

        const payload = {
          unitsOffered: isNaN(unitsVal) || unitsVal < 1 ? 1 : unitsVal,
          message: msgVal,
          notes: msgVal,
          contactSharingConsent: consentVal
        };

        const res = await api.submitDonationResponse(requestId, payload);
        const data = await res.json();

        if (res.ok && data.success) {
          toast.success("Donation offer submitted to the requester.");
          close();
          this.renderBloodRequestDetail(requestId);
        } else {
          throw new Error(data.message || "Unable to submit donation offer.");
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
  },

  async renderMyBloodRequests() {
    this.renderLoader("Loading your blood requests...");
    try {
      const res = await api.getMyBloodRequests();
      const data = await res.json();
      const requests = Array.isArray(data.data)
        ? data.data
        : (data.data?.requests || []);

      this.appContainer.innerHTML = `
        <div class="find-donors-hero-section">
          <div class="find-donors-hero-inner">
            <div class="find-donors-hero-text">
              <div class="find-donors-badge">
                <span>PERSONAL COORDINATION DASHBOARD</span>
              </div>
              <h1 class="find-donors-hero-title">
                My Blood <span class="accent-text">Requests</span>
              </h1>
              <p class="find-donors-hero-sub">
                Manage your active and completed blood requirements, review donor responses, and update statuses.
              </p>
              <div style="display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; margin-top:14px;">
                <a href="#/requests" class="button button-outline" style="padding: 7px 18px; font-size: 0.88rem; border-radius: 9999px;">
                  ← All Blood Requests
                </a>
                <a href="#/requests/create" class="button button-primary" style="padding: 7px 20px; font-size: 0.88rem; border-radius: 9999px;">
                  + Create Request
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="find-donors-body-wrapper">
          ${requests.length === 0 ? `
            <div class="auth-card" style="max-width:520px; margin:40px auto; text-align:center;">
              <div style="margin: 0 auto 12px; color: var(--text-muted); display:flex; justify-content:center;">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg></div>
              <h3>No Requests Created</h3>
              <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:20px;">
                You haven't submitted any blood donation requests yet.
              </p>
              <a href="#/requests/create" class="button button-primary">Create Your First Request</a>
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
                      
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
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
                      <div class="filter-label">Required By</div>
                      <span>${r.requiredBy ? new Date(r.requiredBy).toLocaleDateString() : "Flexible"}</span>
                    </div>
                  </div>

                  <div style="margin-top:auto; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
                    <a href="#/requests/${r.id || r._id}" class="button" style="padding:6px 14px; font-size:0.86rem;">
                      Manage & Responses →
                    </a>
                    <button class="delete-my-req-btn button button-outline" data-id="${r.id || r._id}" style="color:#dc2626; border-color:#fecaca; padding:5px 10px; font-size:0.8rem;">
                      Delete
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `;

      document.querySelectorAll(".delete-my-req-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const reqId = btn.getAttribute("data-id");
          if (confirm("Are you sure you want to delete this blood request?")) {
            try {
              const res = await api.deleteBloodRequest(reqId);
              const data = await res.json();
              if (res.ok && data.success) {
                toast.success("Request deleted successfully.");
                this.renderMyBloodRequests();
              } else {
                toast.error(data.message || "Failed to delete request.");
              }
            } catch (err) {
              toast.error(err.message || "Network error.");
            }
          }
        });
      });
    } catch (err) {
      this.appContainer.innerHTML = `
        <div class="auth-card">
          <p style="color:#dc2626;">Failed to load your requests: ${err.message}</p>
          <a href="#/requests" class="button">Back to Requests</a>
        </div>
      `;
    }
  }
};
