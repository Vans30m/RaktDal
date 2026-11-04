/**
 * Homepage Multi-Section Component for RaktDal
 * Modern, responsive healthcare landing page with complete i18n support
 */
import { t } from "./i18n/i18n.js";

export const homeViews = {
  getHeroIllustrationSvg() {
    return `
      <svg class="hero-illustration-svg" viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Illustration representing blood donation coordination">
        <defs>
          <linearGradient id="heroCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#f8fafc"/>
          </linearGradient>
          <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#dc2626"/>
            <stop offset="100%" stop-color="#991b1b"/>
          </linearGradient>
          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.2"/>
            <stop offset="50%" stop-color="#b91c1c" stop-opacity="1"/>
            <stop offset="100%" stop-color="#ef4444" stop-opacity="0.2"/>
          </linearGradient>
          <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.08"/>
          </filter>
        </defs>

        <!-- Background Glow Elements -->
        <circle class="anim-glow-pulse" cx="270" cy="225" r="180" fill="#fef2f2" opacity="0.8"/>
        <circle class="anim-glow-pulse-secondary" cx="430" cy="90" r="75" fill="#fee2e2" opacity="0.6"/>
        <circle class="anim-glow-pulse" cx="100" cy="340" r="95" fill="#fef2f2" opacity="0.7"/>

        <!-- Flowing Heartbeat Line -->
        <path class="anim-heartbeat-line" d="M 30 220 L 120 220 L 140 190 L 160 260 L 190 140 L 220 280 L 245 190 L 265 235 L 285 220 L 510 220" 
              stroke="url(#pulseGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Main Medical Coordination Tablet / Visual Card -->
        <rect class="hero-card-base" x="85" y="55" width="370" height="340" rx="22" fill="url(#heroCardGrad)" stroke="#e2e8f0" stroke-width="1.5" filter="url(#cardShadow)"/>
        
        <!-- Header bar in visual card -->
        <rect x="85" y="55" width="370" height="54" rx="22" fill="#ffffff"/>
        <line x1="85" y1="109" x2="455" y2="109" stroke="#f1f5f9" stroke-width="1.5"/>
        <circle cx="115" cy="82" r="6" fill="#ef4444"/>
        <circle cx="135" cy="82" r="6" fill="#f59e0b"/>
        <circle cx="155" cy="82" r="6" fill="#10b981"/>
        <rect x="190" y="76" width="160" height="12" rx="6" fill="#f1f5f9"/>

        <!-- Floating Badge TOP RIGHT: Emergency Needs -->
        <g class="anim-badge-float-1" transform="translate(325, 115)" filter="url(#cardShadow)">
          <rect width="170" height="56" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <circle cx="28" cy="28" r="15" fill="#fef2f2"/>
          <path class="anim-pulse-emergency" d="M28 20 L28 29 M28 34 L28 36" stroke="#b91c1c" stroke-width="2.5" stroke-linecap="round"/>
          <text x="52" y="24" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#1e293b">${t("hero.emergencyNeedsBadge")}</text>
          <text x="52" y="40" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#64748b">${t("hero.instantCoordination")}</text>
        </g>

        <!-- Floating Badge TOP LEFT: Verified Donors -->
        <g class="anim-badge-float-2" transform="translate(45, 140)" filter="url(#cardShadow)">
          <rect width="170" height="56" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <circle cx="28" cy="28" r="15" fill="#f0fdf4"/>
          <path d="M22 28 L27 33 L35 23" stroke="#15803d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="52" y="24" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#1e293b">${t("hero.verifiedDonorsBadge")}</text>
          <text x="52" y="40" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#64748b">${t("hero.panIndiaSupport")}</text>
        </g>

        <!-- Center Glowing Blood Drop Icon -->
        <g class="anim-drop-pulse" transform="translate(270, 215)">
          <circle class="anim-drop-halo-1" cx="0" cy="9" r="54" fill="#fee2e2" opacity="0.7"/>
          <circle class="anim-drop-halo-2" cx="0" cy="9" r="42" fill="#fecaca" opacity="0.8"/>
          <!-- Blood drop path -->
          <path d="M0 -28 C14 -8 24 8 24 22 C24 35 13 46 0 46 C-13 46 -24 35 -24 22 C-24 8 -14 -8 0 -28 Z" fill="url(#dropGrad)"/>
          <!-- Reflection -->
          <path d="M-8 10 C-4 2 -1 -3 3 -12 C0 -6 -2 3 -4 14 C-5 18 -9 18 -8 10 Z" fill="#ffffff" opacity="0.45"/>
          <!-- Inner cross -->
          <path d="M-4 16 L4 16 M0 12 L0 20" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
        </g>

        <!-- Blood Type Chips at Bottom of Card -->
        <g class="anim-chips-container" transform="translate(130, 325)">
          <g class="anim-chip-item anim-chip-highlight">
            <rect x="0" y="0" width="48" height="32" rx="9" fill="#fef2f2" stroke="#fecaca"/>
            <text x="24" y="21" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#b91c1c" text-anchor="middle">O+</text>
          </g>

          <g class="anim-chip-item">
            <rect x="58" y="0" width="48" height="32" rx="9" fill="#ffffff" stroke="#e2e8f0"/>
            <text x="82" y="21" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">A+</text>
          </g>

          <g class="anim-chip-item">
            <rect x="116" y="0" width="48" height="32" rx="9" fill="#ffffff" stroke="#e2e8f0"/>
            <text x="140" y="21" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">B+</text>
          </g>

          <g class="anim-chip-item">
            <rect x="174" y="0" width="48" height="32" rx="9" fill="#ffffff" stroke="#e2e8f0"/>
            <text x="198" y="21" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">AB+</text>
          </g>

          <g class="anim-chip-item">
            <rect x="232" y="0" width="58" height="32" rx="9" fill="#f1f5f9" stroke="#e2e8f0"/>
            <text x="261" y="20" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">${t("hero.moreBloodGroups")}</text>
          </g>
        </g>
      </svg>
    `;
  },

  getHomeHtml() {
    return `
      <div class="landing-page-wrapper">
        <!-- SECTION 1: HERO -->
        <section class="landing-section hero-landing" aria-labelledby="heroHeadline">
          <div class="landing-container hero-grid">
            <div class="hero-content-col scroll-reveal">
              <span class="landing-eyebrow">
                <span class="eyebrow-dot"></span>
                ${t("hero.eyebrow")}
              </span>
              <h1 id="heroHeadline" class="hero-title">
                ${t("hero.title")} <span class="text-accent">${t("hero.titleAccent")}</span>
              </h1>
              <p class="hero-supporting-text">
                ${t("hero.subtitle")}
              </p>
              <div class="hero-cta-group">
                <a href="#/find-blood" class="button button-lg button-primary shadow-hover">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  ${t("hero.findDonorsBtn")}
                </a>
                <a href="#/donor/register" class="button button-lg button-secondary shadow-hover">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                  ${t("hero.becomeDonorBtn")}
                </a>
              </div>
              <div class="hero-disclaimer-card">
                <svg class="disclaimer-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>
                  <strong>${t("hero.noticeTitle")}</strong> ${t("hero.noticeText")}
                </span>
              </div>
            </div>
            
            <div class="hero-visual-col scroll-reveal delay-1">
              ${this.getHeroIllustrationSvg()}
            </div>
          </div>
        </section>

        <!-- SECTION 2: HOW RAKTDAL WORKS -->
        <section class="landing-section section-how-it-works bg-surface-alt" aria-labelledby="howItWorksHeading">
          <div class="landing-container">
            <div class="section-header-center scroll-reveal">
              <span class="section-badge">${t("howItWorks.tag")}</span>
              <h2 id="howItWorksHeading" class="section-heading">${t("howItWorks.heading")}</h2>
              <p class="section-subheading">
                ${t("howItWorks.subtitle")}
              </p>
            </div>

            <div class="how-cards-grid">
              <!-- Card 1 -->
              <div class="feature-card scroll-reveal stagger-1">
                <div class="card-step-badge">01</div>
                <div class="card-icon-bubble">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 class="card-title">${t("howItWorks.step1Title")}</h3>
                <p class="card-text">
                  ${t("howItWorks.step1Desc")}
                </p>
              </div>

              <!-- Card 2 -->
              <div class="feature-card scroll-reveal stagger-2">
                <div class="card-step-badge">02</div>
                <div class="card-icon-bubble">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h3 class="card-title">${t("howItWorks.step2Title")}</h3>
                <p class="card-text">
                  ${t("howItWorks.step2Desc")}
                </p>
              </div>

              <!-- Card 3 -->
              <div class="feature-card scroll-reveal stagger-3">
                <div class="card-step-badge">03</div>
                <div class="card-icon-bubble">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M19 8v6"></path>
                    <path d="M22 11h-6"></path>
                  </svg>
                </div>
                <h3 class="card-title">${t("howItWorks.step3Title")}</h3>
                <p class="card-text">
                  ${t("howItWorks.step3Desc")}
                </p>
              </div>

              <!-- Card 4 -->
              <div class="feature-card scroll-reveal stagger-4">
                <div class="card-step-badge">04</div>
                <div class="card-icon-bubble">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 class="card-title">${t("howItWorks.step4Title")}</h3>
                <p class="card-text">
                  ${t("howItWorks.step4Desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 3: EXPLORE RAKTDAL -->
        <section class="landing-section section-explore" aria-labelledby="exploreHeading">
          <div class="landing-container">
            <div class="section-header-center scroll-reveal">
              <span class="section-badge">${t("explore.tag")}</span>
              <h2 id="exploreHeading" class="section-heading">${t("explore.heading")}</h2>
              <p class="section-subheading">
                ${t("explore.subtitle")}
              </p>
            </div>

            <div class="explore-grid">
              <!-- Card 1 -->
              <div class="explore-card scroll-reveal stagger-1">
                <div class="explore-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 class="explore-title">${t("explore.card1Title")}</h3>
                <p class="explore-desc">
                  ${t("explore.card1Desc")}
                </p>
                <a href="#/find-blood" class="explore-link">
                  <span>${t("explore.card1Link")}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>

              <!-- Card 2 -->
              <div class="explore-card scroll-reveal stagger-2">
                <div class="explore-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <h3 class="explore-title">${t("explore.card2Title")}</h3>
                <p class="explore-desc">
                  ${t("explore.card2Desc")}
                </p>
                <a href="#/requests" class="explore-link">
                  <span>${t("explore.card2Link")}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>

              <!-- Card 3 -->
              <div class="explore-card scroll-reveal stagger-3">
                <div class="explore-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <h3 class="explore-title">${t("explore.card3Title")}</h3>
                <p class="explore-desc">
                  ${t("explore.card3Desc")}
                </p>
                <a href="#/blood-banks" class="explore-link">
                  <span>${t("explore.card3Link")}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>

              <!-- Card 4 -->
              <div class="explore-card scroll-reveal stagger-4">
                <div class="explore-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3 class="explore-title">${t("explore.card4Title")}</h3>
                <p class="explore-desc">
                  ${t("explore.card4Desc")}
                </p>
                <a href="#/camps" class="explore-link">
                  <span>${t("explore.card4Link")}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 4: COMMUNITY CTA -->
        <section class="landing-section section-cta" aria-labelledby="ctaHeadline">
          <div class="landing-container">
            <div class="cta-banner-card scroll-reveal">
              <div class="cta-decorative-circle circle-1"></div>
              <div class="cta-decorative-circle circle-2"></div>
              
              <div class="cta-inner-content">
                <span class="cta-tag">${t("cta.tag")}</span>
                <h2 id="ctaHeadline" class="cta-heading">${t("cta.heading")}</h2>
                <p class="cta-supporting-text">
                  ${t("cta.subtitle")}
                </p>
                <div class="cta-buttons-row">
                  <a href="#/donor/register" class="button button-lg button-white shadow-hover">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                    ${t("cta.becomeDonorBtn")}
                  </a>
                  <a href="#/requests" class="button button-lg button-outline-white shadow-hover">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    ${t("cta.exploreRequestsBtn")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  /**
   * Initializes IntersectionObserver for scroll-triggered reveal animations
   */
  getFooterHtml() {
    return `
      <footer class="landing-footer" role="contentinfo">
        <div class="landing-container">
          <div class="footer-columns-grid">
            <!-- Column 1: Brand -->
            <div class="footer-col col-brand">
              <a class="brand brand-light" href="#/" aria-label="RaktDal home">
                <img src="assets/logo-removebg.png" style="height: 32px; width: 32px; object-fit: contain;" alt="RaktDal Logo">
                <span class="brand-text">RaktDal</span>
              </a>
              <p class="footer-about-text">
                ${t("footer.aboutText")}
              </p>
              <div class="footer-badge-box">
                <span class="footer-mini-badge">${t("footer.panIndiaNetwork")}</span>
                <span class="footer-mini-badge">${t("footer.privacyFirst")}</span>
              </div>
            </div>

            <!-- Column 2: Quick Links -->
            <div class="footer-col">
              <h4 class="footer-col-title">${t("footer.quickLinks")}</h4>
              <ul class="footer-nav-list">
                <li><a href="#/">${t("footer.home")}</a></li>
                <li><a href="#/find-blood">${t("footer.findDonors")}</a></li>
                <li><a href="#/requests">${t("footer.bloodRequests")}</a></li>
                <li><a href="#/camps">${t("footer.donationCamps")}</a></li>
                <li><a href="#/donor/register">${t("footer.becomeDonor")}</a></li>
              </ul>
            </div>

            <!-- Column 3: Platform -->
            <div class="footer-col">
              <h4 class="footer-col-title">${t("footer.platform")}</h4>
              <ul class="footer-nav-list">
                <li><a href="#/about">${t("footer.aboutRaktDal")}</a></li>
                <li><a href="#/how-it-works">${t("footer.howItWorks")}</a></li>
                <li><a href="#/blood-banks">${t("footer.bloodBankInventory")}</a></li>
                <li><a href="#/contact">${t("footer.contactUs")}</a></li>
              </ul>
            </div>

            <!-- Column 4: Important Information -->
            <div class="footer-col">
              <h4 class="footer-col-title">${t("footer.importantInfo")}</h4>
              <ul class="footer-nav-list">
                <li><a href="#/privacy">${t("footer.privacyPolicy")}</a></li>
                <li><a href="#/terms">${t("footer.termsAndConditions")}</a></li>
                <li><a href="#/disclaimer">${t("footer.medicalDisclaimer")}</a></li>
                <li><a href="#/help">${t("footer.helpAndSupport")}</a></li>
              </ul>
            </div>
          </div>

          <!-- Footer Medical Disclaimer Notice -->
          <div class="footer-disclaimer-banner">
            <p>
              <strong>${t("footer.medicalDisclaimer")}:</strong> ${t("footer.disclaimerNotice")}
            </p>
          </div>

          <!-- Footer Bottom Bar -->
          <div class="footer-bottom-bar">
            <div class="footer-copyright">
              ${t("footer.copyright")}
            </div>
            <div class="footer-tagline">
              ${t("footer.tagline")}
            </div>
          </div>
        </div>
      </footer>
    `;
  },

  initScrollAnimations(container) {
    if (!container) return;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const reveals = container.querySelectorAll(".scroll-reveal");
      reveals.forEach(el => el.classList.add("revealed"));
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      const revealElements = container.querySelectorAll(".scroll-reveal");
      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback: reveal immediately if IntersectionObserver not supported
      const reveals = container.querySelectorAll(".scroll-reveal");
      reveals.forEach(el => el.classList.add("revealed"));
    }
  }
};
