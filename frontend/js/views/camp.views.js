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
      <div class="requests-container" style="max-width: 1100px; margin: 0 auto; padding: 24px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 style="margin: 0; font-size: 1.85rem; color: var(--text-main); font-weight: 850;">Blood Donation Camps</h1>
            <p style="margin: 4px 0 0; color: var(--text-muted); font-size: 0.95rem;">Join public blood drives organized by verified community centers, colleges, and hospitals.</p>
          </div>
          ${authState.isAuthenticated ? `
            <a href="#/camps/my-registrations" class="button button-outline" style="font-size: 0.88rem; padding: 8px 16px;">My Registered Camps</a>
          ` : ""}
        </div>

        <form id="campFilterForm" class="filter-bar" style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 28px;">
          <div class="filter-group" style="flex: 1; min-width: 140px;">
            <label class="filter-label">City</label>
            <input type="text" id="campFilterCity" class="filter-input" placeholder="e.g. Delhi, Mumbai" value="${city}">
          </div>
          <div class="filter-group" style="flex: 1; min-width: 120px;">
            <label class="filter-label">PIN Code</label>
            <input type="text" id="campFilterPin" class="filter-input" placeholder="6-digit PIN" maxlength="6" value="${pinCode}">
          </div>
          <div class="filter-group" style="flex: 1; min-width: 140px;">
            <label class="filter-label">Status</label>
            <select id="campFilterStatus" class="filter-select">
              <option value="ALL" ${statusVal === "ALL" ? "selected" : ""}>All Camps</option>
              <option value="PUBLISHED" ${statusVal === "PUBLISHED" ? "selected" : ""}>Upcoming</option>
              <option value="ONGOING" ${statusVal === "ONGOING" ? "selected" : ""}>Ongoing Today</option>
              <option value="COMPLETED" ${statusVal === "COMPLETED" ? "selected" : ""}>Completed</option>
            </select>
          </div>
          <div style="display: flex; align-items: flex-end; gap: 8px;">
            <button type="submit" class="button" style="height: 38px; padding: 0 18px;">Filter</button>
            <button type="button" id="resetCampFilterBtn" class="button button-outline" style="height: 38px; padding: 0 14px;">Reset</button>
          </div>
        </form>

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
                  <button class="button view-camp-detail-btn" data-id="${camp.id || camp._id}" style="width: 100%; font-size: 0.9rem;">
                    ${isClosed ? "View Details" : (isFull ? "View Camp (Full)" : "Register to Donate")}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;

      container.querySelectorAll(".view-camp-detail-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.dataset.id;
          this.renderCampDetailModal(id);
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="alert alert-error">${err.message || "Failed to load camps."}</div>`;
    }
  },

  async renderCampDetailModal(campId) {
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
      const [campRes, myRegRes] = await Promise.all([
        api.getCampById(campId),
        authState.isAuthenticated ? api.getMyCampRegistration(campId).then(r => r.json()).catch(() => null) : null
      ]);

      const campData = await campRes.json();
      const camp = campData.camp || campData.data?.camp;
      if (!camp) throw new Error("Camp details could not be retrieved.");

      const myReg = myRegRes?.data?.registration;
      const isRegistered = myReg && myReg.registrationStatus === "REGISTERED";
      const startStr = new Date(camp.startDate).toLocaleString();
      const endStr = new Date(camp.endDate).toLocaleString();

      modal.innerHTML = `
        <div class="modal-content" style="max-width: 560px; padding: 28px; text-align: left;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
            <span class="badge" style="background:#fee2e2; color:#991b1b;">${camp.status}</span>
            <button id="closeCampModalBtn" style="background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--text-muted);">&times;</button>
          </div>

          <h2 style="margin: 0 0 8px; font-size: 1.4rem; color: var(--text-main);">${camp.title}</h2>
          <p style="margin: 0 0 16px; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">${camp.description}</p>

          <div style="background:#f8fafc; border:1px solid var(--border); border-radius:10px; padding:14px; margin-bottom:20px; font-size:0.88rem; display:flex; flex-direction:column; gap:8px;">
            <div><strong>Venue:</strong> ${camp.venueName}, ${camp.address}</div>
            <div><strong>Location:</strong> ${camp.location.city}, ${camp.location.state} (${camp.location.pinCode})</div>
            <div><strong>Schedule:</strong> ${startStr} to ${endStr}</div>
            <div><strong>Organizer:</strong> ${camp.organizer?.name || "Community Organization"}</div>
            <div><strong>Registration:</strong> ${camp.availableSlots} slots remaining out of ${camp.capacity}</div>
          </div>

          ${camp.additionalInstructions ? `
            <div class="alert alert-warning" style="margin-bottom:20px; font-size:0.85rem;">
              <strong>Instructions:</strong> ${camp.additionalInstructions}
            </div>
          ` : ""}

          <div id="campActionSection">
            ${isRegistered ? `
              <div class="alert alert-success" style="margin-bottom:16px;">
                
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg> You are registered for this donation camp!
              </div>
              <button id="cancelCampRegBtn" class="button button-outline" style="width:100%; color:#dc2626; border-color:#dc2626;">
                Cancel Registration
              </button>
            ` : (camp.availableSlots <= 0 ? `
              <button class="button" disabled style="width:100%;">Camp Capacity Full</button>
            ` : `
              <button id="registerCampBtn" class="button" style="width:100%;">
                ${authState.isAuthenticated ? "Confirm Registration" : "Sign in to Register"}
              </button>
            `)}
          </div>
        </div>
      `;

      document.getElementById("closeCampModalBtn").addEventListener("click", () => {
        modal.style.display = "none";
      });

      document.getElementById("registerCampBtn")?.addEventListener("click", async () => {
        if (!authState.isAuthenticated) {
          modal.style.display = "none";
          window.location.hash = "#/login";
          return;
        }

        try {
          await api.registerForCamp(campId);
          toast.show("Registration confirmed! See you at the camp.", "success");
          modal.style.display = "none";
          this.renderCamps();
        } catch (err) {
          toast.show(err.message || "Failed to register.", "error");
        }
      });

      document.getElementById("cancelCampRegBtn")?.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to cancel your donation camp registration?")) return;
        try {
          await api.cancelCampRegistration(campId);
          toast.show("Registration cancelled successfully.", "info");
          modal.style.display = "none";
          this.renderCamps();
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
      <div class="requests-container" style="max-width: 1100px; margin: 0 auto; padding: 24px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 style="margin: 0; font-size: 1.85rem; color: var(--text-main); font-weight: 850;">Licensed Blood Banks & Storage Centers</h1>
            <p style="margin: 4px 0 0; color: var(--text-muted); font-size: 0.95rem;">Directory of verified government and community blood banks across India with component storage facilities.</p>
          </div>
        </div>

        <form id="bankFilterForm" class="filter-bar" style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 28px;">
          <div class="filter-group" style="flex: 2; min-width: 180px;">
            <label class="filter-label">Search Center / Hospital</label>
            <input type="text" id="bankSearchInput" class="filter-input" placeholder="e.g. Red Cross, PGIMER, Rotary" value="${searchVal}">
          </div>
          <div class="filter-group" style="flex: 1; min-width: 140px;">
            <label class="filter-label">City</label>
            <input type="text" id="bankCityInput" class="filter-input" placeholder="e.g. Mumbai, Delhi, Chandigarh" value="${cityVal}">
          </div>
          <div style="display: flex; align-items: flex-end; gap: 8px;">
            <button type="submit" class="button" style="height: 38px; padding: 0 18px;">Search</button>
            <button type="button" id="resetBankFilterBtn" class="button button-outline" style="height: 38px; padding: 0 14px;">Reset</button>
          </div>
        </form>

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