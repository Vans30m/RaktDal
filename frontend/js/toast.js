/**
 * Lightweight Toast Notification Service for RaktDal
 */
class ToastService {
  constructor() {
    this.container = null;
  }

  ensureContainer() {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      this.container.setAttribute("aria-live", "polite");
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  show({ title, message, type = "info", duration = 4000 }) {
    const container = this.ensureContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const iconMap = {
      success: "✅",
      error: "⚠️",
      info: "ℹ️"
    };

    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type] || "ℹ️"}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ""}
        <div class="toast-desc">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    let timer = null;

    const dismiss = () => {
      if (timer) clearTimeout(timer);
      toast.classList.add("toast-hiding");
      setTimeout(() => {
        toast.remove();
      }, 300);
    };

    closeBtn.addEventListener("click", dismiss);
    if (duration > 0) {
      timer = setTimeout(dismiss, duration);
    }

    container.appendChild(toast);
  }

  success(message, title = "Success") {
    this.show({ title, message, type: "success" });
  }

  error(message, title = "Error") {
    this.show({ title, message, type: "error" });
  }

  info(message, title = "Notice") {
    this.show({ title, message, type: "info" });
  }
}

export const toast = new ToastService();

