import { api } from "../api.js";
import { toast } from "../toast.js";
import { icons } from "../icons.js";

export const notificationViews = {
  async renderNotificationCenter() {
    this.appContainer.innerHTML = `
      <div class="requests-container" style="max-width: 820px; margin: 0 auto; padding: 24px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="margin: 0; font-size: 1.6rem; color: var(--text-main); font-weight: 800;">Notifications</h2>
            <p style="margin: 4px 0 0; color: var(--text-muted); font-size: 0.92rem;">Stay informed about blood requests, donor responses, and verification alerts.</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="markAllReadBtn" class="button button-outline" style="font-size: 0.85rem; padding: 6px 14px;">Mark all as read</button>
            <a href="#/notifications/settings" class="button button-outline" style="font-size: 0.85rem; padding: 6px 14px;">Settings</a>
          </div>
        </div>

        <div id="notifListContainer">
          <div class="spinner" style="margin: 32px auto;"></div>
        </div>
      </div>
    `;

    const container = document.getElementById("notifListContainer");
    const markAllBtn = document.getElementById("markAllReadBtn");

    markAllBtn?.addEventListener("click", async () => {
      try {
        await api.markAllNotificationsAsRead();
        toast.show("All notifications marked as read.", "success");
        this.renderNotificationCenter();
      } catch (err) {
        toast.show(err.message || "Failed to update notifications.", "error");
      }
    });

    try {
      const res = await api.getNotifications(1, 40);
      const data = await res.json();
      const items = data.data?.items || [];

      if (items.length === 0) {
        container.innerHTML = `
          <div class="auth-card" style="padding: 40px 24px; text-align: center;">
            <div style="margin: 0 auto 14px; color: var(--text-muted); display:flex; justify-content:center;">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg></div>
            <h3 style="margin: 0 0 6px; font-size: 1.15rem; color: var(--text-main);">No Notifications</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">You're all caught up! Important alerts and updates will appear here.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = items.map(n => `
        <div class="request-card" style="margin-bottom: 12px; padding: 16px; border-left: 4px solid ${n.isRead ? '#cbd5e1' : 'var(--red)'}; background: ${n.isRead ? '#ffffff' : '#fff5f5'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="badge" style="font-size: 0.7rem; background: ${n.isRead ? '#f1f5f9' : '#fee2e2'}; color: ${n.isRead ? '#475569' : '#991b1b'};">${n.type.replace(/_/g, " ")}</span>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
              <h4 style="margin: 0 0 6px; font-size: 1rem; color: var(--text-main);">${n.title}</h4>
              <p style="margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.5;">${n.message}</p>
            </div>
            ${!n.isRead ? `
              <button class="mark-single-read-btn" data-id="${n._id}" style="background: none; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 8px; font-size: 0.76rem; cursor: pointer; color: var(--text-muted); white-space: nowrap;">Mark Read</button>
            ` : ""}
          </div>
        </div>
      `).join("");

      container.querySelectorAll(".mark-single-read-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;
          try {
            await api.markNotificationAsRead(id);
            this.renderNotificationCenter();
          } catch (err) {
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
      <div class="requests-container" style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
          <a href="#/notifications" class="button button-outline" style="padding:6px 12px; font-size:0.85rem;">← Back</a>
          <h2 style="margin:0; font-size:1.4rem; font-weight:800;">Notification Preferences</h2>
        </div>

        <div class="auth-card" style="text-align:left; padding:24px;">
          <h3 style="margin:0 0 16px; font-size:1.05rem; border-bottom:1px solid var(--border); padding-bottom:8px;">Channels</h3>
          <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
              <input type="checkbox" id="prefInApp" checked disabled>
              <span><strong>In-App Notifications</strong> (Mandatory core alerts)</span>
            </label>
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
              <input type="checkbox" id="prefEmail" checked>
              <span><strong>Email Notifications</strong> (Important transactional updates)</span>
            </label>
          </div>

          <h3 style="margin:0 0 16px; font-size:1.05rem; border-bottom:1px solid var(--border); padding-bottom:8px;">Alert Categories</h3>
          <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:28px;">
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
              <input type="checkbox" id="catRequests" checked>
              <span>Blood requests near your location</span>
            </label>
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
              <input type="checkbox" id="catResponses" checked>
              <span>Donor responses to your requests</span>
            </label>
            <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
              <input type="checkbox" id="catCamps" checked>
              <span>Donation camps & registration updates</span>
            </label>
          </div>

          <button id="savePreferencesBtn" class="button" style="width:100%;">Save Preferences</button>
        </div>
      </div>
    `;

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
  }
};

