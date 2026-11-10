import { icons } from "../icons.js";
import { authState } from "../auth.js";

export const infoViews = {
  renderAbout(container) {
    container.innerHTML = `
      <div class="about-page-container">
        <!-- 1. Hero Section -->
        <section class="about-hero-section" aria-labelledby="aboutHeroHeading">
          <div class="about-hero-inner">
            <div class="about-hero-text">
              <span class="about-badge">
                <span class="about-badge-dot" aria-hidden="true"></span>
                Our Mission &amp; Vision
              </span>
              <h1 id="aboutHeroHeading" class="about-hero-title">
                Bridging the Gap Between <span class="accent-text">Blood Donors</span> and Those in Need.
              </h1>
              <p class="about-hero-sub">
                RaktDal brings donors, hospitals, blood banks and communities together through responsible technology and transparent coordination across India.
              </p>
              <div class="about-hero-ctas">
                <a href="#about-story" class="button button-primary">
                  Explore Our Mission
                </a>
                <a href="#/donor/register" class="button button-outline">
                  Join the Community
                </a>
              </div>
            </div>

            <div class="about-hero-visual">
              <svg class="about-illustration-svg" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Illustration depicting blood donation network and voluntary care">
                <defs>
                  <linearGradient id="aboutGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#C51E24"/>
                    <stop offset="100%" stop-color="#991B1B"/>
                  </linearGradient>
                  <linearGradient id="aboutGradSoft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#f8fafc"/>
                  </linearGradient>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#C51E24" flood-opacity="0.15"/>
                  </filter>
                </defs>

                <!-- Background Soft Blob -->
                <circle cx="250" cy="200" r="160" fill="#fef2f2"/>
                <path d="M120 280C90 220 140 120 230 110C320 100 400 160 380 250C360 340 270 360 190 340C140 325 130 300 120 280Z" fill="#fee2e2" opacity="0.6"/>

                <!-- Connected Network Lines -->
                <path d="M160 170 L250 140 L340 180 L250 270 Z" stroke="#fca5a5" stroke-width="2.5" stroke-dasharray="6 6"/>
                <line x1="250" y1="140" x2="250" y2="270" stroke="#fca5a5" stroke-width="2.5" stroke-dasharray="6 6"/>

                <!-- Central Blood Drop Card -->
                <g filter="url(#softGlow)">
                  <rect x="180" y="110" width="140" height="170" rx="20" fill="url(#aboutGradSoft)" stroke="#e2e8f0" stroke-width="2"/>
                  <!-- Blood Drop Icon -->
                  <path d="M250 145 C250 145 220 185 220 205 C220 221.5 233.5 235 250 235 C266.5 235 280 221.5 280 205 C280 185 250 145 250 145 Z" fill="url(#aboutGradRed)"/>
                  <circle cx="240" cy="190" r="4" fill="#ffffff" opacity="0.7"/>
                  <rect x="205" y="250" width="90" height="8" rx="4" fill="#e2e8f0"/>
                  <rect x="220" y="264" width="60" height="6" rx="3" fill="#cbd5e1"/>
                </g>

                <!-- Surrounding Orbit Nodes -->
                <!-- Node 1: Hospital -->
                <g transform="translate(110, 130)">
                  <circle cx="30" cy="30" r="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="30" cy="30" r="22" fill="#fef2f2"/>
                  <path d="M30 18 V42 M18 30 H42" stroke="#C51E24" stroke-width="3.5" stroke-linecap="round"/>
                </g>

                <!-- Node 2: Voluntary Donor -->
                <g transform="translate(330, 140)">
                  <circle cx="30" cy="30" r="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="30" cy="30" r="22" fill="#ecfdf5"/>
                  <path d="M25 36 C25 32 28 29 30 29 C32 29 35 32 35 36 M30 25 C32 25 33.5 23.5 33.5 21.5 C33.5 19.5 32 18 30 18 C28 18 26.5 19.5 26.5 21.5 C26.5 23.5 28 25 30 25 Z" fill="#059669"/>
                </g>

                <!-- Node 3: Heart / Shield Care -->
                <g transform="translate(220, 270)">
                  <circle cx="30" cy="30" r="30" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="30" cy="30" r="22" fill="#fff1f2"/>
                  <path d="M30 36 L23 29 C20.5 26.5 20.5 22.5 23 20 C25.5 17.5 29.5 17.5 30 20 C30.5 17.5 34.5 17.5 37 20 C39.5 22.5 39.5 26.5 37 29 Z" fill="#C51E24"/>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <!-- Body Content Wrapper -->
        <div class="about-body-wrapper">
          <!-- 2. Our Story Section -->
          <section id="about-story" class="about-story-section" aria-labelledby="storyHeading">
            <div class="about-story-grid">
              <div class="about-story-content">
                <span class="about-badge" style="margin-bottom: 12px;">Origin &amp; Purpose</span>
                <h2 id="storyHeading">Why RaktDal Was Created</h2>
                <p class="about-story-p">
                  Access to timely blood donation support remains a challenge for many communities. Donors, hospitals and people seeking blood often face difficulties connecting through fragmented information and communication channels.
                </p>
                <p class="about-story-p">
                  RaktDal was created to help bridge this coordination gap through a centralized digital platform that encourages voluntary donation, improves discovery of participating donors and supports collaboration with verified healthcare organizations.
                </p>
                <div class="about-story-callout">
                  <strong>National Healthcare Goal:</strong> Standardizing communication and empowering individuals to coordinate safely and voluntarily without exposing private personal details to spam or scrapers.
                </div>
              </div>

              <div class="about-story-visual">
                <div class="story-stat-bubble">
                  <div class="story-stat-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                  </div>
                  <div class="story-stat-body">
                    <strong>100% Voluntary Donation</strong>
                    <span>Promoting non-remunerated voluntary care</span>
                  </div>
                </div>

                <div class="story-stat-bubble">
                  <div class="story-stat-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div class="story-stat-body">
                    <strong>Privacy by Design</strong>
                    <span>Consent-based discovery &amp; in-app alerts</span>
                  </div>
                </div>

                <div class="story-stat-bubble">
                  <div class="story-stat-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 21h18"></path>
                      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                    </svg>
                  </div>
                  <div class="story-stat-body">
                    <strong>Verified Organizations</strong>
                    <span>Hospitals, blood banks &amp; licensed camps</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Mission & Vision Pillars -->
          <div class="about-section-head">
            <span class="about-badge" style="margin-bottom: 12px;">Strategic Direction</span>
            <h2>Our Mission &amp; Vision</h2>
            <p>Guiding our technology, partnerships, and community coordination across India.</p>
          </div>

          <div class="about-pillars-grid">
            <div class="about-pillar-card">
              <span class="pillar-badge-top mission">Our Mission</span>
              <h3>Connecting Donors &amp; Care</h3>
              <p>Make blood donation coordination easier by connecting participating donors, people seeking blood and healthcare organizations through structured, responsible technology.</p>
            </div>

            <div class="about-pillar-card">
              <span class="pillar-badge-top vision">Our Vision</span>
              <h3>A Connected Nationwide Network</h3>
              <p>Build a connected and responsible blood donation community across India, ensuring no emergency patient faces life-threatening delays due to lack of donor coordination.</p>
            </div>
          </div>

          <!-- Our Values Card (6 Values) -->
          <div class="about-values-card">
            <h3 class="about-values-title">Our Guiding Values</h3>
            <p class="about-values-sub">Principles that govern our architecture, data governance, and user interactions.</p>

            <div class="values-grid">
              <div class="value-item">
                <div class="value-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h4>Donor Privacy</h4>
                <p>Personal phone numbers and sensitive medical history remain protected behind strict consent controls.</p>
              </div>

              <div class="value-item">
                <div class="value-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 14 14"></polyline>
                  </svg>
                </div>
                <h4>Transparency</h4>
                <p>Real-time request updates, organization-reported stock information, and verified camp timings.</p>
              </div>

              <div class="value-item">
                <div class="value-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h4>Voluntary Participation</h4>
                <p>100% voluntary, altruistic blood donation without commercialization or financial incentives.</p>
              </div>

              <div class="value-item">
                <div class="value-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  </svg>
                </div>
                <h4>Community Collaboration</h4>
                <p>Empowering colleges, resident associations, and NGOs to organize licensed voluntary camps.</p>
              </div>

              <div class="value-item">
                <div class="value-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h4>Responsible Coordination</h4>
                <p>Ensuring medical decisions and clinical blood tests remain strictly under qualified healthcare authority.</p>
              </div>

              <div class="value-item">
                <div class="value-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h4>Trust &amp; Accountability</h4>
                <p>Immutable audit logging, anti-fraud safeguards, and transparent platform moderation standards.</p>
              </div>
            </div>
          </div>

          <!-- 4. Why Choose RaktDal Grid -->
          <div class="about-section-head">
            <span class="about-badge" style="margin-bottom: 12px;">Platform Capabilities</span>
            <h2>Why Choose RaktDal?</h2>
            <p>Designed to support every participant in the voluntary healthcare ecosystem.</p>
          </div>

          <div class="about-features-grid">
            <div class="about-feature-box">
              <div class="about-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Donor Privacy First</h3>
              <p>Personal donor information is protected through consent-based discovery and controlled access.</p>
            </div>

            <div class="about-feature-box">
              <div class="about-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Responsible Coordination</h3>
              <p>Help people connect with participating donors and verified organizations without intermediaries.</p>
            </div>

            <div class="about-feature-box">
              <div class="about-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 21h18"></path>
                  <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                  <line x1="10" y1="9" x2="14" y2="9"></line>
                </svg>
              </div>
              <h3>Organization Collaboration</h3>
              <p>Support hospitals, licensed blood banks, and community donation camp organizers effectively.</p>
            </div>

            <div class="about-feature-box">
              <div class="about-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Location-Based Discovery</h3>
              <p>Find participating donors using verified city and postal PIN code proximity filters.</p>
            </div>

            <div class="about-feature-box">
              <div class="about-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Community Participation</h3>
              <p>Encourage voluntary blood donation, youth donor enrollment, and community involvement.</p>
            </div>

            <div class="about-feature-box">
              <div class="about-feature-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                </svg>
              </div>
              <h3>Transparent Information</h3>
              <p>Display organization-reported inventory with appropriate update timestamps and verification state.</p>
            </div>
          </div>

          <!-- 5. How RaktDal Works Timeline -->
          <section class="about-timeline-section" aria-labelledby="timelineHeading">
            <div class="about-section-head" style="margin-bottom: 24px;">
              <span class="about-badge" style="margin-bottom: 12px;">Step-by-Step Flow</span>
              <h2 id="timelineHeading">How RaktDal Works</h2>
              <p>A streamlined, ethical four-step process for donors, coordinators, and patients.</p>
            </div>

            <div class="timeline-steps-grid">
              <div class="timeline-step-card">
                <div class="timeline-step-badge">1</div>
                <h4>Join the Community</h4>
                <p>Donors and organizations create verified profiles and configure their availability schedule.</p>
              </div>

              <div class="timeline-step-card">
                <div class="timeline-step-badge">2</div>
                <h4>Discover &amp; Connect</h4>
                <p>People search for participating donors by city, blood group, and proximity PIN code.</p>
              </div>

              <div class="timeline-step-card">
                <div class="timeline-step-badge">3</div>
                <h4>Coordinate Requests</h4>
                <p>Blood requests are shared with eligible, opted-in participating donors via instant in-app alerts.</p>
              </div>

              <div class="timeline-step-card">
                <div class="timeline-step-badge">4</div>
                <h4>Support the Community</h4>
                <p>Donors choose whether to respond, while healthcare professionals coordinate clinical safety.</p>
              </div>
            </div>
          </section>

          <!-- 6. Trust & Privacy Section -->
          <div class="about-trust-banner">
            <div class="about-trust-left">
              <div class="trust-shield-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h3>Trust &amp; Privacy First</h3>
                <p>Our architecture is built from the ground up to prevent data harvesting, spam, and unconsented public disclosure.</p>
              </div>
            </div>

            <div class="about-trust-list">
              <div class="trust-check-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Donor consent controls</span>
              </div>

              <div class="trust-check-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Privacy-conscious discovery</span>
              </div>

              <div class="trust-check-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Verified organization participation</span>
              </div>

              <div class="trust-check-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Secure authentication &amp; RBAC</span>
              </div>

              <div class="trust-check-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Controlled access to contact data</span>
              </div>

              <div class="trust-check-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Transparent organization-reported inventory</span>
              </div>
            </div>
          </div>

          <!-- 7. Call to Action Banner -->
          <div class="about-cta-card">
            <h2 class="about-cta-title">Be Part of Something That Matters.</h2>
            <p class="about-cta-desc">
              Whether you want to donate blood, discover participating donors or bring your healthcare organization onto RaktDal, your participation can make a difference.
            </p>
            <div class="about-cta-buttons">
              <a href="#/donor/register" class="button contact-cta-btn-white">
                Become a Donor
              </a>
              <a href="#/find-blood" class="button contact-cta-btn-red">
                Find Donors
              </a>
              <a href="#/camps" class="button contact-cta-btn-ghost">
                Explore Donation Camps
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderHowItWorks(container) {
    container.innerHTML = `
      <div class="hiw-page-container">
        <!-- 1. Hero Section -->
        <section class="hiw-hero-section" aria-labelledby="hiwHeroHeading">
          <div class="hiw-hero-inner">
            <div class="hiw-hero-text">
              <span class="hiw-badge">
                <span class="hiw-badge-dot" aria-hidden="true"></span>
                Simple &amp; Streamlined
              </span>
              <h1 id="hiwHeroHeading" class="hiw-hero-title">
                How <span class="accent-text">RaktDal</span> Works
              </h1>
              <p class="hiw-hero-sub">
                From discovering participating donors to coordinating blood requests, RaktDal makes responsible blood donation coordination simpler and more accessible.
              </p>
              <div class="hiw-hero-ctas">
                <a href="#/find-blood" class="button button-primary">
                  Find Donors
                </a>
                <a href="#/donor/register" class="button button-outline">
                  Become a Donor
                </a>
              </div>
            </div>

            <div class="hiw-hero-visual">
              <svg class="hiw-illustration-svg" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Step by step blood donation coordination workflow">
                <defs>
                  <linearGradient id="hiwGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#C51E24"/>
                    <stop offset="100%" stop-color="#991B1B"/>
                  </linearGradient>
                  <linearGradient id="hiwGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#f8fafc"/>
                  </linearGradient>
                </defs>

                <!-- Flow Path -->
                <circle cx="250" cy="200" r="150" fill="#fef2f2" opacity="0.7"/>
                <path d="M100 200 C100 120, 200 120, 250 200 C300 280, 400 280, 400 200" stroke="#fca5a5" stroke-width="4" stroke-dasharray="8 8"/>

                <!-- Card 1: Request -->
                <g transform="translate(70, 140)">
                  <rect width="110" height="120" rx="16" fill="url(#hiwGradCard)" stroke="#e2e8f0" stroke-width="2"/>
                  <rect x="15" y="20" width="80" height="10" rx="5" fill="#fee2e2"/>
                  <rect x="15" y="40" width="60" height="8" rx="4" fill="#e2e8f0"/>
                  <rect x="15" y="56" width="50" height="8" rx="4" fill="#e2e8f0"/>
                  <circle cx="55" cy="90" r="16" fill="#C51E24"/>
                  <path d="M55 83 L55 97 M48 90 L62 90" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
                </g>

                <!-- Card 2: Central Match Node -->
                <g transform="translate(210, 130)">
                  <rect width="120" height="140" rx="18" fill="url(#hiwGradCard)" stroke="#C51E24" stroke-width="2.5"/>
                  <circle cx="60" cy="55" r="28" fill="url(#hiwGradRed)"/>
                  <path d="M60 40 C60 40 45 60 45 72 C45 80.5 51.5 87 60 87 C68.5 87 75 80.5 75 72 C75 60 60 40 60 40 Z" fill="#ffffff"/>
                  <rect x="25" y="100" width="70" height="8" rx="4" fill="#cbd5e1"/>
                  <rect x="35" y="115" width="50" height="6" rx="3" fill="#e2e8f0"/>
                </g>

                <!-- Card 3: Care Confirmation -->
                <g transform="translate(350, 140)">
                  <rect width="110" height="120" rx="16" fill="url(#hiwGradCard)" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="55" cy="50" r="22" fill="#ecfdf5"/>
                  <path d="M48 50 L53 55 L63 45" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="20" y="85" width="70" height="8" rx="4" fill="#e2e8f0"/>
                  <rect x="25" y="100" width="60" height="6" rx="3" fill="#cbd5e1"/>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <!-- Body Wrapper -->
        <div class="hiw-body-wrapper">
          <!-- 2. Interactive User Journey Selector Tabs -->
          <div class="hiw-journey-nav-wrapper">
            <div class="hiw-journey-tabs" role="tablist" aria-label="Select User Journey">
              <button type="button" class="hiw-tab-btn active" role="tab" aria-selected="true" id="tab-need-blood" aria-controls="panel-need-blood" data-journey="need-blood">
                <span class="hiw-tab-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </span>
                <span>I Need Blood</span>
              </button>

              <button type="button" class="hiw-tab-btn" role="tab" aria-selected="false" id="tab-donate" aria-controls="panel-donate" data-journey="donate">
                <span class="hiw-tab-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </span>
                <span>I Want to Donate</span>
              </button>

              <button type="button" class="hiw-tab-btn" role="tab" aria-selected="false" id="tab-org" aria-controls="panel-org" data-journey="org">
                <span class="hiw-tab-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                    <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path>
                  </svg>
                </span>
                <span>I'm an Organization</span>
              </button>
            </div>
          </div>

          <!-- ========================================== -->
          <!-- JOURNEY 1: I NEED BLOOD (5 STEPS) -->
          <!-- ========================================== -->
          <div id="panel-need-blood" class="hiw-journey-panel active" role="tabpanel" aria-labelledby="tab-need-blood">
            <div class="hiw-panel-header">
              <h2>Workflow for Patients &amp; Coordinators</h2>
              <p>Step-by-step guidance on how to request blood, locate nearby compatible donors, and coordinate clinical fulfillment.</p>
            </div>

            <div class="hiw-timeline-wrapper">
              <!-- Step 1 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 1 · Authentication &amp; Posting</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                      </div>
                    </div>
                    <h3>Create a Blood Request</h3>
                    <p>Sign in securely with Google and submit your request specifying required blood group, component, hospital location, urgency tier, and units required.</p>
                    <a href="#/requests" class="hiw-step-link">
                      <span>View Blood Requests</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">1</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>

              <!-- Step 2 -->
              <div class="hiw-timeline-item side-right">
                <div class="hiw-spacer-col"></div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">2</div>
                </div>
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                      <span class="hiw-step-tag">Step 2 · Moderation</span>
                    </div>
                    <h3>Request Validation &amp; Publishing</h3>
                    <p>The request enters our moderation queue to check that valid contact details and clinical hospital information are present before indexing.</p>
                  </div>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 3 · Proximity Search</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </div>
                    </div>
                    <h3>Discover Participating Donors</h3>
                    <p>Filter active donors by compatible blood group, city, district, and postal PIN code. Send instant In-App Alerts without exposing personal phone numbers.</p>
                    <a href="#/find-blood" class="hiw-step-link">
                      <span>Search Donors</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">3</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>

              <!-- Step 4 -->
              <div class="hiw-timeline-item side-right">
                <div class="hiw-spacer-col"></div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">4</div>
                </div>
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span class="hiw-step-tag">Step 4 · Voluntary Responses</span>
                    </div>
                    <h3>Receive Donor Responses</h3>
                    <p>Matching voluntary donors receive notifications and independently accept or decline based on availability, confirming units and estimated arrival.</p>
                  </div>
                </div>
              </div>

              <!-- Step 5 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 5 · Medical Fulfillment</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                      </div>
                    </div>
                    <h3>Coordinate with Healthcare Providers</h3>
                    <p>The coordinator and hospital transfusion department confirm biological compatibility, screen hemoglobin and viral markers, and carry out the safe transfusion.</p>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">5</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>
            </div>
          </div>

          <!-- ========================================== -->
          <!-- JOURNEY 2: I WANT TO DONATE (5 STEPS) -->
          <!-- ========================================== -->
          <div id="panel-donate" class="hiw-journey-panel" role="tabpanel" aria-labelledby="tab-donate">
            <div class="hiw-panel-header">
              <h2>Workflow for Voluntary Blood Donors</h2>
              <p>How altruistic individuals register, manage privacy controls, receive relevant alerts, and voluntarily save lives.</p>
            </div>

            <div class="hiw-timeline-wrapper">
              <!-- Step 1 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 1 · Identity</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    </div>
                    <h3>Sign In Securely</h3>
                    <p>Authenticate safely using Google Single Sign-On. Your session is protected by encrypted authentication tokens and strict CORS/CSRF safeguards.</p>
                    <a href="#/login" class="hiw-step-link">
                      <span>Sign In with Google</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">1</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>

              <!-- Step 2 -->
              <div class="hiw-timeline-item side-right">
                <div class="hiw-spacer-col"></div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">2</div>
                </div>
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <span class="hiw-step-tag">Step 2 · Profile</span>
                    </div>
                    <h3>Create Your Donor Profile</h3>
                    <p>Enter your blood group (A+, B+, O-, etc.), age, and geographic location (city, district, PIN code) to ensure you are matched only with nearby requests.</p>
                    <a href="#/donor/register" class="hiw-step-link">
                      <span>Register as Donor</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 3 · Privacy &amp; Consent</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                    </div>
                    <h3>Manage Your Availability</h3>
                    <p>Toggle your status between <em>Available</em> and <em>Unavailable</em> at any moment. Choose whether your profile appears in public donor searches.</p>
                    <a href="#/donor/dashboard" class="hiw-step-link">
                      <span>Manage Dashboard</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">3</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>

              <!-- Step 4 -->
              <div class="hiw-timeline-item side-right">
                <div class="hiw-spacer-col"></div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">4</div>
                </div>
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </div>
                      <span class="hiw-step-tag">Step 4 · In-App Alerts</span>
                    </div>
                    <h3>Receive Relevant Notifications</h3>
                    <p>Get instant real-time alerts when hospitals or verified coordinators post an urgent blood requirement matching your blood group in your area.</p>
                  </div>
                </div>
              </div>

              <!-- Step 5 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 5 · Non-Obligatory</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </div>
                    </div>
                    <h3>Respond Voluntarily</h3>
                    <p>Participation is 100% voluntary. You independently decide whether to accept or decline. Joining RaktDal never creates a mandatory obligation to donate.</p>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">5</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>
            </div>
          </div>

          <!-- ========================================== -->
          <!-- JOURNEY 3: ORGANIZATIONS (5 STEPS) -->
          <!-- ========================================== -->
          <div id="panel-org" class="hiw-journey-panel" role="tabpanel" aria-labelledby="tab-org">
            <div class="hiw-panel-header">
              <h2>Workflow for Hospitals &amp; Blood Banks</h2>
              <p>How licensed healthcare institutions onboard, maintain reported stock levels, and coordinate community camps.</p>
            </div>

            <div class="hiw-timeline-wrapper">
              <!-- Step 1 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 1 · Portal Access</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    </div>
                    <h3>Organization Sign In</h3>
                    <p>Administrative medical coordinators sign in through Google OAuth to initiate the institution registration process.</p>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">1</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>

              <!-- Step 2 -->
              <div class="hiw-timeline-item side-right">
                <div class="hiw-spacer-col"></div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">2</div>
                </div>
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 21h18"></path>
                          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                          <line x1="10" y1="9" x2="14" y2="9"></line>
                        </svg>
                      </div>
                      <span class="hiw-step-tag">Step 2 · Compliance Submission</span>
                    </div>
                    <h3>Submit Organization Credentials</h3>
                    <p>Provide verified institution details: hospital/blood bank license number, authorized representative contact, physical address, and documentation.</p>
                  </div>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 3 · Verification Audit</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          <polyline points="9 12 11 14 15 10"></polyline>
                        </svg>
                      </div>
                    </div>
                    <h3>Platform Admin Verification</h3>
                    <p>Platform administrators audit licensing and documentation. Verified organization status is granted only after audit confirmation.</p>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">3</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>

              <!-- Step 4 -->
              <div class="hiw-timeline-item side-right">
                <div class="hiw-spacer-col"></div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">4</div>
                </div>
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="3" width="7" height="9" rx="1.5"></rect>
                          <rect x="14" y="3" width="7" height="5" rx="1.5"></rect>
                          <rect x="14" y="12" width="7" height="9" rx="1.5"></rect>
                          <rect x="3" y="16" width="7" height="5" rx="1.5"></rect>
                        </svg>
                      </div>
                      <span class="hiw-step-tag">Step 4 · Tailored Dashboard</span>
                    </div>
                    <h3>Access Organization Dashboard</h3>
                    <p>Role-based features unlock based on organization type: Hospitals coordinate bulk requests, Blood Banks manage reported inventory, and Organizers publish camps.</p>
                    <a href="#/blood-banks" class="hiw-step-link">
                      <span>Browse Blood Banks</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Step 5 -->
              <div class="hiw-timeline-item side-left">
                <div class="hiw-card-col">
                  <div class="hiw-step-card">
                    <div class="hiw-step-top">
                      <span class="hiw-step-tag">Step 5 · Operations</span>
                      <div class="hiw-step-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                        </svg>
                      </div>
                    </div>
                    <h3>Publish Camps &amp; Coordinate</h3>
                    <p>Coordinate authorized community donation drives, review voluntary pledges, and publish updated inventory levels to ensure transparency across the network.</p>
                    <a href="#/camps" class="hiw-step-link">
                      <span>Explore Camps</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                  </div>
                </div>
                <div class="hiw-node-col">
                  <div class="hiw-node-bubble">5</div>
                </div>
                <div class="hiw-spacer-col"></div>
              </div>
            </div>
          </div>

          <!-- 3. Platform Capabilities & Benefits Grid (8 Cards) -->
          <section class="hiw-benefits-section" aria-labelledby="benefitsHeading">
            <div class="hiw-panel-header" style="margin-bottom: 32px;">
              <span class="hiw-badge" style="margin-bottom: 12px;">Core Architecture</span>
              <h2 id="benefitsHeading">Platform Capabilities &amp; Benefits</h2>
              <p>Key technological and operational features built into the RaktDal platform.</p>
            </div>

            <div class="hiw-benefits-grid">
              <div class="hiw-benefit-card">
                <div class="hiw-benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h4>Location Discovery</h4>
                <p>Filter participating voluntary donors by state, city, and postal PIN code proximity.</p>
              </div>

              <div class="hiw-benefit-card">
                <div class="hiw-benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h4>Consent Participation</h4>
                <p>Donors maintain granular control over discovery and contact sharing options.</p>
              </div>

              <div class="hiw-benefit-card">
                <div class="hiw-benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h4>Secure Google OAuth</h4>
                <p>Industry-standard token authentication eliminates stored plain-text passwords.</p>
              </div>

              <div class="hiw-benefit-card">
                <div class="hiw-benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                    <line x1="10" y1="9" x2="14" y2="9"></line>
                  </svg>
                </div>
                <h4>Organization Verification</h4>
                <p>Multi-step platform audit for hospital licensing and blood bank credentials.</p>
              </div>

              <div class="hiw-benefit-card">
                <div class="hiw-benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h4>Reported Inventory</h4>
                <p>Timely visibility into organization-reported stock with verification timestamps.</p>
              </div>

              <div class="hiw-benefit-card">
                <div class="hiw-benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                  </svg>
                </div>
                <h4>Camp Coordination</h4>
                <p>Community organizers partner with licensed blood banks for scheduled drives.</p>
              </div>

              <div class="hiw-benefit-card">
                <div class="hiw-benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h4>Multilingual Support</h4>
                <p>Accessible across 6+ major Indian languages including Hindi, Bengali, and Tamil.</p>
              </div>

              <div class="hiw-benefit-card">
                <div class="hiw-benefit-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                </div>
                <h4>Responsive Mobile UI</h4>
                <p>Fully optimized touch experience for fast emergency coordination on any smartphone.</p>
              </div>
            </div>
          </section>

          <!-- 4. Responsibility & Safety Section (Shield Theme) -->
          <div class="hiw-safety-card">
            <div class="hiw-safety-left">
              <div class="hiw-safety-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h3>Responsible Coordination Comes First</h3>
                <p>Important guidelines governing our coordination role, clinical boundaries, and donor safety.</p>
              </div>
            </div>

            <div class="hiw-safety-list">
              <div class="hiw-safety-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Donor participation is strictly voluntary and non-remunerated.</span>
              </div>

              <div class="hiw-safety-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Donor privacy and contact consent settings are honored at every step.</span>
              </div>

              <div class="hiw-safety-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Blood inventory is organization-reported with explicit update timestamps.</span>
              </div>

              <div class="hiw-safety-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Donor availability is reported and cannot be clinically guaranteed.</span>
              </div>

              <div class="hiw-safety-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Medical suitability must be confirmed by qualified healthcare professionals.</span>
              </div>

              <div class="hiw-safety-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>RaktDal is a coordination platform, not a medical decision-making service.</span>
              </div>
            </div>
          </div>

          <!-- 5. Final Call to Action -->
          <div class="hiw-cta-card">
            <h2 class="hiw-cta-title">Ready to Be Part of the Community?</h2>
            <p class="hiw-cta-desc">
              Every responsible connection can help strengthen the voluntary blood donation community across India.
            </p>
            <div class="hiw-cta-buttons">
              <a href="#/find-blood" class="button contact-cta-btn-white">
                Find Donors
              </a>
              <a href="#/donor/register" class="button contact-cta-btn-red">
                Become a Donor
              </a>
              <a href="#/camps" class="button contact-cta-btn-ghost">
                Explore Donation Camps
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize Interactive Tab Switching
    this.initHowItWorksTabs(container);
  },

  initHowItWorksTabs(container) {
    const tabBtns = container.querySelectorAll(".hiw-tab-btn");
    const panels = container.querySelectorAll(".hiw-journey-panel");

    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const journey = btn.getAttribute("data-journey");

        tabBtns.forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        panels.forEach(p => {
          p.classList.remove("active");
        });

        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const targetPanel = container.querySelector(`#panel-${journey}`);
        if (targetPanel) {
          targetPanel.classList.add("active");
        }
      });
    });
  },

  renderContact(container) {
    container.innerHTML = `
      <div class="contact-page-container">
        <!-- 1. Hero Section -->
        <section class="contact-hero-section" aria-labelledby="contactHeroHeading">
          <div class="contact-hero-inner">
            <span class="contact-badge">
              <span class="contact-badge-dot" aria-hidden="true"></span>
              Support & Inquiries
            </span>
            <h1 id="contactHeroHeading" class="contact-hero-title">
              How Can We Help You?
            </h1>
            <p class="contact-hero-sub">
              Have questions, need technical assistance, or want to partner with RaktDal? Our coordination team is here to assist you.
            </p>
            <div class="contact-hero-stats">
              <span class="contact-hero-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Verified Healthcare Network
              </span>
              <span class="contact-hero-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Pan-India Donor Directory
              </span>
              <span class="contact-hero-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Zero-Spam Privacy Protection
              </span>
            </div>
          </div>
        </section>

        <!-- Main Body -->
        <div class="contact-body-wrapper">
          <!-- 2. Contact Information Cards -->
          <div class="contact-section-head">
            <h2>Direct Contact Channels</h2>
            <p>Connect with the dedicated department for your specific inquiry or emergency.</p>
          </div>

          <div class="contact-cards-grid">
            <!-- Card 1: General Support -->
            <div class="contact-channel-card">
              <div>
                <div class="contact-channel-header">
                  <div class="contact-icon-box" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h3 class="contact-channel-title">General Support</h3>
                </div>
                <p class="contact-channel-desc">
                  For general user queries, account access assistance, and platform feature guidance.
                </p>
              </div>
              <div>
                <a href="mailto:raktdal@gmail.com" class="contact-channel-action" aria-label="Email General Support">
                  <span>raktdal@gmail.com</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Card 2: Organization Onboarding -->
            <div class="contact-channel-card">
              <div>
                <div class="contact-channel-header">
                  <div class="contact-icon-box" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 21h18"></path>
                      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                      <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path>
                      <line x1="10" y1="9" x2="14" y2="9"></line>
                      <line x1="12" y1="7" x2="12" y2="11"></line>
                    </svg>
                  </div>
                  <h3 class="contact-channel-title">Organization Onboarding</h3>
                </div>
                <p class="contact-channel-desc">
                  For licensed blood banks, hospitals, and medical trusts looking to join our verified network.
                </p>
              </div>
              <div>
                <a href="mailto:raktdal@gmail.com?subject=Organization%20Onboarding%20Inquiry" class="contact-channel-action" aria-label="Email Organization Onboarding Team">
                  <span>raktdal@gmail.com</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Card 3: Partnerships & Camps -->
            <div class="contact-channel-card">
              <div>
                <div class="contact-channel-header">
                  <div class="contact-icon-box" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 class="contact-channel-title">Partnership Inquiries</h3>
                </div>
                <p class="contact-channel-desc">
                  For university drives, corporate CSR initiatives, and voluntary community blood camps.
                </p>
              </div>
              <div>
                <a href="mailto:raktdal@gmail.com?subject=Partnership%20and%20Camp%20Collaboration" class="contact-channel-action" aria-label="Email Partnerships Team">
                  <span>raktdal@gmail.com</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Card 4: Emergency Medical Services -->
            <div class="contact-channel-card emergency-accent">
              <div>
                <div class="contact-channel-header">
                  <div class="contact-icon-box" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h3 class="contact-channel-title">Emergency Helpline</h3>
                </div>
                <p class="contact-channel-desc">
                  For immediate critical situations, contact official national emergency medical responders.
                </p>
              </div>
              <div>
                <a href="tel:112" class="contact-channel-action" aria-label="Dial National Emergency Helpline">
                  <span>Dial 112 / 108 (India)</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- 3. Split Layout: Process + Form -->
          <div class="contact-split-section">
            <!-- Left: Support Process -->
            <div class="support-process-card">
              <h3 class="support-process-title">How Support Works</h3>
              <p class="support-process-sub">
                Our support team follows a structured protocol to ensure every request is appropriately triaged and resolved.
              </p>

              <div class="process-timeline">
                <div class="process-step">
                  <div class="process-step-num">1</div>
                  <div class="process-step-body">
                    <h4>Submit Your Inquiry</h4>
                    <p>Share your questions, feedback, or onboarding request with relevant details via our contact form or email.</p>
                  </div>
                </div>

                <div class="process-step">
                  <div class="process-step-num">2</div>
                  <div class="process-step-body">
                    <h4>Internal Triage & Review</h4>
                    <p>Your request is assigned to either our technical team, organization verification board, or partnership lead.</p>
                  </div>
                </div>

                <div class="process-step">
                  <div class="process-step-num">3</div>
                  <div class="process-step-body">
                    <h4>Direct Response & Assistance</h4>
                    <p>You receive personalized guidance and follow-up support directly at your registered email address.</p>
                  </div>
                </div>
              </div>

              <div class="support-notice-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div>
                  <strong>Medical Clarification:</strong> RaktDal is a coordination platform. We do not maintain physical blood storage or provide emergency medical treatment directly.
                </div>
              </div>
            </div>

            <!-- Right: Interactive Contact Form -->
            <div class="contact-form-card">
              <h3 class="contact-form-title">Send Us a Message</h3>
              <p class="contact-form-subtitle">Fill in your information below and our team will get back to you.</p>

              <!-- Live Status Banner -->
              <div id="contactStatusBanner" class="contact-status-banner" role="alert" aria-live="polite">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div id="contactStatusText"></div>
              </div>

              <form id="contactForm" novalidate>
                <div class="form-grid-two">
                  <!-- Full Name -->
                  <div class="contact-field-group">
                    <label class="contact-label" for="contactName">
                      <span>Full Name <span class="req-star" aria-hidden="true">*</span></span>
                    </label>
                    <input type="text" id="contactName" class="contact-input" placeholder="e.g. Rahul Sharma" autocomplete="name" required maxlength="100">
                    <span class="field-error-msg" id="nameError">Please enter your full name.</span>
                  </div>

                  <!-- Email Address -->
                  <div class="contact-field-group">
                    <label class="contact-label" for="contactEmail">
                      <span>Email Address <span class="req-star" aria-hidden="true">*</span></span>
                    </label>
                    <input type="email" id="contactEmail" class="contact-input" placeholder="e.g. rahul@example.com" autocomplete="email" required maxlength="120">
                    <span class="field-error-msg" id="emailError">Please enter a valid email address.</span>
                  </div>
                </div>

                <div class="form-grid-two">
                  <!-- Category -->
                  <div class="contact-field-group">
                    <label class="contact-label" for="contactCategory">
                      <span>Inquiry Category <span class="req-star" aria-hidden="true">*</span></span>
                    </label>
                    <select id="contactCategory" class="contact-select" required>
                      <option value="">Select a category...</option>
                      <option value="General Support">General Support</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Organization Onboarding">Organization Onboarding</option>
                      <option value="Partnership">Partnership &amp; Camps</option>
                      <option value="Feedback">Feedback &amp; Suggestions</option>
                      <option value="Other">Other</option>
                    </select>
                    <span class="field-error-msg" id="categoryError">Please select an inquiry category.</span>
                  </div>

                  <!-- Subject -->
                  <div class="contact-field-group">
                    <label class="contact-label" for="contactSubject">
                      <span>Subject <span class="req-star" aria-hidden="true">*</span></span>
                    </label>
                    <input type="text" id="contactSubject" class="contact-input" placeholder="Brief summary of query" required maxlength="150">
                    <span class="field-error-msg" id="subjectError">Please provide a brief subject.</span>
                  </div>
                </div>

                <!-- Message -->
                <div class="contact-field-group">
                  <label class="contact-label" for="contactMessage">
                    <span>Message <span class="req-star" aria-hidden="true">*</span></span>
                    <span class="char-count" id="messageCharCount">0 / 1000</span>
                  </label>
                  <textarea id="contactMessage" class="contact-textarea" rows="4" placeholder="Explain your question, suggestion, or request with relevant specifics..." required maxlength="1000"></textarea>
                  <span class="field-error-msg" id="messageError">Please enter your message (at least 15 characters).</span>
                </div>

                <button type="submit" id="contactSubmitBtn" class="contact-submit-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  <span>Submit Inquiry</span>
                </button>

                <div class="contact-form-footinfo">
                  🔒 Your contact information is never shared or used for marketing purposes.
                </div>
              </form>
            </div>
          </div>

          <!-- 4. FAQ Accordion Section -->
          <div class="contact-faq-section" aria-labelledby="faqHeading">
            <div class="contact-section-head">
              <span class="contact-badge" style="margin-bottom: 12px;">Frequently Asked Questions</span>
              <h2 id="faqHeading">Common Support Questions</h2>
              <p>Quick answers to frequently asked questions about the RaktDal platform.</p>
            </div>

            <div class="faq-list-grid" id="faqAccordionGroup" role="region" aria-label="FAQ Accordion">
              <!-- Item 1 -->
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="faq-trigger-1" aria-controls="faq-panel-1">
                  <span>What is RaktDal and how does it work?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="faq-panel-1" class="faq-content" role="region" aria-labelledby="faq-trigger-1">
                  <div class="faq-inner">
                    RaktDal is India's dedicated voluntary blood donation coordination network. We connect patients, hospitals, and verified blood banks with compatible nearby voluntary donors in real-time, removing intermediaries and reducing critical response delays.
                  </div>
                </div>
              </div>

              <!-- Item 2 -->
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="faq-trigger-2" aria-controls="faq-panel-2">
                  <span>How can I register as a voluntary blood donor?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="faq-panel-2" class="faq-content" role="region" aria-labelledby="faq-trigger-2">
                  <div class="faq-inner">
                    You can register in minutes by navigating to <a href="#/donor/register" style="color:var(--primary); font-weight:600;">Become a Donor</a>. You will sign in securely, specify your blood group, age, and location, and set your initial availability schedule.
                  </div>
                </div>
              </div>

              <!-- Item 3 -->
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="faq-trigger-3" aria-controls="faq-panel-3">
                  <span>How do I find compatible donors in my city?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="faq-panel-3" class="faq-content" role="region" aria-labelledby="faq-trigger-3">
                  <div class="faq-inner">
                    Use our <a href="#/find-blood" style="color:var(--primary); font-weight:600;">Find Donors</a> directory. Filter by blood group (e.g. A+, O-, B+) and your city or district to view registered donors who have opted into public discovery and are marked available.
                  </div>
                </div>
              </div>

              <!-- Item 4 -->
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="faq-trigger-4" aria-controls="faq-panel-4">
                  <span>How can I submit an urgent blood requirement?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="faq-panel-4" class="faq-content" role="region" aria-labelledby="faq-trigger-4">
                  <div class="faq-inner">
                    Visit the <a href="#/requests" style="color:var(--primary); font-weight:600;">Blood Requests</a> section and click "Create Request". Provide the hospital name, required units, patient urgency tier, and coordinator contact details so matching donors can be notified.
                  </div>
                </div>
              </div>

              <!-- Item 5 -->
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="faq-trigger-5" aria-controls="faq-panel-5">
                  <span>How does a hospital or blood bank join RaktDal?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="faq-panel-5" class="faq-content" role="region" aria-labelledby="faq-trigger-5">
                  <div class="faq-inner">
                    Healthcare institutions and authorized blood banks can submit their licensing information by contacting our organization onboarding team at <strong>raktdal@gmail.com</strong>. Following verification by our platform administrators, access to the organization portal is granted.
                  </div>
                </div>
              </div>

              <!-- Item 6 -->
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="faq-trigger-6" aria-controls="faq-panel-6">
                  <span>How can our community organize a blood donation drive?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="faq-panel-6" class="faq-content" role="region" aria-labelledby="faq-trigger-6">
                  <div class="faq-inner">
                    Explore active camps in the <a href="#/camps" style="color:var(--primary); font-weight:600;">Donation Camps</a> section. Community organizers can collaborate with licensed regional blood banks to schedule and publish authorized camp listings with precise timings and venue locations.
                  </div>
                </div>
              </div>

              <!-- Item 7 -->
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="faq-trigger-7" aria-controls="faq-panel-7">
                  <span>How is donor privacy protected on RaktDal?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="faq-panel-7" class="faq-content" role="region" aria-labelledby="faq-trigger-7">
                  <div class="faq-inner">
                    We maintain strict privacy-by-design standards. Personal phone numbers and email addresses are never publicly visible without explicit affirmative consent. In-app emergency alerts protect donors from automated scraping and unsolicited telemarketing.
                  </div>
                </div>
              </div>

              <!-- Item 8 -->
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="faq-trigger-8" aria-controls="faq-panel-8">
                  <span>How can I update my availability or pause donation requests?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="faq-panel-8" class="faq-content" role="region" aria-labelledby="faq-trigger-8">
                  <div class="faq-inner">
                    Registered donors can toggle their status between <em>Available</em> and <em>Unavailable</em> at any time with a single click from their <a href="#/donor/dashboard" style="color:var(--primary); font-weight:600;">Donor Profile Dashboard</a>.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Call to Action Section -->
          <div class="contact-cta-card">
            <h2 class="contact-cta-title">Let's Make Every Connection Count.</h2>
            <p class="contact-cta-desc">
              Whether you are a donor, hospital, blood bank or community organizer, we are here to support your voluntary lifesaving mission.
            </p>
            <div class="contact-cta-buttons">
              <a href="#/find-blood" class="button contact-cta-btn-white">
                Find Donors
              </a>
              <a href="#/donor/register" class="button contact-cta-btn-red">
                Donate Blood
              </a>
              <a href="mailto:raktdal@gmail.com" class="button contact-cta-btn-ghost">
                Email Support Team
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize Accordion Interactive Logic
    this.initFaqAccordion(container);

    // Initialize Interactive Contact Form Logic
    this.initContactForm(container);
  },

  initFaqAccordion(container) {
    const items = container.querySelectorAll(".faq-item");
    items.forEach(item => {
      const trigger = item.querySelector(".faq-trigger");
      const content = item.querySelector(".faq-content");

      if (trigger && content) {
        trigger.addEventListener("click", () => {
          const isOpen = item.classList.contains("is-open");

          // Close all other accordion items for clean accordion UX
          items.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains("is-open")) {
              otherItem.classList.remove("is-open");
              const otherTrigger = otherItem.querySelector(".faq-trigger");
              const otherContent = otherItem.querySelector(".faq-content");
              if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
              if (otherContent) otherContent.style.maxHeight = null;
            }
          });

          // Toggle current item
          if (isOpen) {
            item.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
            content.style.maxHeight = null;
          } else {
            item.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      }
    });
  },

  initContactForm(container) {
    const form = container.querySelector("#contactForm");
    const nameInput = container.querySelector("#contactName");
    const emailInput = container.querySelector("#contactEmail");
    const categorySelect = container.querySelector("#contactCategory");
    const subjectInput = container.querySelector("#contactSubject");
    const messageInput = container.querySelector("#contactMessage");
    const charCount = container.querySelector("#messageCharCount");
    const submitBtn = container.querySelector("#contactSubmitBtn");
    const statusBanner = container.querySelector("#contactStatusBanner");
    const statusText = container.querySelector("#contactStatusText");

    if (!form) return;

    // Auto-fill and lock Name & Email if user is authenticated with an account
    try {
      const state = authState.getState();
      if (state && state.isAuthenticated && state.user) {
        const u = state.user;
        if (nameInput && u.fullName) {
          nameInput.value = u.fullName;
          nameInput.readOnly = true;
          nameInput.title = "Linked with your active RaktDal account";
          // Add locked badge next to label if not already present
          const nameLabel = container.querySelector("label[for='contactName']");
          if (nameLabel && !nameLabel.querySelector(".contact-locked-tag")) {
            const badge = document.createElement("span");
            badge.className = "contact-locked-tag";
            badge.innerHTML = `🔒 Account`;
            nameLabel.appendChild(badge);
          }
        }
        if (emailInput && u.email) {
          emailInput.value = u.email;
          emailInput.readOnly = true;
          emailInput.title = "Linked with your active RaktDal account";
          const emailLabel = container.querySelector("label[for='contactEmail']");
          if (emailLabel && !emailLabel.querySelector(".contact-locked-tag")) {
            const badge = document.createElement("span");
            badge.className = "contact-locked-tag";
            badge.innerHTML = `🔒 Account`;
            emailLabel.appendChild(badge);
          }
        }
      }
    } catch (e) {
      // Fallback silently if authState not initialized
    }

    // Real-time character count
    if (messageInput && charCount) {
      messageInput.addEventListener("input", () => {
        const len = messageInput.value.length;
        charCount.textContent = `${len} / 1000`;
      });
    }

    // Input blur validation
    const validateField = (input, errorId, validator) => {
      const errorEl = container.querySelector(errorId);
      if (!input || !errorEl) return true;
      const isValid = validator(input.value.trim());
      if (!isValid) {
        input.classList.add("is-invalid");
        errorEl.style.display = "block";
        return false;
      } else {
        input.classList.remove("is-invalid");
        errorEl.style.display = "none";
        return true;
      }
    };

    const isEmailValid = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (nameInput) {
      nameInput.addEventListener("blur", () => {
        validateField(nameInput, "#nameError", (val) => val.length >= 2);
      });
    }
    if (emailInput) {
      emailInput.addEventListener("blur", () => {
        validateField(emailInput, "#emailError", isEmailValid);
      });
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", () => {
        validateField(categorySelect, "#categoryError", (val) => val !== "");
      });
    }
    if (subjectInput) {
      subjectInput.addEventListener("blur", () => {
        validateField(subjectInput, "#subjectError", (val) => val.length >= 3);
      });
    }
    if (messageInput) {
      messageInput.addEventListener("blur", () => {
        validateField(messageInput, "#messageError", (val) => val.length >= 15);
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const isNameOk = validateField(nameInput, "#nameError", (val) => val.length >= 2);
      const isEmailOk = validateField(emailInput, "#emailError", isEmailValid);
      const isCategoryOk = validateField(categorySelect, "#categoryError", (val) => val !== "");
      const isSubjectOk = validateField(subjectInput, "#subjectError", (val) => val.length >= 3);
      const isMessageOk = validateField(messageInput, "#messageError", (val) => val.length >= 15);

      if (!isNameOk || !isEmailOk || !isCategoryOk || !isSubjectOk || !isMessageOk) {
        if (statusBanner && statusText) {
          statusBanner.className = "contact-status-banner is-error";
          statusText.textContent = "Please resolve the highlighted fields before submitting your inquiry.";
          statusBanner.style.display = "flex";
        }
        return;
      }

      // Enter loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spin-animation" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          <span>Sending Inquiry...</span>
        `;
      }

      // Clearly inform the user about pending backend submission integration
      // and provide direct instant mailto link to guarantee reliable contact
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>Submit Inquiry</span>
          `;
        }

        const nameVal = encodeURIComponent(nameInput.value.trim());
        const categoryVal = encodeURIComponent(categorySelect.value);
        const subjectVal = encodeURIComponent(`[${categorySelect.value}] ${subjectInput.value.trim()}`);
        const bodyVal = encodeURIComponent(`Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\nCategory: ${categorySelect.value}\n\nMessage:\n${messageInput.value.trim()}`);
        const mailtoUrl = `mailto:raktdal@gmail.com?subject=${subjectVal}&body=${bodyVal}`;

        if (statusBanner && statusText) {
          statusBanner.className = "contact-status-banner is-info";
          statusText.innerHTML = `
            <div>
              <strong>Inquiry Prepared:</strong> Direct web form API submission is pending backend integration. You can send this message immediately by clicking 
              <a href="${mailtoUrl}" style="color:var(--primary); font-weight:700; text-decoration:underline;">Send via Email (raktdal@gmail.com)</a>.
            </div>
          `;
          statusBanner.style.display = "flex";
          statusBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 700);
    });
  },

  renderPrivacy(container) {
    container.innerHTML = `
      <div style="background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%); padding: 60px 20px 40px; border-bottom: 1px solid var(--border);">
        <div style="max-width: 860px; margin: 0 auto; text-align: center;">
          <span style="display: inline-flex; align-items: center; gap: 8px; background: #fee2e2; color: var(--red); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            🛡️ Your Data, Your Control
          </span>
          <h1 style="font-size: 2.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0 0 16px;">
            Privacy Policy & Consent Architecture
          </h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; max-width: 720px; margin: 0 auto;">
            Last updated: November 2026. How RaktDal protects your personal and healthcare information.
          </p>
        </div>
      </div>

      <div style="max-width: 860px; margin: 0 auto; padding: 48px 20px 80px; color: var(--text-main); line-height: 1.7;">
        
        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 32px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; margin: 0 0 12px; color: var(--red);">1. Core Privacy Principle: Zero Unsolicited Data Exposure</h3>
          <p style="color: var(--text-muted); margin: 0 0 16px;">
            RaktDal does NOT sell, monetize, or publicly distribute donor contact lists. Your phone number, residential address, and email are never shown in public directory searches without explicit toggle consent.
          </p>
          <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 6px; font-size: 0.92rem; color: #334155;">
            <strong>In-App Alert Privacy:</strong> In-app alerts allow emergency requesters to notify you through platform notifications without ever seeing your private phone number.
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 32px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; margin: 0 0 12px;">2. Information We Collect</h3>
          <ul style="color: var(--text-muted); padding-left: 20px; margin: 0 0 16px;">
            <li style="margin-bottom: 8px;"><strong>Account Details:</strong> Name, verified email address, and encrypted authentication tokens.</li>
            <li style="margin-bottom: 8px;"><strong>Donor Profile Data:</strong> Blood group, city, state, postal code, age, and preferred notification channels.</li>
            <li style="margin-bottom: 8px;"><strong>Blood Requests:</strong> Patient hospital, required units, clinical contact, and urgency level.</li>
          </ul>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 32px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; margin: 0 0 12px;">3. Consent & Control Over Your Profile</h3>
          <p style="color: var(--text-muted); margin: 0 0 14px;">
            Donors maintain complete autonomy over their visibility at all times:
          </p>
          <ul style="color: var(--text-muted); padding-left: 20px; margin: 0 0 16px;">
            <li style="margin-bottom: 8px;"><strong>Public Discovery Toggle:</strong> You can pause public directory indexing with one click in your Donor Dashboard.</li>
            <li style="margin-bottom: 8px;"><strong>Availability Switch:</strong> Set your status to Unavailable whenever you are traveling, recovering, or unable to donate.</li>
            <li style="margin-bottom: 8px;"><strong>Response-Scoped Contact Sharing:</strong> Your contact details are only disclosed to a requester after you actively choose to click "Offer to Donate".</li>
          </ul>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
          <h3 style="font-size: 1.35rem; font-weight: 700; margin: 0 0 12px;">4. Security & Cryptographic Standards</h3>
          <p style="color: var(--text-muted); margin: 0;">
            All credentials use Argon2id hashing algorithms, session cookies are configured with HttpOnly and SameSite flags, and communications are protected via HTTPS TLS encryption.
          </p>
        </div>

      </div>
    `;
  },

  renderTerms(container) {
    container.innerHTML = `
      <div style="background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%); padding: 60px 20px 40px; border-bottom: 1px solid var(--border);">
        <div style="max-width: 860px; margin: 0 auto; text-align: center;">
          <span style="display: inline-flex; align-items: center; gap: 8px; background: #fee2e2; color: var(--red); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            ⚖️ Platform Guidelines
          </span>
          <h1 style="font-size: 2.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0 0 16px;">
            Terms and Conditions
          </h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; max-width: 720px; margin: 0 auto;">
            Rules and guidelines governing your participation in the RaktDal network.
          </p>
        </div>
      </div>

      <div style="max-width: 860px; margin: 0 auto; padding: 48px 20px 80px; color: var(--text-main); line-height: 1.7;">
        
        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 28px;">
          <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 12px; color: var(--red);">1. Strictly Voluntary & Non-Remunerated</h3>
          <p style="color: var(--text-muted); margin: 0;">
            Commercial buying or selling of human blood is strictly illegal under the Drugs and Cosmetics Act (India) and is fundamentally prohibited on RaktDal. Any user soliciting money or gifts will be permanently banned and reported to relevant law enforcement bodies.
          </p>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 28px;">
          <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 12px;">2. User Responsibility & Accurate Information</h3>
          <p style="color: var(--text-muted); margin: 0;">
            Users submitting blood requests or donor profiles must provide truthful, authentic information. Fake requests or fraudulent emergency claims impair clinical responses and may result in immediate account suspension.
          </p>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 28px;">
          <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 12px;">3. Independent Medical Judgment</h3>
          <p style="color: var(--text-muted); margin: 0;">
            RaktDal provides a technology coordination layer. Transfusion compatibility, donor fitness, and disease screening must be executed independently by authorized clinical laboratories and hospital personnel.
          </p>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
          <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 12px;">4. Account Termination</h3>
          <p style="color: var(--text-muted); margin: 0;">
            We reserve the right to suspend or terminate accounts that breach community privacy, spam other users, or attempt automated scraping of donor information.
          </p>
        </div>

      </div>
    `;
  },

  renderDisclaimer(container) {
    container.innerHTML = `
      <div style="background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%); padding: 60px 20px 40px; border-bottom: 1px solid var(--border);">
        <div style="max-width: 860px; margin: 0 auto; text-align: center;">
          <span style="display: inline-flex; align-items: center; gap: 8px; background: #fef3c7; color: #b45309; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            ⚠️ Essential Medical Advisory
          </span>
          <h1 style="font-size: 2.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0 0 16px;">
            Medical Disclaimer
          </h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; max-width: 720px; margin: 0 auto;">
            Please read this advisory carefully before using RaktDal for blood donation or emergency coordination.
          </p>
        </div>
      </div>

      <div style="max-width: 860px; margin: 0 auto; padding: 48px 20px 80px; color: var(--text-main); line-height: 1.7;">
        
        <div style="background: #fffbeb; border-left: 5px solid #d97706; padding: 24px 28px; border-radius: 12px; margin-bottom: 32px;">
          <h3 style="margin: 0 0 8px; font-size: 1.2rem; color: #92400e; font-weight: 700;">No Substitute for Medical Diagnosis or Professional Judgment</h3>
          <p style="margin: 0; color: #78350f; font-size: 0.95rem; line-height: 1.6;">
            RaktDal is a digital communication platform and does NOT provide medical advice, transfusion verification, or laboratory diagnostic screening.
          </p>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); margin-bottom: 28px;">
          <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 12px;">Mandatory Clinical Screening</h3>
          <p style="color: var(--text-muted); margin: 0 0 14px;">
            Before any blood transfusion occurs, authorized hospital blood bank staff and pathologists MUST independently perform:
          </p>
          <ul style="color: var(--text-muted); padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 8px;">ABO and Rh (D) blood typing and cross-matching of patient and donor units.</li>
            <li style="margin-bottom: 8px;">Mandatory testing for Transfusion-Transmissible Infections (TTIs) including HIV, Hepatitis B (HBV), Hepatitis C (HCV), Syphilis, and Malaria.</li>
            <li style="margin-bottom: 8px;">Donor hemoglobin, pulse, weight, and blood pressure assessment.</li>
          </ul>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
          <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0 0 12px;">In Case of Life-Threatening Emergency</h3>
          <p style="color: var(--text-muted); margin: 0 0 16px;">
            If you or a family member is in critical trauma or active bleeding, immediately visit the nearest emergency medical room or call national ambulance services (108 / 112). Do not rely solely on asynchronous internet postings for immediate life support.
          </p>
          <a href="#/blood-banks" class="button">Browse Verified Blood Banks</a>
        </div>

      </div>
    `;
  },

  renderHelp(container) {
    container.innerHTML = `
      <div style="background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%); padding: 60px 20px 40px; border-bottom: 1px solid var(--border);">
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
          <span style="display: inline-flex; align-items: center; gap: 8px; background: #fee2e2; color: var(--red); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            ❓ Knowledge Base & FAQs
          </span>
          <h1 style="font-size: 2.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0 0 16px;">
            Help & Frequently Asked Questions
          </h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; max-width: 720px; margin: 0 auto;">
            Find quick answers to common questions about donating blood, posting requests, and managing your account.
          </p>
        </div>
      </div>

      <div style="max-width: 900px; margin: 0 auto; padding: 48px 20px 80px;">
        
        <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 48px;">
          
          <div class="request-card" style="padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
            <h4 style="margin: 0 0 8px; font-size: 1.15rem; color: var(--text-main); font-weight: 700;">Who is eligible to donate blood?</h4>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
              Generally, healthy individuals aged 18–65 years, weighing at least 45 kg, with hemoglobin above 12.5 g/dL and no active infections or recent major surgeries can donate blood. Men can donate whole blood every 3 months, and women every 4 months.
            </p>
          </div>

          <div class="request-card" style="padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
            <h4 style="margin: 0 0 8px; font-size: 1.15rem; color: var(--text-main); font-weight: 700;">How do I stop receiving alert notifications when I am busy?</h4>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
              Head to your <strong>Donor Dashboard</strong> (` + `#/donor/dashboard` + `) and click on <strong>Availability Toggle</strong>. Switching your status to "Unavailable" temporarily pauses all discovery and alerts until you're ready to donate again.
            </p>
          </div>

          <div class="request-card" style="padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
            <h4 style="margin: 0 0 8px; font-size: 1.15rem; color: var(--text-main); font-weight: 700;">How do I offer to donate for a patient's request?</h4>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
              Open <strong>Blood Requests</strong> (` + `#/requests` + `), select the relevant request, and click "Offer to Donate". Enter the number of units you can provide and any notes. The requester will instantly receive your verified contact details to coordinate.
            </p>
          </div>

          <div class="request-card" style="padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
            <h4 style="margin: 0 0 8px; font-size: 1.15rem; color: var(--text-main); font-weight: 700;">Is my phone number visible to everyone on the internet?</h4>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
              No. RaktDal enforces strict privacy filters. Your contact number is only shared when you proactively submit an offer to a specific patient request or if you explicitly enable public contact in your consent settings.
            </p>
          </div>

        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 36px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
          <h3 style="margin: 0 0 8px; font-size: 1.35rem; color: var(--text-main); font-weight: 800;">Still Have Questions?</h3>
          <p style="color: var(--text-muted); margin: 0 0 20px;">Our support team is available to assist you with any questions or technical issues.</p>
          <a href="#/contact" class="button">Contact Support Team</a>
        </div>

      </div>
    `;
  }
};

