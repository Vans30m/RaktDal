/**
 * Production-Grade Notification Service for RaktDal Healthcare Platform
 *
 * Design Architecture:
 * - Minimal, quiet, high-legibility enterprise card layout
 * - Restrained clinical palette (subtle neutral backgrounds, thin border, refined status accents)
 * - Pure Lucide-style SVG micro-icons (16x16, 2px stroke)
 * - Automatic deduplication (suppresses repeated identical messages within 3 seconds)
 * - Non-intrusive 180ms linear-eased transitions
 * - Screen-reader live-region accessibility (WCAG 2.1 AA compliant)
 * - Zero artificial progress bars or decorative frills
 */

class ToastService {
  constructor() {
    this.container = null;
    this.activeToasts = new Set();
    this.recentKeys = new Map();
  }

  ensureContainer() {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      this.container.setAttribute("aria-live", "polite");
      this.container.setAttribute("aria-atomic", "false");
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  /**
   * Dispatches a notification card
   * @param {string|object} options Message string or config object { title, message, type, duration }
   * @param {string} typeFallback
   * @param {number} durationFallback
   */
  show(options, typeFallback = "info", durationFallback = 4200) {
    let title = "";
    let message = "";
    let type = "info";
    let duration = 4200;

    if (typeof options === "string") {
      message = options;
      type = typeFallback;
      duration = durationFallback;
    } else if (options && typeof options === "object") {
      title = options.title || "";
      message = options.message || "";
      type = options.type || "info";
      duration = options.duration ?? 4200;
    }

    if (!message && !title) return;

    // Normalization
    type = ["success", "error", "warning", "info", "urgent"].includes(type) ? type : "info";

    // Deduplication check: prevent identical toast flood within 2.5 seconds
    const dedupKey = `${type}:${title}:${message}`;
    const now = Date.now();
    const lastDispatched = this.recentKeys.get(dedupKey);
    if (lastDispatched && now - lastDispatched < 2500) {
      return;
    }
    this.recentKeys.set(dedupKey, now);

    // Clean up old dedup entries periodically
    if (this.recentKeys.size > 20) {
      for (const [k, time] of this.recentKeys.entries()) {
        if (now - time > 5000) this.recentKeys.delete(k);
      }
    }

    const container = this.ensureContainer();

    // Cap visible active toasts to 4 at a time to prevent viewport clutter
    if (container.children.length >= 4) {
      const oldest = container.firstElementChild;
      if (oldest && typeof oldest._dismiss === "function") {
        oldest._dismiss();
      }
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-item-${type}`;
    toast.setAttribute("role", type === "error" || type === "urgent" ? "alert" : "status");

    // Clean, refined Lucide-standard 16px healthcare micro-icons
    const getIconSvg = (variant) => {
      switch (variant) {
        case "success":
          // Lucide check
          return `<svg class="toast-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
        case "error":
          // Lucide alert-circle
          return `<svg class="toast-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
        case "warning":
        case "urgent":
          // Lucide alert-triangle
          return `<svg class="toast-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
        default:
          // Lucide info
          return `<svg class="toast-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
      }
    };

    // Clean, understated DOM layout
    toast.innerHTML = `
      <div class="toast-leading-icon" aria-hidden="true">
        ${getIconSvg(type)}
      </div>
      <div class="toast-text-wrap">
        ${title ? `<div class="toast-headline">${title}</div>` : ""}
        <div class="toast-copy">${message}</div>
      </div>
      <button class="toast-dismiss-btn" type="button" aria-label="Dismiss notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    let timer = null;
    let isDismissed = false;

    const dismiss = () => {
      if (isDismissed) return;
      isDismissed = true;
      if (timer) clearTimeout(timer);
      toast.classList.add("toast-item-leaving");
      setTimeout(() => {
        toast.remove();
        this.activeToasts.delete(toast);
      }, 180);
    };

    toast._dismiss = dismiss;
    this.activeToasts.add(toast);

    const closeBtn = toast.querySelector(".toast-dismiss-btn");
    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      dismiss();
    });

    if (duration > 0) {
      timer = setTimeout(dismiss, duration);
    }

    container.appendChild(toast);
  }

  success(message, title = "") {
    this.show({ title, message, type: "success" });
  }

  error(message, title = "") {
    this.show({ title, message, type: "error" });
  }

  warning(message, title = "") {
    this.show({ title, message, type: "warning" });
  }

  info(message, title = "") {
    this.show({ title, message, type: "info" });
  }

  urgent(message, title = "Urgent Request") {
    this.show({ title, message, type: "urgent", duration: 7000 });
  }
}

export const toast = new ToastService();

