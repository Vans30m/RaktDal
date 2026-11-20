import { api } from "../api.js";
import { toast } from "../toast.js";
import { icons } from "../icons.js";

export const notificationViews = {
  async renderNotificationCenter() {
    let prevPage = "#/";
    try {
      const stored = sessionStorage.getItem("rakt_last_visited_page");
      if (stored && !stored.startsWith("#/notifications")) {
        prevPage = stored;
      }
    } catch (_) {}
    if (prevPage === "#/" && window.router?.lastVisitedPage && !window.router.lastVisitedPage.startsWith("#/notifications")) {
      prevPage = window.router.lastVisitedPage;
    }

    this.appContainer.innerHTML = `
      <div class="find-donors-container notif-center-page">
        <!-- 1. Hero Section matching Find Donors -->
        <section class="find-donors-hero-section" aria-labelledby="notifHeading">
          <div class="find-donors-hero-inner">
            <span class="find-donors-badge">
              Real-Time Activity &amp; Alerts
            </span>
            <h1 id="notifHeading" class="find-donors-hero-title">
              Your <span class="accent-text">Notifications</span>
            </h1>
            <p class="find-donors-hero-sub">
              Stay informed about urgent blood requests, volunteer donor responses, and account updates.
            </p>
          </div>
        </section>

        <!-- 2. Main Content Wrapper -->
        <div class="find-donors-body-wrapper notif-body-wrapper" style="max-width: 860px;">
          <!-- Controls Bar Card -->
          <div class="find-donors-search-card notif-controls-card">
            <div class="notif-controls-left">
              <a href="${prevPage}" id="notifBackBtn" class="button button-outline notif-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Back</span>
              </a>
            </div>
            <div class="notif-controls-right">
              <button id="markAllReadBtn" class="button button-outline notif-action-btn">
                Mark All as Read
              </button>
              <button id="openNotifSettingsModalBtn" class="button button-outline notif-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Settings</span>
              </button>
            </div>
          </div>

          <!-- Notification Cards List -->
          <div id="notifListContainer" style="width: 100%;">
            <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
              <div class="spinner" style="margin: 0 auto 12px;"></div>
              Loading notifications...
            </div>
          </div>
        </div>
      </div>
    `;

    const container = document.getElementById("notifListContainer");
    const markAllBtn = document.getElementById("markAllReadBtn");
    const backBtn = document.getElementById("notifBackBtn");

    backBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      let target = null;
      try {
        const stored = sessionStorage.getItem("rakt_last_visited_page");
        if (stored && !stored.startsWith("#/notifications")) {
          target = stored;
        }
      } catch (_) {}
      if (!target && window.router?.lastVisitedPage && !window.router.lastVisitedPage.startsWith("#/notifications")) {
        target = window.router.lastVisitedPage;
      }

      if (target) {
        window.location.hash = target;
      } else if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.hash = "#/";
      }
    });

    markAllBtn?.addEventListener("click", async () => {
      try {
        await api.markAllNotificationsAsRead();
        toast.show("All notifications marked as read.", "success");
        if (window.router?.refreshNotificationBadge) {
          window.router.refreshNotificationBadge();
        }
        notificationViews.renderNotificationCenter.call(this);
      } catch (err) {
        toast.show(err.message || "Failed to update notifications.", "error");
      }
    });

    // Open Notification Settings Popup Modal
    document.getElementById("openNotifSettingsModalBtn")?.addEventListener("click", () => {
      notificationViews.openNotificationSettingsModal();
    });

    try {
      const res = await api.getNotifications(1, 40);
      if (!res.ok) {
        throw new Error(`Failed to load notifications (HTTP ${res.status})`);
      }
      const data = await res.json();
      const items = data.data?.items || data.items || [];

      // Update badge if available
      if (window.router?.refreshNotificationBadge) {
        window.router.refreshNotificationBadge();
      }

      if (items.length === 0) {
        container.innerHTML = `
          <div class="find-donors-search-card" style="padding: 48px 24px; text-align: center; border-radius: 18px;">
            <div style="margin: 0 auto 16px; width: 56px; height: 56px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 style="margin: 0 0 8px; font-size: 1.25rem; font-weight: 750; color: var(--navy);">No Notifications</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem; margin: 0 auto; max-width: 440px; line-height: 1.5;">You're completely caught up! New donor alerts, matching requests, and camp activities will appear right here.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = items.map(n => {
        let actionLink = "";
        if (n.relatedEntityType === "BloodRequest" && n.relatedEntityId) {
          actionLink = `
            <a href="#/requests/${n.relatedEntityId}" class="button button-primary notif-view-btn">
              <span>View Request & Contact Donor</span>
            </a>
          `;
        } else if (n.type === "REQUEST_RESPONSE_RECEIVED" && (n.metadata?.requestId || n.relatedEntityId)) {
          const reqId = n.metadata?.requestId || n.relatedEntityId;
          actionLink = `
            <a href="#/requests/${reqId}" class="button button-primary notif-view-btn">
              <span>View Request & Contact Donor</span>
            </a>
          `;
        }

        const isUnread = !n.isRead;
        return `
        <div class="find-donors-search-card notif-card ${isUnread ? 'is-unread' : 'is-read'}">
          <div class="notif-card-inner">
            <div class="notif-card-main">
              <div class="notif-card-badges">
                <span class="badge ${isUnread ? 'badge-unread' : 'badge-read'}">
                  ${n.type.replace(/_/g, " ")}
                </span>
                <span class="notif-card-date">
                  ${new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                ${isUnread ? `<span class="notif-unread-dot" title="Unread"></span>` : ""}
              </div>
              <h4 class="notif-card-title">${n.title}</h4>
              <p class="notif-card-msg">${n.message}</p>
            </div>
            ${(actionLink || isUnread) ? `
              <div class="notif-card-footer">
                ${actionLink ? actionLink : ""}
                ${isUnread ? `
                  <button class="mark-single-read-btn button button-outline" data-id="${n._id}">
                    Mark Read
                  </button>
                ` : ""}
              </div>
            ` : ""}
          </div>
        </div>
      `;
      }).join("");

      container.querySelectorAll(".mark-single-read-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const target = e.currentTarget;
          const id = target.dataset.id;
          target.disabled = true;
          target.textContent = "Updating...";
          try {
            const res = await api.markNotificationAsRead(id);
            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.message || `Failed with status ${res.status}`);
            }
            toast.show("Notification marked as read.", "success");
            if (window.router?.refreshNotificationBadge) {
              window.router.refreshNotificationBadge();
            }
            notificationViews.renderNotificationCenter.call(this);
          } catch (err) {
            target.disabled = false;
            target.textContent = "Mark Read";
            toast.show(err.message || "Failed to mark as read.", "error");
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="alert alert-error">${err.message || "Failed to load notifications."}</div>`;
    }
  },

  async renderNotificationSettings() {
    this.appContainer.innerHTML = `
      <div class="find-donors-container notif-settings-page">
        <!-- Hero Section matching Find Donors -->
        <section class="find-donors-hero-section" aria-labelledby="notifSettingsHeading">
          <div class="find-donors-hero-inner">
            <span class="find-donors-badge">
              Communication Preferences
            </span>
            <h1 id="notifSettingsHeading" class="find-donors-hero-title">
              Notification <span class="accent-text">Settings</span>
            </h1>
            <p class="find-donors-hero-sub">
              Control which alerts you receive and choose your preferred delivery channels.
            </p>
          </div>
        </section>

        <!-- Main Content Wrapper -->
        <div class="find-donors-body-wrapper" style="max-width: 680px;">
          <div style="margin-bottom: 16px;">
            <a href="#/notifications" class="button button-outline" style="font-size: 0.85rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Notifications</span>
            </a>
          </div>

          <div class="find-donors-search-card" style="text-align: left; padding: 28px; border-radius: 18px;">
            <h3 style="margin: 0 0 16px; font-size: 1.15rem; font-weight: 750; color: var(--navy); border-bottom: 1px solid var(--border); padding-bottom: 10px;">
              Delivery Channels
            </h3>
            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 26px;">
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 0.92rem; color: #334155;">
                <input type="checkbox" id="prefInApp" checked disabled style="width: 17px; height: 17px; accent-color: var(--primary);">
                <span><strong>In-App Notifications</strong> (Mandatory core alerts &amp; real-time bell)</span>
              </label>
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 0.92rem; color: #334155;">
                <input type="checkbox" id="prefEmail" checked style="width: 17px; height: 17px; accent-color: var(--primary);">
                <span><strong>Email Notifications</strong> (Brevo transactional alerts &amp; donor contact details)</span>
              </label>
            </div>

            <h3 style="margin: 0 0 16px; font-size: 1.15rem; font-weight: 750; color: var(--navy); border-bottom: 1px solid var(--border); padding-bottom: 10px;">
              Alert Categories
            </h3>
            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 30px;">
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 0.92rem; color: #334155;">
                <input type="checkbox" id="catRequests" checked style="width: 17px; height: 17px; accent-color: var(--primary);">
                <span>Urgent blood requests matching your group &amp; city</span>
              </label>
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 0.92rem; color: #334155;">
                <input type="checkbox" id="catResponses" checked style="width: 17px; height: 17px; accent-color: var(--primary);">
                <span>Donor responses to your blood requests</span>
              </label>
              <label style="display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 0.92rem; color: #334155;">
                <input type="checkbox" id="catCamps" checked style="width: 17px; height: 17px; accent-color: var(--primary);">
                <span>Blood donation camps &amp; registration updates</span>
              </label>
            </div>

            <button id="savePreferencesBtn" class="button button-primary" style="width: 100%; padding: 10px 18px; font-weight: 700; border-radius: 10px;">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    `;

    // Open Notification Settings Popup Modal
    document.getElementById("openNotifSettingsModalBtn")?.addEventListener("click", () => {
      notificationViews.openNotificationSettingsModal();
    });

    try {
      const res = await api.getNotificationPreferences();
      const data = await res.json();
      const pref = data.data?.preferences;
      if (pref) {
        document.getElementById("prefEmail").checked = pref.channels?.email ?? true;
        document.getElementById("catRequests").checked = pref.categories?.bloodRequests ?? true;
        document.getElementById("catResponses").checked = pref.categories?.donorResponses ?? true;
        document.getElementById("catCamps").checked = pref.categories?.camps ?? true;
      }
    } catch (e) {}

    document.getElementById("savePreferencesBtn")?.addEventListener("click", async () => {
      try {
        const payload = {
          channels: {
            email: document.getElementById("prefEmail").checked
          },
          categories: {
            bloodRequests: document.getElementById("catRequests").checked,
            donorResponses: document.getElementById("catResponses").checked,
            camps: document.getElementById("catCamps").checked
          }
        };
        await api.updateNotificationPreferences(payload);
        toast.show("Preferences saved successfully.", "success");
      } catch (err) {
        toast.show(err.message || "Failed to update preferences.", "error");
      }
    });
  },

  /**
   * Opens Notification Settings in an elegant modal popup
   */
  async openNotificationSettingsModal() {
    let modal = document.getElementById("notifSettingsModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "notifSettingsModal";
      modal.className = "modal-backdrop";
      document.body.appendChild(modal);
    }

    modal.style.display = "flex";
    document.body.classList.add("modal-open");
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(15, 23, 42, 0.45)";
    modal.style.backdropFilter = "blur(4px)";
    modal.style.zIndex = "9999";

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 520px; width: 92%; border-radius: 20px; padding: 28px; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25); text-align: left; background: #ffffff; animation: modalPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#fee2e2; color:#c51f26; font-size:0.72rem; font-weight:750; text-transform:uppercase; letter-spacing:0.06em; padding:3px 10px; border-radius:9999px; margin-bottom:6px;">
              Preferences
            </div>
            <h3 style="margin: 0; font-size: 1.35rem; font-weight: 800; color: var(--navy);">Notification Settings</h3>
            <p style="margin: 4px 0 0; font-size: 0.88rem; color: var(--text-muted);">Manage your real-time alerts and delivery channels.</p>
          </div>
          <button id="closeNotifModalBtn" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: #94a3b8; padding: 4px; border-radius: 6px; line-height: 1;" title="Close" aria-label="Close">
            ✕
          </button>
        </div>

        <div style="margin-bottom: 22px;">
          <h4 style="margin: 0 0 12px; font-size: 0.95rem; font-weight: 750; color: var(--navy); border-bottom: 1px solid var(--border); padding-bottom: 8px;">
            Delivery Channels
          </h4>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; color: #334155;">
              <input type="checkbox" id="modalPrefInApp" checked disabled style="width: 17px; height: 17px; accent-color: var(--primary);">
              <span><strong>In-App Notifications</strong> (Mandatory alert bell &amp; center)</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; color: #334155;">
              <input type="checkbox" id="modalPrefEmail" checked style="width: 17px; height: 17px; accent-color: var(--primary);">
              <span><strong>Email Notifications</strong> (Brevo transactional delivery)</span>
            </label>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h4 style="margin: 0 0 12px; font-size: 0.95rem; font-weight: 750; color: var(--navy); border-bottom: 1px solid var(--border); padding-bottom: 8px;">
            Alert Categories
          </h4>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; color: #334155;">
              <input type="checkbox" id="modalCatRequests" checked style="width: 17px; height: 17px; accent-color: var(--primary);">
              <span>Urgent blood requests near your location</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; color: #334155;">
              <input type="checkbox" id="modalCatResponses" checked style="width: 17px; height: 17px; accent-color: var(--primary);">
              <span>Donor responses to your blood requests</span>
            </label>
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; color: #334155;">
              <input type="checkbox" id="modalCatCamps" checked style="width: 17px; height: 17px; accent-color: var(--primary);">
              <span>Blood donation camps &amp; registration updates</span>
            </label>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button id="cancelNotifModalBtn" class="button button-outline" style="padding: 8px 18px; border-radius: 10px; font-size: 0.88rem; font-weight: 600;">
            Cancel
          </button>
          <button id="saveNotifModalBtn" class="button button-primary" style="padding: 8px 20px; border-radius: 10px; font-size: 0.88rem; font-weight: 700;">
            Save Preferences
          </button>
        </div>
      </div>
    `;

    const close = () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    };

    document.getElementById("closeNotifModalBtn")?.addEventListener("click", close);
    document.getElementById("cancelNotifModalBtn")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    // Populate initial preferences
    try {
      const res = await api.getNotificationPreferences();
      const data = await res.json();
      const pref = data.data?.preferences;
      if (pref) {
        const emailEl = document.getElementById("modalPrefEmail");
        const reqEl = document.getElementById("modalCatRequests");
        const respEl = document.getElementById("modalCatResponses");
        const campEl = document.getElementById("modalCatCamps");

        if (emailEl) emailEl.checked = pref.channels?.email ?? true;
        if (reqEl) reqEl.checked = pref.categories?.bloodRequests ?? true;
        if (respEl) respEl.checked = pref.categories?.donorResponses ?? true;
        if (campEl) campEl.checked = pref.categories?.camps ?? true;
      }
    } catch (e) {}

    document.getElementById("saveNotifModalBtn")?.addEventListener("click", async () => {
      const saveBtn = document.getElementById("saveNotifModalBtn");
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
      }

      try {
        const payload = {
          channels: {
            email: document.getElementById("modalPrefEmail")?.checked ?? true
          },
          categories: {
            bloodRequests: document.getElementById("modalCatRequests")?.checked ?? true,
            donorResponses: document.getElementById("modalCatResponses")?.checked ?? true,
            camps: document.getElementById("modalCatCamps")?.checked ?? true
          }
        };
        await api.updateNotificationPreferences(payload);
        toast.show("Notification preferences updated!", "success");
        close();
      } catch (err) {
        toast.show(err.message || "Failed to update preferences.", "error");
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Save Preferences";
        }
      }
    });
  }
};

