import { api } from "../api.js";
import { authState } from "../auth.js";
import { toast } from "../toast.js";
import { icons } from "../icons.js";

export const campViews = {
  async renderCamps(params = {}) {
    const city = params.city || "";
    const stateVal = params.state || "";
    const pinCode = params.pinCode || "";
    const statusVal = params.status || "ALL";

    this.appContainer.innerHTML = `
      <div class="find-donors-hero-section">
        <div class="find-donors-hero-inner">
          <div class="find-donors-hero-text">
            <div class="find-donors-badge">
              <span>COMMUNITY BLOOD DRIVES</span>
            </div>
            <h1 class="find-donors-hero-title">
              Blood Donation <span class="accent-text">Camps</span>
            </h1>
            <p class="find-donors-hero-sub">
              Join public blood drives organized by verified community centers, colleges, and hospitals.
            </p>
            ${(authState.getState().isAuthenticated || authState.getState().user) ? `
              <div style="margin-top: 14px;">
                <a href="#/camps/my-registrations" class="button button-outline" style="padding: 7px 18px; font-size: 0.88rem; border-radius: 9999px;">
                  My Registered Camps
                </a>
              </div>
            ` : ""}
          </div>
        </div>
      </div>

      <div class="find-donors-body-wrapper">
        <div class="find-donors-search-card" style="padding: 20px 24px; margin-bottom: 24px; border-radius: 18px;">
          <form id="campFilterForm" class="find-donors-search-form camp-filter-responsive-form">
            <div class="form-group" style="margin-bottom:0;">
              <label class="find-donors-search-form form-label" for="campFilterCity" style="font-size:0.78rem; margin-bottom:5px;">City</label>
              <input type="text" id="campFilterCity" class="form-input" style="height:42px; font-size:0.88rem;" placeholder="e.g. Delhi, Mumbai" value="${city}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="find-donors-search-form form-label" for="campFilterPin" style="font-size:0.78rem; margin-bottom:5px;">PIN Code</label>
              <input type="text" id="campFilterPin" class="form-input" style="height:42px; font-size:0.88rem;" placeholder="6-digit PIN" maxlength="6" value="${pinCode}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="find-donors-search-form form-label" for="campFilterStatus" style="font-size:0.78rem; margin-bottom:5px;">Status</label>
              <select id="campFilterStatus" class="form-input" style="height:42px; font-size:0.88rem;">
                <option value="ALL" ${statusVal === "ALL" ? "selected" : ""}>All Camps</option>
                <option value="PUBLISHED" ${statusVal === "PUBLISHED" ? "selected" : ""}>Upcoming</option>
                <option value="ONGOING" ${statusVal === "ONGOING" ? "selected" : ""}>Ongoing Today</option>
                <option value="COMPLETED" ${statusVal === "COMPLETED" ? "selected" : ""}>Completed</option>
              </select>
            </div>
            <div class="find-donors-btn-group" style="gap:8px;">
              <button type="submit" class="button button-primary" style="height:42px; padding: 0 18px; font-size:0.88rem; flex:1;">Filter</button>
              <button type="button" id="resetCampFilterBtn" class="button button-outline" style="height:42px; padding: 0 14px; font-size:0.88rem;">Reset</button>
            </div>
          </form>
        </div>

        <div id="campsListContainer">
          <div class="spinner" style="margin: 40px auto;"></div>
        </div>
      </div>
    `;

    const form = document.getElementById("campFilterForm");
    const resetBtn = document.getElementById("resetCampFilterBtn");
    const container = document.getElementById("campsListContainer");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const newCity = document.getElementById("campFilterCity").value.trim();
      const newPin = document.getElementById("campFilterPin").value.trim();
      const newStatus = document.getElementById("campFilterStatus").value;
      this.renderCamps({ city: newCity, pinCode: newPin, status: newStatus });
    });

    resetBtn.addEventListener("click", () => {
      this.renderCamps({});
    });

    try {
      const res = await api.getCamps({ city, state: stateVal, pinCode, status: statusVal });
      const data = await res.json();
      const camps = data.camps || data.data?.camps || [];

      if (camps.length === 0) {
        container.innerHTML = `
          <div class="auth-card" style="padding: 48px 24px; text-align: center; max-width: 500px; margin: 40px auto;">
            <div style="margin: 0 auto 14px; color: var(--red); display:flex; justify-content:center;">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 21h18"></path>
      <path d="M12 3l9 18H3l9-18z"></path>
      <path d="M12 3v18"></path>
      <path d="M9 14l3 3 3-3"></path>
    </svg></div>
            <h3 style="margin: 0 0 6px; font-size: 1.2rem; color: var(--text-main);">No Donation Camps Found</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 20px;">Try adjusting your city, PIN code, or status filters.</p>
            <button class="button" onclick="document.getElementById('resetCampFilterBtn').click()">Clear Filters</button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="requests-grid" style="grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));">
          ${camps.map(camp => {
            const startStr = new Date(camp.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
            const deadlineStr = new Date(camp.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
            const isFull = camp.availableSlots <= 0;
            const isClosed = camp.status === "COMPLETED" || camp.status === "CANCELLED";

            return `
              <div class="request-card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 12px;">
                    <span class="badge" style="font-size: 0.72rem; background: #fee2e2; color: #991b1b;">
                      ${camp.status}
                    </span>
                    ${camp.isDemoCamp ? `<span class="badge" style="background:#f1f5f9; color:#64748b; font-size:0.68rem;">DEMO CAMP</span>` : ""}
                  </div>

                  <h3 style="margin: 0 0 6px; font-size: 1.15rem; font-weight: 750; color: var(--text-main);">${camp.title}</h3>
                  <p style="margin: 0 0 12px; color: var(--text-muted); font-size: 0.86rem; line-height: 1.45;">
                    
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg> <strong>${camp.venueName}</strong>, ${camp.address}, ${camp.location.city} (${camp.location.pinCode})
                  </p>

                  <div style="background: #f8fafc; border-radius: 8px; padding: 10px 12px; margin-bottom: 16px; font-size: 0.84rem; display: flex; flex-direction: column; gap: 6px;">
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: var(--text-muted);">Drive Date:</span>
                      <strong>${startStr}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: var(--text-muted);">Organizer:</span>
                      <strong>${camp.organizer?.name || "Community Partner"}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: var(--text-muted);">Slots Available:</span>
                      <strong style="color: ${isFull ? '#dc2626' : 'var(--success)'};">${isFull ? 'Full Capacity' : camp.availableSlots + ' / ' + camp.capacity}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <button class="button register-camp-card-btn" data-id="${camp.id || camp._id}" style="width: 100%; font-size: 0.92rem; font-weight: 600;">
                    ${isClosed ? "View Details" : (isFull ? "Camp Full - View Info" : "Register to Donate")}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;

      container.querySelectorAll(".register-camp-card-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          if (id) {
            campViews.renderCampDetailModal(id);
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="alert alert-error">${err.message || "Failed to load camps."}</div>`;
    }
  },

  async renderCampDetailModal(campId) {
    if (!campId) {
      toast.show("Invalid Camp ID.", "error");
      return;
    }

    let modal = document.getElementById("campDetailModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "campDetailModal";
      modal.className = "modal-backdrop";
      document.body.appendChild(modal);
    }

    modal.style.display = "grid";
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 560px; padding: 28px;">
        <div class="spinner" style="margin: 30px auto;"></div>
      </div>
    `;

    try {
      const state = authState.getState();
      const isAuthenticated = Boolean(state.isAuthenticated || state.user);

      const [campRes, myRegRes] = await Promise.all([
        api.getCampById(campId),
        isAuthenticated ? api.getMyCampRegistration(campId).then(r => r.json()).catch(() => null) : null
      ]);

      const campData = await campRes.json();
      const camp = campData.camp || campData.data?.camp;
      if (!camp) throw new Error("Camp details could not be retrieved.");

      const myReg = myRegRes?.registration || myRegRes?.data?.registration;
      const isRegistered = myReg && myReg.registrationStatus === "REGISTERED";
      const startStr = new Date(camp.startDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
      const endStr = new Date(camp.endDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
      const user = state.user;
      const userName = user?.fullName || user?.name || "";
      const userPhone = user?.phoneNumber || "";
      const userBlood = user?.bloodGroup || "";

      modal.innerHTML = `
        <div class="modal-content" style="max-width: 560px; padding: 28px; text-align: left; max-height: 90vh; overflow-y: auto;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
            <span class="badge" style="background:#fee2e2; color:#991b1b; font-weight:700;">${camp.status}</span>
            <button id="closeCampModalBtn" style="background:none; border:none; font-size:1.6rem; cursor:pointer; color:var(--text-muted); line-height:1;" aria-label="Close">&times;</button>
          </div>

          <h2 style="margin: 0 0 8px; font-size: 1.4rem; color: var(--text-main); font-weight:800;">${camp.title}</h2>
          <p style="margin: 0 0 16px; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">${camp.description}</p>

          <div style="background:#f8fafc; border:1px solid var(--border); border-radius:10px; padding:14px; margin-bottom:20px; font-size:0.88rem; display:flex; flex-direction:column; gap:8px;">
            <div><strong>Venue:</strong> ${camp.venueName}, ${camp.address}</div>
            <div><strong>Location:</strong> ${camp.location?.city || ""}, ${camp.location?.state || ""} (${camp.location?.pinCode || ""})</div>
            <div><strong>Schedule:</strong> ${startStr} to ${endStr}</div>
            <div><strong>Organizer:</strong> ${camp.organizer?.name || "Community Partner Organization"}</div>
            <div><strong>Slots Remaining:</strong> <span style="font-weight:700; color:${camp.availableSlots > 0 ? 'var(--success)' : '#dc2626'}">${camp.availableSlots} available out of ${camp.capacity}</span></div>
          </div>

          ${camp.additionalInstructions ? `
            <div class="alert alert-warning" style="margin-bottom:20px; font-size:0.85rem;">
              <strong>Instructions:</strong> ${camp.additionalInstructions}
            </div>
          ` : ""}

          <div id="campActionSection">
            ${isRegistered ? `
              <div class="alert alert-success" style="margin-bottom:16px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle; margin-right:4px;">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg> <strong>You are registered for this donation camp!</strong>
              </div>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">
                Please report to the registration desk at ${camp.venueName} during camp hours with your government photo ID.
              </p>
              <div style="display:flex; gap:10px;">
                <a href="#/camps/my-registrations" class="button" style="flex:1; text-align:center;">View My Bookings</a>
                <button id="cancelCampRegBtn" class="button button-outline" style="flex:1; color:#dc2626; border-color:#dc2626;">
                  Cancel Registration
                </button>
              </div>
            ` : (camp.availableSlots <= 0 ? `
              <div class="alert alert-warning" style="margin-bottom:12px;">This donation drive has reached maximum registered donor capacity.</div>
              <button class="button" disabled style="width:100%; opacity:0.6;">Camp Capacity Full</button>
            ` : `
              <form id="campRegistrationForm" style="display:flex; flex-direction:column; gap:12px; margin-top:8px;">
                <div style="border-top:1px solid var(--border); padding-top:14px; margin-bottom:2px;">
                  <h4 style="margin:0 0 4px; font-size:1.1rem; font-weight:750; color:var(--text-main);">Donor Registration Form</h4>
                  <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">Fill in your details below to confirm your donor slot.</p>
                </div>

                ${!isAuthenticated ? `
                  <div class="alert alert-warning" style="font-size:0.85rem; margin-bottom:6px;">
                    <strong>Note:</strong> You will be prompted to sign in with your verified Google account to finalize your donor booking.
                  </div>
                ` : ""}

                <div class="responsive-form-row">
                  <div>
                    <label class="filter-label" for="regDonorName">Full Name *</label>
                    <input type="text" id="regDonorName" class="filter-input" required value="${userName}" placeholder="Your Full Name">
                  </div>
                  <div>
                    <label class="filter-label" for="regDonorPhone">Phone Number *</label>
                    <input type="tel" id="regDonorPhone" class="filter-input" required value="${userPhone}" placeholder="+91 98765 43210">
                  </div>
                </div>

                <div class="responsive-form-row">
                  <div>
                    <label class="filter-label" for="regDonorBloodGroup">Blood Group *</label>
                    <select id="regDonorBloodGroup" class="filter-select" required>
                      <option value="">Select Group</option>
                      <option value="A+" ${userBlood === 'A+' ? 'selected' : ''}>A+</option>
                      <option value="A-" ${userBlood === 'A-' ? 'selected' : ''}>A-</option>
                      <option value="B+" ${userBlood === 'B+' ? 'selected' : ''}>B+</option>
                      <option value="B-" ${userBlood === 'B-' ? 'selected' : ''}>B-</option>
                      <option value="AB+" ${userBlood === 'AB+' ? 'selected' : ''}>AB+</option>
                      <option value="AB-" ${userBlood === 'AB-' ? 'selected' : ''}>AB-</option>
                      <option value="O+" ${userBlood === 'O+' ? 'selected' : ''}>O+</option>
                      <option value="O-" ${userBlood === 'O-' ? 'selected' : ''}>O-</option>
                    </select>
                  </div>
                  <div>
                    <label class="filter-label" for="regDonorSlot">Preferred Arrival Slot *</label>
                    <select id="regDonorSlot" class="filter-select" required>
                      <option value="morning">Morning (09:00 AM - 12:00 PM)</option>
                      <option value="afternoon">Afternoon (12:00 PM - 03:00 PM)</option>
                      <option value="evening">Evening (03:00 PM - 06:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.83rem; color:var(--text-muted); cursor:pointer;">
                    <input type="checkbox" id="regDonorConsent" required style="margin-top:3px;">
                    <span>I confirm I am aged 18-65, weigh > 45kg, and have not donated whole blood in the last 90 days.</span>
                  </label>
                </div>

                <div id="campRegErrorMsg"></div>

                <button type="submit" id="registerCampSubmitBtn" class="button" style="width:100%; margin-top:4px;">
                  ${isAuthenticated ? 'Confirm Registration' : 'Sign in & Register for Camp'}
                </button>
              </form>
            `)}
          </div>
        </div>
      `;

      document.getElementById("closeCampModalBtn")?.addEventListener("click", () => {
        modal.style.display = "none";
      });

      // Close modal on backdrop click
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      };

      const regForm = document.getElementById("campRegistrationForm");
      regForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const errEl = document.getElementById("campRegErrorMsg");
        if (errEl) errEl.innerHTML = "";

        const currentState = authState.getState();
        const userIsAuth = Boolean(currentState.isAuthenticated || currentState.user);

        if (!userIsAuth) {
          modal.style.display = "none";
          toast.show("Please sign in to complete your camp registration.", "info");
          window.location.hash = `#/login?redirect=camps&registerCampId=${campId}`;
          return;
        }

        const btn = document.getElementById("registerCampSubmitBtn");
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<div class="btn-spinner"></div><span>Registering...</span>';
        }

        const donorName = document.getElementById("regDonorName")?.value.trim();
        const donorPhone = document.getElementById("regDonorPhone")?.value.trim();
        const bloodGroup = document.getElementById("regDonorBloodGroup")?.value;
        const preferredSlot = document.getElementById("regDonorSlot")?.value;

        try {
          const res = await api.registerForCamp(campId, {
            donorName,
            donorPhone,
            bloodGroup,
            preferredSlot
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.message || data.error?.message || "Registration failed.");
          }
          toast.success("Camp registration confirmed.");
          modal.style.display = "none";
          window.router?.renderCamps();
        } catch (err) {
          if (errEl) {
            errEl.innerHTML = '<div class="alert alert-error" style="margin-top:8px;">' + (err.message || "Registration failed.") + '</div>';
          } else {
            toast.error(err.message || "Registration failed.");
          }
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = "Confirm Registration";
          }
        }
      });

      document.getElementById("cancelCampRegBtn")?.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to cancel your donation camp registration?")) return;
        try {
          const res = await api.cancelCampRegistration(campId);
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.message || data.error?.message || "Failed to cancel registration.");
          }
          toast.show("Registration cancelled successfully.", "info");
          modal.style.display = "none";
          window.router?.renderCamps();
        } catch (err) {
          toast.show(err.message || "Failed to cancel registration.", "error");
        }
      });
    } catch (err) {
      modal.innerHTML = `
        <div class="modal-content" style="padding: 24px;">
          <div class="alert alert-error">${err.message || "Failed to load camp details."}</div>
          <button class="button" onclick="document.getElementById('campDetailModal').style.display='none'">Close</button>
        </div>
      `;
    }
  },

  async renderMyCampRegistrations() {
    this.appContainer.innerHTML = `
      <div class="requests-container" style="max-width: 820px; margin: 0 auto; padding: 24px 16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <div>
            <h2 style="margin:0; font-size:1.6rem; font-weight:800;">My Camp Registrations</h2>
            <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.92rem;">Your active bookings for upcoming donation drives.</p>
          </div>
          <a href="#/camps" class="button button-outline" style="font-size:0.85rem; padding:6px 14px;">Browse All Camps</a>
        </div>

        <div id="myRegistrationsContainer">
          <div class="spinner" style="margin:40px auto;"></div>
        </div>
      </div>
    `;

    const container = document.getElementById("myRegistrationsContainer");

    try {
      const res = await api.getMyCampRegistrationsList();
      const data = await res.json();
      const regs = data.data?.registrations || [];

      if (regs.length === 0) {
        container.innerHTML = `
          <div class="auth-card" style="padding:48px 24px; text-align:center;">
            <div style="margin: 0 auto 14px; color: var(--red); display:flex; justify-content:center;">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 21h18"></path>
      <path d="M12 3l9 18H3l9-18z"></path>
      <path d="M12 3v18"></path>
      <path d="M9 14l3 3 3-3"></path>
    </svg></div>
            <h3 style="margin:0 0 6px;">No Active Camp Registrations</h3>
            <p style="color:var(--text-muted); margin:0 0 20px; font-size:0.9rem;">You haven't registered for any blood donation camps yet.</p>
            <a href="#/camps" class="button">Find Nearby Camps</a>
          </div>
        `;
        return;
      }

      container.innerHTML = regs.map(reg => {
        const camp = reg.campId;
        if (!camp) return "";
        const dateStr = new Date(camp.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

        return `
          <div class="request-card" style="margin-bottom:16px; padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <span class="badge" style="background:#dcfce7; color:#166534;">Registered</span>
              <span style="font-size:0.8rem; color:var(--text-muted);">${new Date(reg.registeredAt).toLocaleDateString()}</span>
            </div>
            <h3 style="margin:0 0 6px; font-size:1.2rem;">${camp.title}</h3>
            <p style="margin:0 0 10px; color:var(--text-muted); font-size:0.88rem;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg> ${camp.venueName}, ${camp.address}, ${camp.location?.city}</p>
            <p style="margin:0 0 16px; font-size:0.88rem;"><strong>Drive Time:</strong> ${dateStr}</p>
            <button class="button button-outline cancel-my-booking-btn" data-id="${camp._id}" style="color:#dc2626; border-color:#dc2626; font-size:0.85rem; padding:6px 14px;">
              Cancel Booking
            </button>
          </div>
        `;
      }).join("");

      container.querySelectorAll(".cancel-my-booking-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const campId = e.currentTarget.dataset.id;
          if (!confirm("Are you sure you want to cancel this camp booking?")) return;
          try {
            await api.cancelCampRegistration(campId);
            toast.show("Booking cancelled.", "info");
            this.renderMyCampRegistrations();
          } catch (err) {
            toast.show(err.message || "Failed to cancel.", "error");
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="alert alert-error">${err.message || "Failed to load bookings."}</div>`;
    }
  },

  async renderBloodBanks(params = {}) {
    const searchVal = params.search || "";
    const cityVal = params.city || "";

    this.appContainer.innerHTML = `
      <div class="find-donors-hero-section">
        <div class="find-donors-hero-inner">
          <div class="find-donors-hero-text">
            <div class="find-donors-badge">
              <span>VERIFIED HEALTHCARE NETWORK</span>
            </div>
            <h1 class="find-donors-hero-title">
              Licensed Blood Banks <span class="accent-text">&amp; Storage Centers</span>
            </h1>
            <p class="find-donors-hero-sub">
              Directory of verified government and community blood banks across India with component storage facilities.
            </p>
          </div>
        </div>
      </div>

      <div class="find-donors-body-wrapper">
        <div class="find-donors-search-card" style="padding: 20px 24px; margin-bottom: 24px; border-radius: 18px;">
          <form id="bankFilterForm" class="find-donors-search-form bank-filter-responsive-form">
            <div class="form-group" style="margin-bottom:0;">
              <label class="find-donors-search-form form-label" for="bankSearchInput" style="font-size:0.78rem; margin-bottom:5px;">Search Center / Hospital</label>
              <input type="text" id="bankSearchInput" class="form-input" style="height:42px; font-size:0.88rem;" placeholder="e.g. Red Cross, PGIMER, Rotary" value="${searchVal}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="find-donors-search-form form-label" for="bankCityInput" style="font-size:0.78rem; margin-bottom:5px;">City</label>
              <input type="text" id="bankCityInput" class="form-input" style="height:42px; font-size:0.88rem;" placeholder="e.g. Mumbai, Delhi, Chandigarh" value="${cityVal}">
            </div>
            <div class="find-donors-btn-group" style="gap:8px;">
              <button type="submit" class="button button-primary" style="height:42px; padding: 0 18px; font-size:0.88rem; flex:1;">Search</button>
              <button type="button" id="resetBankFilterBtn" class="button button-outline" style="height:42px; padding: 0 14px; font-size:0.88rem;">Reset</button>
            </div>
          </form>
        </div>

        <div id="banksListContainer">
          <div class="spinner" style="margin: 40px auto;"></div>
        </div>
      </div>
    `;

    const form = document.getElementById("bankFilterForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const s = document.getElementById("bankSearchInput")?.value.trim();
      const c = document.getElementById("bankCityInput")?.value.trim();
      const q = new URLSearchParams();
      if (s) q.set("search", s);
      if (c) q.set("city", c);
      window.location.hash = `#/blood-banks?${q.toString()}`;
    });

    document.getElementById("resetBankFilterBtn")?.addEventListener("click", () => {
      window.location.hash = "#/blood-banks";
    });

    const container = document.getElementById("banksListContainer");
    if (!container) return;

    try {
      const res = await api.getBloodBanks({ search: searchVal, city: cityVal });
      const data = await res.json();
      const banks = data.data?.bloodBanks || [];

      if (banks.length === 0) {
        container.innerHTML = `
          <div class="auth-card" style="padding: 48px 24px; text-align: center; max-width: 500px; margin: 40px auto;">
            <div style="margin: 0 auto 14px; color: var(--text-muted); display:flex; justify-content:center;">
              ${icons.organization(40, 'var(--text-muted)')}
            </div>
            <h3 style="margin: 0 0 6px; font-size: 1.2rem; color: var(--text-main);">No Blood Banks Found</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 20px;">Try expanding your city search or filter criteria.</p>
            <button class="button" onclick="document.getElementById('resetBankFilterBtn').click()">Reset Search</button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="requests-grid" style="grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 20px;">
          ${banks.map(bank => {
            const cityName = bank.address?.city || "City Center";
            const stateName = bank.address?.state || "State";
            const pinCode = bank.address?.pincode ? `(${bank.address.pincode})` : "";

            return `
              <div class="request-card" style="display: flex; flex-direction: column; justify-content: space-between; border-left: 4px solid var(--red);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 12px;">
                    <span class="badge" style="font-size: 0.72rem; background: #dcfce7; color: #166534; display: inline-flex; align-items: center; gap: 4px;">
                      ${icons.shieldCheck(13, '#166534')} Verified Blood Bank
                    </span>
                    ${bank.licenseNumber ? `<span style="font-size: 0.74rem; font-family: monospace; color: var(--text-muted);">Lic: ${bank.licenseNumber}</span>` : ""}
                  </div>

                  <h3 style="margin: 0 0 8px; font-size: 1.2rem; font-weight: 750; color: var(--text-main);">${bank.name}</h3>
                  
                  <div style="margin: 0 0 14px; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5; display: flex; align-items: flex-start; gap: 6px;">
                    ${icons.mapPin(15, 'var(--text-muted)')}
                    <span>${cityName}, ${stateName} ${pinCode}</span>
                  </div>

                  <div style="background: #f8fafc; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 0.84rem; display: flex; flex-direction: column; gap: 8px;">
                    ${bank.phoneNumber ? `
                      <div style="display: flex; align-items: center; gap: 8px; color: var(--text-main);">
                        ${icons.phone(14, 'var(--text-muted)')}
                        <strong>${bank.phoneNumber}</strong>
                      </div>
                    ` : ""}
                    ${bank.contactEmail ? `
                      <div style="display: flex; align-items: center; gap: 8px; color: var(--text-muted);">
                        ${icons.mail(14, 'var(--text-muted)')}
                        <span>${bank.contactEmail}</span>
                      </div>
                    ` : ""}
                  </div>
                </div>

                <div style="border-top: 1px solid var(--border); padding-top: 14px; display: flex; gap: 10px;">
                  ${bank.phoneNumber ? `
                    <a href="tel:${bank.phoneNumber}" class="button button-outline" style="flex: 1; font-size: 0.85rem; padding: 7px 12px; text-align: center;">
                      Call Center
                    </a>
                  ` : ""}
                  <a href="#/find-blood?city=${encodeURIComponent(cityName)}" class="button" style="flex: 1; font-size: 0.85rem; padding: 7px 12px; text-align: center;">
                    Find Donors
                  </a>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="alert alert-error">${err.message || "Failed to load blood banks."}</div>`;
    }
  }
};