/**
 * Language Manager & State Synchronization for RaktDal
 * Identical architecture to Xplorism: controls full-page Google Translate via background
 * script, cookies & combo trigger while completely hiding Google UI widgets, banners, and tooltips.
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
  { code: "ur", name: "Urdu", nativeName: "اردو" }
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

  resolveInitialLanguage() {
    // Check googtrans cookie first
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    if (match && match[1]) {
      const parts = decodeURIComponent(match[1]).split("/");
      const targetLang = parts[parts.length - 1];
      if (targetLang && SUPPORTED_LANGUAGES.some(l => l.code === targetLang)) {
        return targetLang;
      }
    }
    const saved = localStorage.getItem(this.storageKey);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    return "en";
  }

  /**
   * Helper to set googtrans cookie across both root path and domain (matching Xplorism)
   */
  setGoogleTranslateCookie(targetLang) {
    try {
      const cookieValue = targetLang === "en" ? "" : `/en/${targetLang}`;
      const expires = targetLang === "en" ? "Thu, 01 Jan 1970 00:00:00 GMT" : "Fri, 31 Dec 2099 23:59:59 GMT";
      const hostname = window.location.hostname;

      // Set cookie on current path & root path
      document.cookie = `googtrans=${cookieValue}; path=/; expires=${expires}`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname}; expires=${expires}`;

      // If domain has multiple segments, also set on root domain
      const hostParts = hostname.split(".");
      if (hostParts.length > 2) {
        const rootDomain = "." + hostParts.slice(-2).join(".");
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${rootDomain}; expires=${expires}`;
      }
    } catch (e) {
      console.warn("Could not set googtrans cookie:", e);
    }
  }

  /**
   * Programmatically trigger Google Translate combo selection without needing page reload
   */
  triggerGoogleTranslateCombo(targetLang) {
    const trigger = () => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        if (combo.value !== targetLang) {
          combo.value = targetLang;
          combo.dispatchEvent(new Event("change", { bubbles: true }));
        }
        return true;
      }
      return false;
    };

    if (!trigger()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (trigger() || attempts >= 25) {
          clearInterval(interval);
        }
      }, 200);
    }
  }

  /**
   * Main setup
   */
  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Ensure hidden mount container exists
    let translateDiv = document.getElementById("google_translate_element");
    if (!translateDiv) {
      translateDiv = document.createElement("div");
      translateDiv.id = "google_translate_element";
      translateDiv.style.display = "none";
      translateDiv.style.visibility = "hidden";
      translateDiv.style.position = "absolute";
      translateDiv.style.top = "-9999px";
      document.body.appendChild(translateDiv);
    }

    // 2. Global init callback for Google Translate
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: INCLUDED_LANG_CODES,
              autoDisplay: false
            },
            "google_translate_element"
          );

          // Once initialized, apply current language if set
          const currentLang = localStorage.getItem(this.storageKey) || "en";
          if (currentLang && currentLang !== "en") {
            this.setGoogleTranslateCookie(currentLang);
            this.triggerGoogleTranslateCombo(currentLang);
          }
        }
      } catch (err) {
        console.warn("Google Translate initialization error:", err);
      }
    };

    // 3. Inject script safely avoiding duplicate injections
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    // 4. MutationObserver to prevent Google Translate from adding inline 'top' style to body/html
    this.observer = new MutationObserver(() => {
      if (document.body && document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.top = "0px";
      }
      if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== "0px") {
        document.documentElement.style.top = "0px";
      }
    });

    if (document.body) {
      this.observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"] });
    }
    if (document.documentElement) {
      this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    }
  }

  setLanguage(newLang) {
    if (!newLang) return;
    this.currentLanguage = newLang;
    localStorage.setItem(this.storageKey, newLang);
    this.setGoogleTranslateCookie(newLang);
    this.triggerGoogleTranslateCombo(newLang);
    this.notifyListeners();
  }

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
    return this.resolveInitialLanguage();
  }
}

export const languageManager = new LanguageManager();

export function useLanguage() {
  return {
    language: languageManager.getCurrentLanguage(),
    setLanguage: (lang) => languageManager.setLanguage(lang),
    t: (key, fallback) => languageManager.t(key, fallback),
    supportedLanguages: SUPPORTED_LANGUAGES
  };
}
