/**
 * Language Manager & State Synchronization for RaktDal
 * Controls full-page Google Translate via background script & cookies
 * while completely suppressing Google default UI widgets, banners, and tooltips.
 */

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ar", name: "Arabic", nativeName: "العربية" }
];

export const INCLUDED_LANG_CODES = SUPPORTED_LANGUAGES.map(l => l.code).join(",");

class LanguageManager {
  constructor() {
    this.listeners = new Set();
    this.storageKey = "raktdal_lang";
    this.currentLanguage = this.resolveInitialLanguage();
    this.observer = null;
    this.isInitialized = false;
  }

  /**
   * Resolves language from cookies or localStorage, falling back to 'en'
   */
  resolveInitialLanguage() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (match) {
      try {
        const parts = decodeURIComponent(match[1]).split("/");
        const lang = parts[parts.length - 1];
        if (lang && SUPPORTED_LANGUAGES.some(l => l.code === lang)) {
          return lang;
        }
      } catch (_e) {}
    }
    const saved = localStorage.getItem(this.storageKey);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    return "en";
  }

  /**
   * Initializes script injection, background element & body lock mutation observer
   */
  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.ensureTranslateContainer();
    this.setupMutationObserver();
    this.injectGoogleTranslateScript();
    this.syncCookieWithCurrentLang();
  }

  /**
   * Ensures the hidden off-screen translate container is mounted
   */
  ensureTranslateContainer() {
    let el = document.getElementById("google_translate_element");
    if (!el) {
      el = document.createElement("div");
      el.id = "google_translate_element";
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
    }
    el.style.cssText = "display: none !important; position: absolute !important; top: -9999px !important; left: -9999px !important; width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;";
  }

  /**
   * Injects the official Google Translate element script once
   */
  injectGoogleTranslateScript() {
    // Setup global callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: "en",
            includedLanguages: INCLUDED_LANG_CODES,
            autoDisplay: false
          }, "google_translate_element");
        }
      } catch (err) {
        console.warn("Google Translate initialization error:", err);
      }
    };

    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }
  }

  /**
   * Lightweight MutationObserver to strictly prevent Google from pushing down body/html
   * with inline 'top' styles or injecting visible banners
   */
  setupMutationObserver() {
    if (this.observer) return;

    const resetStyles = () => {
      if (document.body && document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.top = "0px";
      }
      if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== "0px") {
        document.documentElement.style.top = "0px";
      }
    };

    this.observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "style") {
          resetStyles();
        }
      }
    });

    if (document.body) {
      this.observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    }
    if (document.documentElement) {
      this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    }
  }

  /**
   * Synchronize cookie with current language on load if mismatch
   */
  syncCookieWithCurrentLang() {
    if (this.currentLanguage === "en") {
      this.clearGoogtransCookie();
    } else {
      this.writeGoogtransCookie(this.currentLanguage);
    }
  }

  /**
   * Write host-only and domain cookies for googtrans
   */
  writeGoogtransCookie(langCode) {
    const transVal = `/en/${langCode}`;
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

    // Host-only cookie (path=/) - essential for subdomains like *.onrender.com
    document.cookie = `googtrans=${transVal}; path=/;`;

    // Also set with domain when not running on localhost
    if (!isLocal) {
      document.cookie = `googtrans=${transVal}; path=/; domain=${hostname};`;
      const parts = hostname.split(".");
      if (parts.length > 2 && !hostname.endsWith("onrender.com")) {
        document.cookie = `googtrans=${transVal}; path=/; domain=.${parts.slice(-2).join(".")};`;
      }
    }
  }

  /**
   * Clear googtrans cookie across all domain scopes
   */
  clearGoogtransCookie() {
    const hostname = window.location.hostname;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (!isLocal) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
      const parts = hostname.split(".");
      if (parts.length > 2 && !hostname.endsWith("onrender.com")) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${parts.slice(-2).join(".")};`;
      }
    }
  }

  /**
   * Set target website language and trigger live DOM translation
   */
  setLanguage(langCode) {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === langCode)) {
      langCode = "en";
    }

    this.currentLanguage = langCode;
    localStorage.setItem(this.storageKey, langCode);

    if (langCode === "en") {
      this.clearGoogtransCookie();
    } else {
      this.writeGoogtransCookie(langCode);
    }

    this.notifyListeners();

    // Programmatically dispatch change event to Google Translate combo box
    this.dispatchComboEvent(langCode, 10);
  }

  /**
   * Programmatically finds .goog-te-combo and fires change event, with polling retry
   */
  dispatchComboEvent(langCode, retriesLeft = 10) {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (retriesLeft > 0) {
      setTimeout(() => this.dispatchComboEvent(langCode, retriesLeft - 1), 150);
      return;
    }

    // If change didn't trigger full reload or combo is not yet ready, perform clean reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  /**
   * Fallback translation resolver: returns the key or default string
   */
  t(key, fallback) {
    return fallback !== undefined ? fallback : key;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentLanguage);
      } catch (err) {
        console.error("Language listener error:", err);
      }
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

export const languageManager = new LanguageManager();

/**
 * Hook / Consumer helper for components
 */
export function useLanguage() {
  return {
    language: languageManager.getCurrentLanguage(),
    setLanguage: (lang) => languageManager.setLanguage(lang),
    t: (key, fallback) => languageManager.t(key, fallback),
    supportedLanguages: SUPPORTED_LANGUAGES
  };
}

