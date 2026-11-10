import { api } from "../api.js";
import { toast } from "../toast.js";
import { icons } from "../icons.js";

export const adminViews = {
async renderAdminDashboard(initialTab = "overview") {
    this.renderLoader("Loading administrative dashboard...");

    try {
      const statsRes = await api.getAdminStats();
      if (!statsRes.ok) {
        this.renderForbidden();
        return;
      }

      const statsBody = await statsRes.json();
      const overview = statsBody.data?.overview || {};
      const recentActivity = statsBody.data?.recentActivity || [];

      let currentTab = initialTab;

      const renderView = async () => {
        this.appContainer.innerHTML = `
          <div class="admin-layout">
            <aside class="admin-sidebar">
              <div class="admin-sidebar-header">
                <div style="font-weight:700; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
                  
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg> <span>Admin Console</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Platform Management</div>
              </div>

              <button class="admin-nav-item ${currentTab === "overview" ? "active" : ""}" data-tab="overview">
                
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5"></rect>
      <rect x="14" y="3" width="7" height="5" rx="1.5"></rect>
      <rect x="14" y="12" width="7" height="9" rx="1.5"></rect>
      <rect x="3" y="16" width="7" height="5" rx="1.5"></rect>
    </svg> <span>Overview</span>
              </button>
              <button class="admin-nav-item ${currentTab === "organizations" ? "active" : ""}" data-tab="organizations">
                
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 21h18"></path>
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
      <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path>
      <line x1="10" y1="9" x2="14" y2="9"></line>
      <line x1="12" y1="7" x2="12" y2="11"></line>
    </svg> <span>Organizations Queue</span>
                ${overview.pendingOrgVerifications > 0 ? `<span class="badge" style="background:#fee2e2; color:#991b1b; margin-left:auto;">${overview.pendingOrgVerifications}</span>` : ""}
              </button>
              <button class="admin-nav-item ${currentTab === "users" ? "active" : ""}" data-tab="users">
                
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg> <span>Users Directory</span>
              </button>
              <button class="admin-nav-item ${currentTab === "requests" ? "active" : ""}" data-tab="requests">
                
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
    </svg> <span>Blood Requests</span>
                ${overview.pendingBloodRequests > 0 ? `<span class="badge" style="background:#fef9c3; color:#854d0e; margin-left:auto;">${overview.pendingBloodRequests}</span>` : ""}
              </button>
              <button class="admin-nav-item ${currentTab === "fraud" ? "active" : ""}" data-tab="fraud">
                
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg> <span>Fraud Alerts</span>
                ${overview.openFraudAlerts > 0 ? `<span class="badge" style="background:#fee2e2; color:#dc2626; margin-left:auto;">${overview.openFraudAlerts}</span>` : ""}
              </button>
              <button class="admin-nav-item ${currentTab === "audit" ? "active" : ""}" data-tab="audit">
                
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg> <span>Audit Logs</span>
              </button>
              <button class="admin-nav-item ${currentTab === "analytics" ? "active" : ""}" data-tab="analytics">
                
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg> <span>Reports & Analytics</span>
              </button>
            </aside>

            <main class="admin-main" id="adminTabContent">
              <div class="spinner" style="margin:40px auto;"></div>
            </main>
          </div>
          <div id="adminActionModalContainer"></div>
        `;

        // Bind sidebar tabs
        document.querySelectorAll(".admin-nav-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            currentTab = btn.getAttribute("data-tab");
            document.querySelectorAll(".admin-nav-item").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            loadTabContent(currentTab);
          });
        });

        await loadTabContent(currentTab);
      };

      const loadTabContent = async (tab) => {
        const contentContainer = document.getElementById("adminTabContent");
        if (!contentContainer) return;

        if (tab === "overview") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">System Overview</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Real-time metrics, platform growth, and pending verification actions.
                </p>
              </div>
            </div>

            <div class="stat-cards-grid">
              <div class="stat-card">
                <div class="stat-card-title">Total Users</div>
                <div class="stat-card-value">${overview.totalUsers || 0}</div>
                <div class="stat-card-sub">${overview.totalDonors || 0} Active Accounts</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-title">Pending Org Verifications</div>
                <div class="stat-card-value" style="color:${overview.pendingOrgVerifications > 0 ? "var(--red)" : "inherit"};">
                  ${overview.pendingOrgVerifications || 0}
                </div>
                <div class="stat-card-sub">Requires admin review</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-title">Active Blood Requests</div>
                <div class="stat-card-value">${overview.activeBloodRequests || 0}</div>
                <div class="stat-card-sub">${overview.pendingBloodRequests || 0} Pending Verification</div>
              </div>
              <div class="stat-card">
                <div class="stat-card-title">Approved Blood Banks</div>
                <div class="stat-card-value">${overview.totalBloodBanks || 0}</div>
                <div class="stat-card-sub">Verified institutions</div>
              </div>
            </div>

            <div class="admin-table-card">
              <div class="admin-table-header">
                <strong>Recent Administrative & Platform Activity</strong>
              </div>
              ${recentActivity.length === 0 ? `
                <div style="padding:28px; text-align:center; color:var(--text-muted);">No activity recorded yet.</div>
              ` : `
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Admin / Actor</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Reason / Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentActivity.map((log) => `
                      <tr>
                        <td>${new Date(log.createdAt).toLocaleString()}</td>
                        <td><strong>${log.actorEmail}</strong></td>
                        <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${log.action}</span></td>
                        <td>${log.entityType}</td>
                        <td>${log.reason || "N/A"}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              `}
            </div>
          `;
        } else if (tab === "organizations") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Organization Verifications</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Review healthcare institutions, blood banks, and organizers before granting publishing privileges.
                </p>
              </div>
              <div style="display:flex; gap:8px;">
                <select id="orgStatusFilter" class="filter-select">
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING" selected>Pending Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
            <div id="orgQueueTableContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchOrgs = async () => {
            const status = document.getElementById("orgStatusFilter")?.value || "PENDING";
            const res = await api.getAdminOrganizations({ status });
            const data = await res.json();
            const orgs = data.data?.items || [];
            const container = document.getElementById("orgQueueTableContainer");
            if (!container) return;

            if (orgs.length === 0) {
              container.innerHTML = `<div class="auth-card" style="text-align:center; margin:30px auto;">No organizations match the selected filter.</div>`;
              return;
            }

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Organization</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>License No.</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orgs.map((o) => `
                      <tr>
                        <td>
                          <strong>${o.name}</strong><br>
                          <span style="font-size:0.75rem; color:var(--text-muted);">${o.contactEmail}</span>
                        </td>
                        <td><span class="badge">${o.type}</span></td>
                        <td>${o.address?.city || "N/A"}, ${o.address?.state || ""}</td>
                        <td>${o.licenseNumber || "Not Provided"}</td>
                        <td><span class="status-badge status-${o.verificationStatus || (o.isVerified ? "APPROVED" : "PENDING")}">${o.verificationStatus || "PENDING"}</span></td>
                        <td>
                          <button class="button verify-org-btn" data-id="${o._id || o.id}" style="padding:6px 12px; font-size:0.8rem;">Review</button>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;

            document.querySelectorAll(".verify-org-btn").forEach((b) => {
              b.addEventListener("click", () => {
                const id = b.getAttribute("data-id");
                const org = orgs.find((item) => (item._id || item.id) === id);
                if (org) openOrgReviewModal(org, fetchOrgs);
              });
            });
          };

          document.getElementById("orgStatusFilter")?.addEventListener("change", fetchOrgs);
          fetchOrgs();
        } else if (tab === "users") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">User Directory</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Manage platform users, inspect account statuses, and moderate suspensions.
                </p>
              </div>
            </div>
            <div id="usersTableContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchUsers = async () => {
            const res = await api.getAdminUsers();
            const data = await res.json();
            const users = data.data?.items || [];
            const container = document.getElementById("usersTableContainer");
            if (!container) return;

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Account Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${users.map((u) => `
                      <tr>
                        <td>
                          <strong>${u.fullName}</strong><br>
                          <span style="font-size:0.75rem; color:var(--text-muted);">${u.email}</span>
                        </td>
                        <td>${u.platformRoles?.includes("ADMIN") ? `<span class="badge" style="background:#e0f2fe; color:#0369a1;">ADMIN</span>` : `<span class="badge">USER</span>`}</td>
                        <td><span class="badge ${u.accountStatus === "ACTIVE" ? "badge-active" : ""}">${u.accountStatus}</span></td>
                        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          ${u.accountStatus === "ACTIVE" ? `
                            <button class="button button-outline suspend-user-btn" data-id="${u._id || u.id}" style="color:#dc2626; border-color:#fecaca; padding:6px 12px; font-size:0.8rem;">Suspend</button>
                          ` : `
                            <button class="button reactivate-user-btn" data-id="${u._id || u.id}" style="padding:6px 12px; font-size:0.8rem;">Reactivate</button>
                          `}
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;

            document.querySelectorAll(".suspend-user-btn").forEach((b) => {
              b.addEventListener("click", async () => {
                const id = b.getAttribute("data-id");
                const reason = prompt("Enter mandatory reason for suspending this user:");
                if (reason && reason.trim()) {
                  await api.updateUserAccountStatus(id, "SUSPENDED", reason.trim());
                  fetchUsers();
                }
              });
            });

            document.querySelectorAll(".reactivate-user-btn").forEach((b) => {
              b.addEventListener("click", async () => {
                const id = b.getAttribute("data-id");
                if (confirm("Reactivate this user account?")) {
                  await api.updateUserAccountStatus(id, "ACTIVE", "Administrative reactivation");
                  fetchUsers();
                }
              });
            });
          };

          fetchUsers();
        } else if (tab === "requests") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Blood Requests Moderation</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Oversee all public and emergency blood requests, verify hospital bed orders, and prevent fraud.
                </p>
              </div>
            </div>
            <div id="adminRequestsContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchRequests = async () => {
            const res = await api.getAdminBloodRequests();
            const data = await res.json();
            const requests = data.data?.items || [];
            const container = document.getElementById("adminRequestsContainer");
            if (!container) return;

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Req Number</th>
                      <th>Group & Component</th>
                      <th>Units</th>
                      <th>Hospital</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${requests.map((r) => `
                      <tr>
                        <td><strong>${r.requestNumber}</strong></td>
                        <td>${r.bloodGroup} (${r.component?.replace(/_/g, " ")})</td>
                        <td>${r.unitsRequired}</td>
                        <td>${r.hospitalName}</td>
                        <td><span class="urgency-badge urgency-${r.urgency}">${r.urgency}</span></td>
                        <td><span class="status-badge status-${r.status}">${r.status}</span></td>
                        <td>
                          <a href="#/requests/${r._id || r.id}" class="button" style="padding:6px 12px; font-size:0.8rem;">Inspect</a>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;
          };

          fetchRequests();
        } else if (tab === "fraud") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Fraud & Suspicious Activity Alerts</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Detect and resolve rapid repeated submissions, high quantity anomalies, and flagged accounts.
                </p>
              </div>
            </div>
            <div id="fraudAlertsContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchAlerts = async () => {
            const res = await api.getAdminFraudAlerts();
            const data = await res.json();
            const alerts = data.data?.items || [];
            const container = document.getElementById("fraudAlertsContainer");
            if (!container) return;

            if (alerts.length === 0) {
              container.innerHTML = `<div class="auth-card" style="text-align:center; margin:30px auto;">No open fraud alerts. System integrity is healthy.</div>`;
              return;
            }

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Severity</th>
                      <th>Title</th>
                      <th>Entity</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${alerts.map((a) => `
                      <tr>
                        <td><span class="badge" style="background:${a.severity === "CRITICAL" ? "#fee2e2" : "#fef9c3"}; color:${a.severity === "CRITICAL" ? "#991b1b" : "#854d0e"};">${a.severity}</span></td>
                        <td><strong>${a.title}</strong></td>
                        <td>${a.entityType}</td>
                        <td style="max-width:300px;">${a.description}</td>
                        <td><span class="badge">${a.status}</span></td>
                        <td>
                          <button class="button resolve-alert-btn" data-id="${a._id || a.id}" style="padding:6px 12px; font-size:0.8rem;">Resolve</button>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;

            document.querySelectorAll(".resolve-alert-btn").forEach((b) => {
              b.addEventListener("click", async () => {
                const id = b.getAttribute("data-id");
                const note = prompt("Enter resolution notes:");
                if (note) {
                  await api.resolveFraudAlert(id, "RESOLVED", note);
                  fetchAlerts();
                }
              });
            });
          };

          fetchAlerts();
        } else if (tab === "audit") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Administrative Audit Trail</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Immutable record of all verification decisions, privilege executions, and suspensions.
                </p>
              </div>
            </div>
            <div id="auditLogsContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          const fetchLogs = async () => {
            const res = await api.getAdminAuditLogs();
            const data = await res.json();
            const logs = data.data?.items || [];
            const container = document.getElementById("auditLogsContainer");
            if (!container) return;

            container.innerHTML = `
              <div class="admin-table-card">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Admin Email</th>
                      <th>Action</th>
                      <th>Entity Type</th>
                      <th>Entity ID</th>
                      <th>Reason / Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${logs.map((l) => `
                      <tr>
                        <td>${new Date(l.createdAt).toLocaleString()}</td>
                        <td><strong>${l.actorEmail}</strong></td>
                        <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${l.action}</span></td>
                        <td>${l.entityType}</td>
                        <td><code>${l.entityId || "N/A"}</code></td>
                        <td>${l.reason || "N/A"}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;
          };

          fetchLogs();
        } else if (tab === "analytics") {
          contentContainer.innerHTML = `
            <div class="admin-header-row">
              <div>
                <h1 style="margin:0 0 6px 0; font-size:1.75rem;">Reports & Analytics</h1>
                <p style="margin:0; color:var(--text-muted); font-size:0.92rem;">
                  Interactive platform trends, demand distribution, fulfillment performance, and secure CSV data export.
                </p>
              </div>
              <div>
                <button id="exportCsvBtn" class="button" style="padding:8px 16px; font-size:0.88rem;">
                  
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg> <span>Export Requests CSV</span>
                </button>
              </div>
            </div>

            <div class="date-filter-bar">
              <span style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">Date Range:</span>
              <button class="button button-outline date-range-btn active" data-range="30d" style="padding:6px 12px; font-size:0.82rem;">Last 30 Days</button>
              <button class="button button-outline date-range-btn" data-range="7d" style="padding:6px 12px; font-size:0.82rem;">Last 7 Days</button>
              <button class="button button-outline date-range-btn" data-range="90d" style="padding:6px 12px; font-size:0.82rem;">Last 90 Days</button>
              <button class="button button-outline date-range-btn" data-range="thisYear" style="padding:6px 12px; font-size:0.82rem;">This Year</button>

              <label style="margin-left:auto; display:flex; align-items:center; gap:8px; font-size:0.84rem; cursor:pointer;">
                <input type="checkbox" id="excludeDemoCheck" checked>
                <span>Exclude Demo Records</span>
              </label>
            </div>

            <div id="analyticsContentContainer"><div class="spinner" style="margin:40px auto;"></div></div>
          `;

          let selectedRange = "30d";

          const fetchAnalytics = async () => {
            const container = document.getElementById("analyticsContentContainer");
            if (!container) return;
            container.innerHTML = `<div class="spinner" style="margin:40px auto;"></div>`;

            const excludeDemo = document.getElementById("excludeDemoCheck")?.checked !== false;
            const res = await api.getAdminReportsOverview({ range: selectedRange, excludeDemo });
            const data = await res.json();
            const report = data.data || {};
            const kpis = report.kpis || {};
            const bloodGroups = report.requestsByBloodGroup || [];
            const components = report.requestsByComponent || [];
            const statusBreakdown = report.requestsByStatus || [];

            // Find maximum count for proportional bar scaling
            const maxGroupCount = Math.max(...bloodGroups.map(g => g.count), 1);
            const maxComponentCount = Math.max(...components.map(c => c.count), 1);

            container.innerHTML = `
              <div class="stat-cards-grid">
                <div class="stat-card">
                  <div class="stat-card-title">Fulfillment Rate</div>
                  <div class="stat-card-value" style="color:var(--success);">${kpis.fulfillmentRate || 0}%</div>
                  <div class="stat-card-sub">${kpis.fulfilledRequests || 0} of ${kpis.totalRequests || 0} Requests</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-title">Total Units Required</div>
                  <div class="stat-card-value">${kpis.totalUnitsRequired || 0}</div>
                  <div class="stat-card-sub">${kpis.totalUnitsFulfilled || 0} Units Fulfilled</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-title">New Users Registered</div>
                  <div class="stat-card-value">${kpis.newUsers || 0}</div>
                  <div class="stat-card-sub">In selected timeframe</div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-title">Active Requests</div>
                  <div class="stat-card-value" style="color:var(--red);">${kpis.activeRequests || 0}</div>
                  <div class="stat-card-sub">${kpis.pendingVerificationRequests || 0} Awaiting Verification</div>
                </div>
              </div>

              <div class="analytics-grid">
                <div class="chart-card">
                  <div class="chart-header">
                    <div>
                      <div class="chart-title">Demand by Blood Group</div>
                      <div class="chart-subtitle">Distribution of requests by blood group</div>
                    </div>
                  </div>
                  <div class="bar-chart-container">
                    ${bloodGroups.length === 0 ? `
                      <div style="padding:24px; text-align:center; color:var(--text-muted);">No request data in this range.</div>
                    ` : bloodGroups.map(g => `
                      <div class="bar-chart-row">
                        <div class="bar-chart-label">${g.bloodGroup}</div>
                        <div class="bar-chart-track">
                          <div class="bar-chart-fill" style="width:${Math.round((g.count / maxGroupCount) * 100)}%;"></div>
                        </div>
                        <div class="bar-chart-value">${g.count} <span style="font-size:0.75rem; font-weight:normal; color:var(--text-muted);">(${g.units}u)</span></div>
                      </div>
                    `).join("")}
                  </div>
                </div>

                <div class="chart-card">
                  <div class="chart-header">
                    <div>
                      <div class="chart-title">Demand by Component</div>
                      <div class="chart-subtitle">Distribution of requested blood components</div>
                    </div>
                  </div>
                  <div class="bar-chart-container">
                    ${components.length === 0 ? `
                      <div style="padding:24px; text-align:center; color:var(--text-muted);">No component data in this range.</div>
                    ` : components.map(c => `
                      <div class="bar-chart-row">
                        <div class="bar-chart-label" style="width:120px;">${c.component.replace(/_/g, " ")}</div>
                        <div class="bar-chart-track">
                          <div class="bar-chart-fill" style="background:#0369a1; width:${Math.round((c.count / maxComponentCount) * 100)}%;"></div>
                        </div>
                        <div class="bar-chart-value">${c.count} <span style="font-size:0.75rem; font-weight:normal; color:var(--text-muted);">(${c.units}u)</span></div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>

              <div class="admin-table-card">
                <div class="admin-table-header">
                  <strong>Lifecycle Status Breakdown</strong>
                </div>
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Status Category</th>
                      <th>Request Count</th>
                      <th>Percentage of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${statusBreakdown.length === 0 ? `
                      <tr><td colspan="3" style="text-align:center;">No records available.</td></tr>
                    ` : statusBreakdown.map(s => `
                      <tr>
                        <td><span class="status-badge status-${s.status}">${s.status}</span></td>
                        <td><strong>${s.count}</strong></td>
                        <td>${kpis.totalRequests > 0 ? ((s.count / kpis.totalRequests) * 100).toFixed(1) : 0}%</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `;
          };

          // Bind range filter buttons
          document.querySelectorAll(".date-range-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              selectedRange = btn.getAttribute("data-range");
              document.querySelectorAll(".date-range-btn").forEach(b => b.classList.remove("active"));
              btn.classList.add("active");
              fetchAnalytics();
            });
          });

          document.getElementById("excludeDemoCheck")?.addEventListener("change", fetchAnalytics);

          // Handle secure CSV export trigger
          document.getElementById("exportCsvBtn")?.addEventListener("click", () => {
            const excludeDemo = document.getElementById("excludeDemoCheck")?.checked !== false;
            const exportUrl = api.getAdminExportCsvUrl({ range: selectedRange, excludeDemo });
            window.open(exportUrl, "_blank");
          });

          fetchAnalytics();
        }
      };

      const openOrgReviewModal = (org, onUpdate) => {
        const container = document.getElementById("adminActionModalContainer");
        if (!container) return;

        container.innerHTML = `
          <div class="modal-backdrop" id="orgModalBackdrop">
            <div class="modal-content" onclick="event.stopPropagation()">
              <h2 style="margin:0 0 6px 0;">Verify Organization</h2>
              <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:16px;">
                Review registered credentials and verification status for <strong>${org.name}</strong>.
              </p>

              <div style="background:#f8fafc; border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:20px; font-size:0.88rem;">
                <div><strong>Type:</strong> ${org.type}</div>
                <div><strong>Official Contact:</strong> ${org.contactEmail}</div>
                <div><strong>Phone:</strong> ${org.phoneNumber || "Not provided"}</div>
                <div><strong>Address:</strong> ${org.address?.city || "N/A"}, ${org.address?.state || ""} — ${org.address?.pincode || ""}</div>
                <div><strong>License Number:</strong> ${org.licenseNumber || "N/A"}</div>
              </div>

              <div style="display:flex; flex-direction:column; gap:12px;">
                <label class="filter-label" for="orgRejectionReason">Rejection Reason (Mandatory if rejecting)</label>
                <textarea id="orgRejectionReason" class="filter-input" style="height:70px;" placeholder="Provide explicit reason if rejecting..."></textarea>
              </div>

              <div id="orgModalError" style="color:#dc2626; font-size:0.85rem; margin-top:10px; display:none;"></div>

              <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
                <button type="button" id="closeOrgModalBtn" class="button button-outline">Cancel</button>
                <button type="button" id="rejectOrgBtn" class="button button-outline" style="color:#dc2626; border-color:#fecaca;">Reject</button>
                <button type="button" id="approveOrgBtn" class="button">Approve</button>
              </div>
            </div>
          </div>
        `;

        const close = () => { container.innerHTML = ""; };
        document.getElementById("closeOrgModalBtn")?.addEventListener("click", close);
        document.getElementById("orgModalBackdrop")?.addEventListener("click", close);

        document.getElementById("approveOrgBtn")?.addEventListener("click", async () => {
          try {
            await api.verifyOrganization(org._id || org.id, "APPROVED");
            close();
            onUpdate();
          } catch (err) {
            const errBox = document.getElementById("orgModalError");
            if (errBox) {
              errBox.textContent = err.message;
              errBox.style.display = "block";
            }
          }
        });

        document.getElementById("rejectOrgBtn")?.addEventListener("click", async () => {
          const reason = document.getElementById("orgRejectionReason")?.value?.trim();
          if (!reason) {
            const errBox = document.getElementById("orgModalError");
            if (errBox) {
              errBox.textContent = "A rejection reason is mandatory when rejecting an organization.";
              errBox.style.display = "block";
            }
            return;
          }

          try {
            await api.verifyOrganization(org._id || org.id, "REJECTED", reason);
            close();
            onUpdate();
          } catch (err) {
            const errBox = document.getElementById("orgModalError");
            if (errBox) {
              errBox.textContent = err.message;
              errBox.style.display = "block";
            }
          }
        });
      };

      await renderView();
    } catch (err) {
      this.renderForbidden();
    }
  },

  renderForbidden() {
    this.appContainer.innerHTML = `
      <div class="auth-card" style="max-width:480px;">
        <div style="margin-bottom:14px; color:var(--red); display:flex; justify-content:center;">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
    </svg></div>
        <h2>Access Denied</h2>
        <p class="subtitle" style="margin-bottom:20px;">
          You do not have administrative permissions to view this section.
        </p>
        <a href="#/profile" class="button">Return to Profile</a>
      </div>
    `;
  }

  // --- Phase 11 Blood Request Views ---
};
