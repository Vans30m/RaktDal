import { api } from "../api.js";
import { authState } from "../auth.js";
import { toast } from "../toast.js";

export const requestViews = {
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
};
