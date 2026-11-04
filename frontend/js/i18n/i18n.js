/**
 * RaktDal Internationalization (i18n) Core Architecture
 * Vanilla JavaScript implementation supporting:
 * - English (en) - Default
 * - Hindi (hi)
 * - Bengali (bn)
 * - Marathi (mr)
 * - Telugu (te)
 * - Tamil (ta)
 */

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", locale: "en-IN", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", locale: "hi-IN", dir: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", locale: "bn-IN", dir: "ltr" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", locale: "mr-IN", dir: "ltr" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", locale: "te-IN", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", locale: "ta-IN", dir: "ltr" }
];

export const DEFAULT_LANGUAGE = "en";
const STORAGE_KEY = "raktdal_language";

class I18nManager {
  constructor() {
    this.currentLanguage = DEFAULT_LANGUAGE;
    this.translations = {}; // Cache: { en: {...}, hi: {...} }
    this.listeners = new Set();
    this.initialized = false;
  }

  /**
   * Initializes the i18n system: loads saved preference, fetches dictionary, sets html lang
   */
  async init() {
    if (this.initialized) return;

    let savedLang = DEFAULT_LANGUAGE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.some(l => l.code === stored)) {
        savedLang = stored;
      }
    } catch (e) {
      console.warn("[i18n] localStorage access error, falling back to default:", e);
    }

    // Always preload default language for robust fallback
    await this.loadLocale(DEFAULT_LANGUAGE);

    if (savedLang !== DEFAULT_LANGUAGE) {
      await this.loadLocale(savedLang);
    }

    this.currentLanguage = savedLang;
    this.applyDocumentLanguage(savedLang);
    this.initialized = true;
  }

  /**
   * Loads a locale dictionary into cache if not already present
   */
  async loadLocale(code) {
    if (this.translations[code]) {
      return this.translations[code];
    }

    try {
      // Dynamic import or fetch based on path
      // Because this is a static client, fetching json from locales/ is clean and cacheable
      const res = await fetch(`./js/i18n/locales/${code}.json`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} loading locale ${code}`);
      }
      const data = await res.json();
      this.translations[code] = data;
      return data;
    } catch (err) {
      console.error(`[i18n] Failed to load locale ${code}:`, err);
      // Fallback: if failed and not English, ensure English is loaded
      if (code !== DEFAULT_LANGUAGE && !this.translations[DEFAULT_LANGUAGE]) {
        await this.loadLocale(DEFAULT_LANGUAGE);
      }
      return this.translations[DEFAULT_LANGUAGE] || {};
    }
  }

  /**
   * Sets current active language, loads its dictionary, updates document lang and notifies listeners
   */
  async setLanguage(langCode) {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === langCode)) {
      console.warn(`[i18n] Unsupported language requested: ${langCode}. Using default.`);
      langCode = DEFAULT_LANGUAGE;
    }

    if (this.currentLanguage === langCode && this.translations[langCode]) {
      return;
    }

    await this.loadLocale(langCode);
    this.currentLanguage = langCode;

    try {
      localStorage.setItem(STORAGE_KEY, langCode);
    } catch (e) {
      console.warn("[i18n] Failed to persist language to localStorage:", e);
    }

    this.applyDocumentLanguage(langCode);
    this.notify(langCode);
  }

  /**
   * Updates <html lang="..."> attribute for accessibility and screen readers
   */
  applyDocumentLanguage(langCode) {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
    document.documentElement.lang = langObj.code;
    document.documentElement.setAttribute("dir", langObj.dir || "ltr");
  }

  /**
   * Returns current active language code (e.g. 'en', 'hi')
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Returns metadata object of current active language
   */
  getCurrentLanguageMeta() {
    return SUPPORTED_LANGUAGES.find(l => l.code === this.currentLanguage) || SUPPORTED_LANGUAGES[0];
  }

  /**
   * Subscribe to language change events
   * @param {Function} callback (newLangCode) => void
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all registered subscribers
   */
  notify(langCode) {
    for (const listener of this.listeners) {
      try {
        listener(langCode);
      } catch (err) {
        console.error("[i18n] Error in language change listener:", err);
      }
    }
  }

  /**
   * Translates a keypath (e.g. "navbar.home") with optional parameter interpolation
   * @param {string} keyPath Dot-notated string key path, e.g. "hero.title"
   * @param {object} [params] Parameters to interpolate, e.g. { count: 5 }
   * @returns {string} Translated string or fallback English string
   */
  t(keyPath, params = {}) {
    if (!keyPath) return "";

    const activeDict = this.translations[this.currentLanguage];
    const fallbackDict = this.translations[DEFAULT_LANGUAGE] || {};

    let val = this.resolveKey(activeDict, keyPath);

    // Fall back to English if not found in active dictionary
    if (val === undefined || val === null) {
      val = this.resolveKey(fallbackDict, keyPath);
    }

    // If still missing, return the keyPath itself
    if (val === undefined || val === null) {
      return keyPath;
    }

    if (typeof val !== "string") {
      return val;
    }

    // Interpolate parameters like {name}, {count}
    if (params && Object.keys(params).length > 0) {
      return val.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return val;
  }

  /**
   * Resolves nested path e.g. "navbar.findDonors"
   */
  resolveKey(obj, path) {
    if (!obj || typeof obj !== "object") return undefined;
    const parts = path.split(".");
    let curr = obj;
    for (const p of parts) {
      if (curr === undefined || curr === null) return undefined;
      curr = curr[p];
    }
    return curr;
  }

  /**
   * Formats a date according to current locale (e.g. en-IN, hi-IN)
   */
  formatDate(dateInput, options = { year: "numeric", month: "short", day: "numeric" }) {
    if (!dateInput) return "";
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(date.getTime())) return "";
    const meta = this.getCurrentLanguageMeta();
    try {
      return new Intl.DateTimeFormat(meta.locale, options).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  }

  /**
   * Formats a number according to current locale (keeps standard digits or locale format)
   */
  formatNumber(num, options = {}) {
    if (num === undefined || num === null || isNaN(num)) return "0";
    const meta = this.getCurrentLanguageMeta();
    try {
      return new Intl.NumberFormat(meta.locale, options).format(num);
    } catch {
      return String(num);
    }
  }
}

export const i18n = new I18nManager();
export const t = (key, params) => i18n.t(key, params);

