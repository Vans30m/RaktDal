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
            <div class="contact-hero-text">
              <span class="contact-badge">
                <span class="contact-badge-dot" aria-hidden="true"></span>
                Support & Inquiries
              </span>
              <h1 id="contactHeroHeading" class="contact-hero-title">
                How Can We <span class="accent-text">Help You?</span>
              </h1>
              <p class="contact-hero-sub">
                Have questions, need technical assistance, or want to partner with RaktDal? Our coordination team is here to assist you.
              </p>
              <div class="contact-metadata-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Direct Support Desk · Active 24/7 Triage</span>
              </div>
              <div class="contact-hero-ctas">
                <a href="#contactForm" class="button button-primary">
                  Send Us a Message
                </a>
                <a href="#contact-channels" class="button button-outline">
                  Direct Channels
                </a>
              </div>
            </div>

            <div class="contact-hero-visual">
              <svg class="contact-illustration-svg" viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Support desk and healthcare coordination illustration">
                <defs>
                  <linearGradient id="supportGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#C51F26"/>
                    <stop offset="100%" stop-color="#991B1B"/>
                  </linearGradient>
                  <linearGradient id="supportGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#f8fafc"/>
                  </linearGradient>
                </defs>
                <circle cx="240" cy="190" r="140" fill="#fef2f2" opacity="0.8"/>

                <!-- Main Support Shield / Outer Frame -->
                <path d="M240 70 L340 120 V210 C340 275 295 325 240 340 C185 325 140 275 140 210 V120 Z" fill="url(#supportGradCard)" stroke="#e2e8f0" stroke-width="2.5"/>

                <!-- Inner Soft Red Emblem -->
                <path d="M240 95 L315 132 V205 C315 255 280 295 240 310 C200 295 165 255 165 205 V132 Z" fill="#fee2e2" opacity="0.5"/>

                <!-- Central Headset / Support Agent Badge -->
                <circle cx="240" cy="190" r="32" fill="url(#supportGradRed)"/>
                <!-- Headset Icon inside badge -->
                <path d="M228 190 A12 12 0 0 1 252 190 V198 A4 4 0 0 1 248 202 H242" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none"/>
                <rect x="225" y="188" width="5" height="10" rx="2.5" fill="#ffffff"/>
                <rect x="250" y="188" width="5" height="10" rx="2.5" fill="#ffffff"/>

                <!-- Floating Check Badge (Left) -->
                <g transform="translate(90, 110)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#ecfdf5"/>
                  <path d="M18 24 L22 28 L30 20" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <!-- Floating Emergency Lifeline Badge (Right) -->
                <g transform="translate(340, 220)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#eff6ff"/>
                  <path d="M18 24 H30 M24 18 V30" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round"/>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <!-- Main Body -->
        <div class="contact-body-wrapper">
          <!-- 2. Contact Information Cards -->
          <div id="contact-channels" class="contact-section-head">
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
      <div class="privacy-page-container">
        <!-- 1. Hero Section -->
        <section class="privacy-hero-section" aria-labelledby="privacyHeroHeading">
          <div class="privacy-hero-inner">
            <div class="privacy-hero-text">
              <span class="privacy-badge">
                <span class="privacy-badge-dot" aria-hidden="true"></span>
                Your Data, Your Control
              </span>
              <h1 id="privacyHeroHeading" class="privacy-hero-title">
                Your Privacy <span class="accent-text">Matters to Us.</span>
              </h1>
              <p class="privacy-hero-sub">
                Learn how RaktDal handles your information, protects donor privacy, and gives you granular control over your voluntary participation.
              </p>
              <div class="privacy-metadata-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Policy Version: November 2026</span>
              </div>
              <div class="privacy-hero-ctas">
                <a href="#policy-intro" class="button button-primary">
                  Read Privacy Policy
                </a>
                <a href="#/donor/dashboard" class="button button-outline">
                  Manage My Privacy
                </a>
              </div>
            </div>

            <div class="privacy-hero-visual">
              <svg class="privacy-illustration-svg" viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Privacy protection and cryptographic security shield illustration">
                <defs>
                  <linearGradient id="shieldGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#C51E24"/>
                    <stop offset="100%" stop-color="#991B1B"/>
                  </linearGradient>
                  <linearGradient id="shieldGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#f8fafc"/>
                  </linearGradient>
                </defs>
                <circle cx="240" cy="190" r="140" fill="#fef2f2" opacity="0.8"/>
                
                <!-- Main Vault / Shield -->
                <path d="M240 70 L340 120 V210 C340 275 295 325 240 340 C185 325 140 275 140 210 V120 Z" fill="url(#shieldGradCard)" stroke="#e2e8f0" stroke-width="2.5"/>
                
                <!-- Inner Red Shield Accent -->
                <path d="M240 95 L315 132 V205 C315 255 280 295 240 310 C200 295 165 255 165 205 V132 Z" fill="#fee2e2" opacity="0.5"/>
                
                <!-- Central Keyhole & Lock Symbol -->
                <circle cx="240" cy="190" r="28" fill="url(#shieldGradRed)"/>
                <path d="M234 184 A7 7 0 1 1 246 184 L248 204 H232 Z" fill="#ffffff"/>
                
                <!-- Floating Check Badges -->
                <g transform="translate(90, 110)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#ecfdf5"/>
                  <path d="M18 24 L22 28 L30 20" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <g transform="translate(340, 220)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#eff6ff"/>
                  <path d="M18 24 H30 M24 18 V30" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round"/>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <!-- Body Wrapper -->
        <div class="about-body-wrapper">
          <!-- 2. Privacy at a Glance (4 Cards) -->
          <section class="privacy-glance-section" aria-labelledby="glanceHeading">
            <div class="about-section-head">
              <span class="about-badge" style="margin-bottom: 12px;">Summary Principles</span>
              <h2 id="glanceHeading">Privacy at a Glance</h2>
              <p>Core principles governing data collection, access control, and user sovereignty.</p>
            </div>

            <div class="privacy-glance-grid">
              <div class="privacy-glance-card">
                <div class="privacy-glance-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h3>Your Information</h3>
                <p>We collect only essential data: name, verified email, blood group, age, and postal location needed for matching.</p>
              </div>

              <div class="privacy-glance-card">
                <div class="privacy-glance-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
                <h3>Your Control</h3>
                <p>Toggle availability on/off, pause public directory discovery, or manage notification channels at any time.</p>
              </div>

              <div class="privacy-glance-card">
                <div class="privacy-glance-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <h3>Controlled Access</h3>
                <p>Phone numbers and emails are never exposed publicly. Emergency alerts notify you without leaking your details.</p>
              </div>

              <div class="privacy-glance-card">
                <div class="privacy-glance-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <h3>Transparency</h3>
                <p>Zero third-party monetization. We do not sell or trade donor lists to commercial marketing entities.</p>
              </div>
            </div>
          </section>

          <!-- 3. Consent Architecture Section (3 Separate Settings) -->
          <section class="privacy-consent-section" aria-labelledby="consentHeading">
            <div class="privacy-consent-head">
              <span class="about-badge" style="margin-bottom: 12px;">Three Independent Controls</span>
              <h2 id="consentHeading">Our Consent Architecture</h2>
              <p>Three distinct, independently toggled permissions govern your participation. We never bundle consent into an all-or-nothing agreement.</p>
            </div>

            <div class="privacy-consent-grid">
              <!-- Consent 1 -->
              <div class="privacy-consent-card">
                <div>
                  <div class="consent-card-header">
                    <div class="consent-card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                    <h3>Public Discovery</h3>
                  </div>
                  <p class="consent-card-desc">
                    Controls whether your blood group, age, and city appear in the public donor search directory.
                  </p>
                </div>
                <div class="consent-card-details">
                  <p style="margin: 0 0 6px;"><strong>Enabled:</strong> Matched in nearby donor searches.</p>
                  <p style="margin: 0 0 10px;"><strong>Disabled:</strong> Hidden from directory lookups.</p>
                  <a href="#/donor/dashboard" style="color:var(--primary); font-weight:700; text-decoration:none;">Configure in Dashboard &rarr;</a>
                </div>
              </div>

              <!-- Consent 2 -->
              <div class="privacy-consent-card">
                <div>
                  <div class="consent-card-header">
                    <div class="consent-card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                    <h3>Notification Consent</h3>
                  </div>
                  <p class="consent-card-desc">
                    Controls whether the platform can alert you regarding urgent compatible blood requests in your area.
                  </p>
                </div>
                <div class="consent-card-details">
                  <p style="margin: 0 0 6px;"><strong>Enabled:</strong> Receive in-app bell notifications.</p>
                  <p style="margin: 0 0 10px;"><strong>Disabled:</strong> No automated alert notifications sent.</p>
                  <a href="#/donor/dashboard" style="color:var(--primary); font-weight:700; text-decoration:none;">Configure in Dashboard &rarr;</a>
                </div>
              </div>

              <!-- Consent 3 -->
              <div class="privacy-consent-card">
                <div>
                  <div class="consent-card-header">
                    <div class="consent-card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <h3>Contact Sharing</h3>
                  </div>
                  <p class="consent-card-desc">
                    Controls whether your contact number is disclosed to a requester after you click "Offer to Donate".
                  </p>
                </div>
                <div class="consent-card-details">
                  <p style="margin: 0 0 6px;"><strong>Enabled:</strong> Requester sees direct contact details.</p>
                  <p style="margin: 0 0 10px;"><strong>Disabled:</strong> Interaction remains restricted to in-app.</p>
                  <a href="#/donor/dashboard" style="color:var(--primary); font-weight:700; text-decoration:none;">Configure in Dashboard &rarr;</a>
                </div>
              </div>
            </div>
          </section>

          <!-- 4. Privacy Data Flow Diagram -->
          <section class="privacy-flow-section" aria-labelledby="flowHeading">
            <div class="privacy-flow-head">
              <h3 id="flowHeading">How Your Data Flows Through RaktDal</h3>
              <p>A transparent breakdown of how your profile information is processed by our platform.</p>
            </div>

            <div class="privacy-flow-steps">
              <div class="flow-step-item">
                <div class="flow-step-num">1</div>
                <h4>You Provide Details</h4>
                <p>Register via Google and submit voluntary blood group, age, and city location.</p>
              </div>

              <div class="flow-step-item">
                <div class="flow-step-num">2</div>
                <h4>Configure Consent</h4>
                <p>You select discovery visibility, alert preferences, and contact sharing rules.</p>
              </div>

              <div class="flow-step-item">
                <div class="flow-step-num">3</div>
                <h4>Encrypted Matching</h4>
                <p>Platform matches emergency hospital needs by blood group and city proximity.</p>
              </div>

              <div class="flow-step-item">
                <div class="flow-step-num">4</div>
                <h4>Controlled Access</h4>
                <p>Requesters only see what you consented to. Contact details remain private unless accepted.</p>
              </div>
            </div>
          </section>

          <!-- Mobile Quick TOC Selector -->
          <div class="privacy-mobile-toc">
            <label for="mobileTocSelect" style="display:block; font-size:0.85rem; font-weight:700; color:var(--navy); margin-bottom:8px;">
              Jump to Policy Section:
            </label>
            <select id="mobileTocSelect" class="privacy-mobile-toc-select">
              <option value="#policy-intro">1. Introduction &amp; Core Principles</option>
              <option value="#policy-collect">2. Information We Collect</option>
              <option value="#policy-use">3. How We Use Information</option>
              <option value="#policy-donor">4. Donor Privacy &amp; Phone Protection</option>
              <option value="#policy-consent">5. Consent &amp; User Autonomy</option>
              <option value="#policy-notifs">6. Notifications &amp; In-App Alerts</option>
              <option value="#policy-sharing">7. Data Sharing &amp; Third Parties</option>
              <option value="#policy-security">8. Cryptographic &amp; Data Security</option>
              <option value="#policy-retention">9. Data Retention &amp; Deletion</option>
              <option value="#policy-rights">10. Your Rights &amp; Access Controls</option>
              <option value="#policy-children">11. Children's Privacy</option>
              <option value="#policy-updates">12. Policy Updates &amp; Contact</option>
            </select>
          </div>

          <!-- 5. Sticky Two-Column Policy Layout -->
          <div class="privacy-split-wrapper">
            <!-- Left: Sticky Sidebar Table of Contents -->
            <aside class="privacy-toc-sidebar" aria-label="Privacy Policy Table of Contents">
              <div class="privacy-toc-title">Table of Contents</div>
              <nav class="privacy-toc-nav" id="privacyTocNav">
                <a href="#policy-intro" class="privacy-toc-link active"><span class="privacy-toc-num">01</span><span>Introduction</span></a>
                <a href="#policy-collect" class="privacy-toc-link"><span class="privacy-toc-num">02</span><span>Information We Collect</span></a>
                <a href="#policy-use" class="privacy-toc-link"><span class="privacy-toc-num">03</span><span>How We Use Data</span></a>
                <a href="#policy-donor" class="privacy-toc-link"><span class="privacy-toc-num">04</span><span>Donor Privacy</span></a>
                <a href="#policy-consent" class="privacy-toc-link"><span class="privacy-toc-num">05</span><span>Consent &amp; Control</span></a>
                <a href="#policy-notifs" class="privacy-toc-link"><span class="privacy-toc-num">06</span><span>In-App Alerts</span></a>
                <a href="#policy-sharing" class="privacy-toc-link"><span class="privacy-toc-num">07</span><span>Data Sharing</span></a>
                <a href="#policy-security" class="privacy-toc-link"><span class="privacy-toc-num">08</span><span>Security Standards</span></a>
                <a href="#policy-retention" class="privacy-toc-link"><span class="privacy-toc-num">09</span><span>Data Retention</span></a>
                <a href="#policy-rights" class="privacy-toc-link"><span class="privacy-toc-num">10</span><span>Your Rights</span></a>
                <a href="#policy-children" class="privacy-toc-link"><span class="privacy-toc-num">11</span><span>Children's Privacy</span></a>
                <a href="#policy-updates" class="privacy-toc-link"><span class="privacy-toc-num">12</span><span>Updates &amp; Contact</span></a>
              </nav>
            </aside>

            <!-- Right: Actual Policy Content Stream -->
            <div class="privacy-content-stream">
              <!-- Section 1 -->
              <article id="policy-intro" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h2>1. Introduction &amp; Core Principles</h2>
                </div>
                <div class="policy-body">
                  <p>
                    RaktDal is an open-access blood donation coordination platform operating across India. We believe that privacy is an essential human right, especially in healthcare coordination. Our architecture is built upon one unyielding principle: <strong>Zero Unsolicited Data Exposure</strong>.
                  </p>
                  <p>
                    RaktDal does not sell, trade, or monetize donor lists to third-party advertisers, insurance providers, or data brokers. Personal telephone numbers and residential addresses are never displayed on public search pages by default.
                  </p>
                  <div class="policy-callout-box">
                    <strong>Coordination Notice:</strong> RaktDal provides a technology coordination layer. We are not a medical testing facility or hospital, and we do not store physical biological blood samples.
                  </div>
                </div>
              </article>

              <!-- Section 2 -->
              <article id="policy-collect" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <h2>2. Information We Collect</h2>
                </div>
                <div class="policy-body">
                  <p>We collect only the minimum necessary information to facilitate voluntary blood donation coordination:</p>
                  <ul>
                    <li><strong>Account Details:</strong> Full name, verified Google email address, profile picture URL, and secure authentication session tokens.</li>
                    <li><strong>Donor Profile Data:</strong> Blood group (A+, A-, B+, B-, AB+, AB-, O+, O-), age (must be 18 or older), city, district, state, postal PIN code, and preferred contact channel.</li>
                    <li><strong>Emergency Blood Requests:</strong> Hospital name, patient city, required blood group, clinical contact number, required units (capped at 50 units per request), and urgency level.</li>
                    <li><strong>Organization Credentials:</strong> Healthcare organization name, registration/license number, contact email, and authorized administrator details.</li>
                    <li><strong>Technical Audit Logs:</strong> Timestamped IP address, user-agent, and system event identifiers for security moderation and anti-abuse safeguards.</li>
                  </ul>
                </div>
              </article>

              <!-- Section 3 -->
              <article id="policy-use" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h2>3. How We Use Information</h2>
                </div>
                <div class="policy-body">
                  <p>Your information is used strictly to provide and maintain the platform's voluntary services:</p>
                  <ul>
                    <li>Connecting verified patients and hospitals with compatible voluntary donors located in the same city or district.</li>
                    <li>Delivering real-time in-app alerts and notifications when an urgent blood requirement matches your registered blood type.</li>
                    <li>Validating hospital, blood bank, and donation camp credentials through platform moderation audits.</li>
                    <li>Preventing fraud, telemarketing spam, credential misuse, and automated data harvesting through immutable audit logs.</li>
                  </ul>
                </div>
              </article>

              <!-- Section 4 -->
              <article id="policy-donor" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h2>4. Donor Privacy &amp; Phone Protection</h2>
                </div>
                <div class="policy-body">
                  <p>
                    Unlike uncurated social media groups or public spreadsheets where phone numbers are indexed by web search engines and telemarketers, RaktDal prevents data harvesting through:
                  </p>
                  <ul>
                    <li><strong>Masked Public Directory:</strong> Directory searches only show city, age, and blood group. Private phone numbers and personal emails are never rendered in public HTML.</li>
                    <li><strong>In-App Alert Routing:</strong> Requesters notify you through the platform notification bell, keeping your personal contact details confidential.</li>
                  </ul>
                </div>
              </article>

              <!-- Section 5 -->
              <article id="policy-consent" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <h2>5. Consent &amp; User Autonomy</h2>
                </div>
                <div class="policy-body">
                  <p>
                    You retain total autonomy over your profile. From your <a href="#/donor/dashboard" style="color:var(--primary); font-weight:700;">Donor Dashboard</a>, you can independently adjust:
                  </p>
                  <ul>
                    <li><strong>Public Discovery:</strong> Pause indexing anytime so your profile does not appear in donor discovery results.</li>
                    <li><strong>Donor Availability:</strong> Toggle between <em>Available</em> and <em>Unavailable</em> whenever you are traveling, recovering, or resting.</li>
                    <li><strong>Contact Sharing:</strong> Choose whether to reveal your contact details when submitting an offer to donate.</li>
                  </ul>
                </div>
              </article>

              <!-- Section 6 -->
              <article id="policy-notifs" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    </svg>
                  </div>
                  <h2>6. Notifications &amp; In-App Alerts</h2>
                </div>
                <div class="policy-body">
                  <p>
                    Notifications are transmitted using secure WebSocket connections and in-app alert badges. We do not blast unsolicited marketing promotions. Notifications are restricted to urgent blood requests, verification status updates, and critical account security notices.
                  </p>
                </div>
              </article>

              <!-- Section 7 -->
              <article id="policy-sharing" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                  </div>
                  <h2>7. Data Sharing &amp; Third Parties</h2>
                </div>
                <div class="policy-body">
                  <p>
                    We do not share your private data with third parties, with the following transparent operational exceptions:
                  </p>
                  <ul>
                    <li><strong>Participating Healthcare Coordinators:</strong> Contact information is shared only after you deliberately confirm an "Offer to Donate" for a verified request.</li>
                    <li><strong>Google OAuth:</strong> Authentication utilizes Google's identity provider. We receive your verified profile name and email address.</li>
                    <li><strong>Legal &amp; Compliance Mandates:</strong> Where required by applicable Indian statutory laws, court orders, or official law enforcement investigations regarding fraudulent claims.</li>
                  </ul>
                </div>
              </article>

              <!-- Section 8 -->
              <article id="policy-security" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h2>8. Cryptographic &amp; Data Security</h2>
                </div>
                <div class="policy-body">
                  <p>Our platform enforces strict technical security safeguards:</p>
                  <ul>
                    <li><strong>Password Hashing:</strong> Credentials use memory-hard Argon2id hashing algorithms with unique cryptographic salts.</li>
                    <li><strong>Session Protection:</strong> Refresh tokens utilize cryptographic SHA-256 hashing with automated token family reuse detection and revocation.</li>
                    <li><strong>Cookie Flags:</strong> Session cookies are protected with <code>HttpOnly</code>, <code>SameSite=Lax</code>, and <code>Secure</code> flags.</li>
                    <li><strong>Transport Encryption:</strong> All browser-to-server traffic is encrypted using modern TLS (HTTPS) protocols.</li>
                    <li><strong>Injection Safeguards:</strong> Strict NoSQL injection validation and CSRF custom header verification protect state-changing operations.</li>
                  </ul>
                  <div class="policy-callout-box security-accent">
                    <strong>Security Boundary Notice:</strong> While we implement enterprise-grade cryptographic controls, no internet communication can be guaranteed 100% impenetrable. We encourage users to maintain secure device credentials.
                  </div>
                </div>
              </article>

              <!-- Section 9 -->
              <article id="policy-retention" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </div>
                  <h2>9. Data Retention &amp; Deletion</h2>
                </div>
                <div class="policy-body">
                  <p>
                    We retain personal account information as long as your account remains active. Expired emergency blood requests are archived according to platform audit requirements.
                  </p>
                  <p>
                    Users may request complete profile deletion and revocation of consent at any time by contacting our support team at <strong>raktdal@gmail.com</strong>. Upon confirmed deletion, your donor index record is permanently expunged.
                  </p>
                </div>
              </article>

              <!-- Section 10 -->
              <article id="policy-rights" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h2>10. Your Rights &amp; Access Controls</h2>
                </div>
                <div class="policy-body">
                  <p>Under our privacy commitments, you have the right to:</p>
                  <ul>
                    <li><strong>Access:</strong> Review the personal and location data stored in your active profile.</li>
                    <li><strong>Correction:</strong> Update any inaccuracies in your blood group, age, city, or contact information.</li>
                    <li><strong>Withdrawal of Consent:</strong> Turn off discovery, disable notification permissions, or uncheck contact sharing at your discretion.</li>
                    <li><strong>Session Termination:</strong> Review active logged-in device sessions and revoke access with a single click.</li>
                  </ul>
                </div>
              </article>

              <!-- Section 11 -->
              <article id="policy-children" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    </svg>
                  </div>
                  <h2>11. Children's Privacy</h2>
                </div>
                <div class="policy-body">
                  <p>
                    RaktDal is designed strictly for adults aged 18 and older in accordance with national clinical blood donation eligibility criteria. We do not knowingly collect personal information from individuals under 18 years of age. Accounts identified as belonging to minors will be promptly removed.
                  </p>
                </div>
              </article>

              <!-- Section 12 -->
              <article id="policy-updates" class="policy-card">
                <div class="policy-card-head">
                  <div class="policy-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <h2>12. Policy Updates &amp; Contact Us</h2>
                </div>
                <div class="policy-body">
                  <p>
                    We may periodically update this Privacy Policy to reflect platform enhancements or statutory guidelines. Revisions will be published on this page with an updated version date.
                  </p>
                  <p>
                    For questions, data access requests, or privacy clarifications, please contact our team:
                  </p>
                  <div class="policy-callout-box">
                    <strong>RaktDal Privacy Desk</strong><br>
                    Email: <a href="mailto:raktdal@gmail.com" style="color:var(--primary); font-weight:700;">raktdal@gmail.com</a><br>
                    Subject Line: <em>Privacy Policy &amp; Consent Inquiry</em>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- 6. FAQ Accordion Section -->
          <div class="privacy-faq-section" aria-labelledby="privacyFaqHeading">
            <div class="about-section-head">
              <span class="about-badge" style="margin-bottom: 12px;">Common Inquiries</span>
              <h2 id="privacyFaqHeading">Frequently Asked Privacy Questions</h2>
              <p>Quick answers to common questions about data visibility and donor privacy.</p>
            </div>

            <div class="faq-list-grid" id="privacyFaqAccordion">
              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="pfaq-t1" aria-controls="pfaq-p1">
                  <span>Is my mobile number publicly visible on RaktDal?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="pfaq-p1" class="faq-content" role="region" aria-labelledby="pfaq-t1">
                  <div class="faq-inner">
                    No. Your phone number is never displayed in public donor discovery search results. Requesters contact you through secure in-app alerts. Your phone number is only shared if you explicitly opt into contact sharing when accepting a specific request.
                  </div>
                </div>
              </div>

              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="pfaq-t2" aria-controls="pfaq-p2">
                  <span>Can I temporarily disable public donor discovery?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="pfaq-p2" class="faq-content" role="region" aria-labelledby="pfaq-t2">
                  <div class="faq-inner">
                    Yes. You can toggle "Public Discovery" off at any time from your Donor Dashboard. Your profile will immediately stop appearing in directory searches while preserving your account.
                  </div>
                </div>
              </div>

              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="pfaq-t3" aria-controls="pfaq-p3">
                  <span>Can I withdraw notification consent?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="pfaq-p3" class="faq-content" role="region" aria-labelledby="pfaq-t3">
                  <div class="faq-inner">
                    Yes. Notification consent is managed as an independent toggle in your dashboard. Disabling it stops automated matching alerts without affecting your ability to browse blood requests manually.
                  </div>
                </div>
              </div>

              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="pfaq-t4" aria-controls="pfaq-p4">
                  <span>Is my Google password stored by RaktDal?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="pfaq-p4" class="faq-content" role="region" aria-labelledby="pfaq-t4">
                  <div class="faq-inner">
                    No. RaktDal uses Google Single Sign-On (OAuth 2.0). We never see, handle, or store your Google password. Authentication tokens are verified cryptographically.
                  </div>
                </div>
              </div>

              <div class="faq-item">
                <button type="button" class="faq-trigger" aria-expanded="false" id="pfaq-t5" aria-controls="pfaq-p5">
                  <span>How can I contact RaktDal regarding a privacy question?</span>
                  <svg class="faq-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div id="pfaq-p5" class="faq-content" role="region" aria-labelledby="pfaq-t5">
                  <div class="faq-inner">
                    You can contact our privacy desk directly at <strong>raktdal@gmail.com</strong> or submit an inquiry through our <a href="#/contact" style="color:var(--primary); font-weight:700;">Support Center</a>.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 7. Privacy Support CTA -->
          <div class="privacy-cta-card">
            <h2 class="privacy-cta-title">Questions About Your Privacy?</h2>
            <p class="privacy-cta-desc">
              We believe privacy should be understandable and transparent. Contact our team if you have questions about your personal information or consent preferences.
            </p>
            <div class="privacy-cta-buttons">
              <a href="#/contact" class="button contact-cta-btn-white">
                Contact Support
              </a>
              <a href="#/donor/dashboard" class="button contact-cta-btn-red">
                Manage Privacy Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize Interactive TOC Spy & FAQ Accordions
    this.initPrivacyInteractions(container);
  },

  initPrivacyInteractions(container) {
    // 1. FAQ Accordions
    const items = container.querySelectorAll("#privacyFaqAccordion .faq-item");
    items.forEach(item => {
      const trigger = item.querySelector(".faq-trigger");
      const content = item.querySelector(".faq-content");
      if (trigger && content) {
        trigger.addEventListener("click", () => {
          const isOpen = item.classList.contains("is-open");
          items.forEach(other => {
            if (other !== item && other.classList.contains("is-open")) {
              other.classList.remove("is-open");
              const oTrig = other.querySelector(".faq-trigger");
              const oCont = other.querySelector(".faq-content");
              if (oTrig) oTrig.setAttribute("aria-expanded", "false");
              if (oCont) oCont.style.maxHeight = null;
            }
          });
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

    // 2. Mobile TOC Dropdown
    const mobileSelect = container.querySelector("#mobileTocSelect");
    if (mobileSelect) {
      mobileSelect.addEventListener("change", (e) => {
        const targetId = e.target.value;
        const targetEl = container.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    // 3. ScrollSpy for Sticky Table of Contents
    const tocLinks = container.querySelectorAll(".privacy-toc-link");
    const sections = container.querySelectorAll(".policy-card");
    if (sections.length && tocLinks.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            tocLinks.forEach(link => {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });
            if (mobileSelect) {
              mobileSelect.value = `#${id}`;
            }
          }
        });
      }, {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
      });

      sections.forEach(sec => observer.observe(sec));
    }
  },

  renderTerms(container) {
    container.innerHTML = `
      <div class="terms-page-container">
        <!-- 1. Hero Section -->
        <section class="terms-hero-section" aria-labelledby="termsHeroHeading">
          <div class="terms-hero-inner">
            <div class="terms-hero-text">
              <span class="terms-badge">
                <span class="terms-badge-dot" aria-hidden="true"></span>
                Platform Guidelines
              </span>
              <h1 id="termsHeroHeading" class="terms-hero-title">
                Terms and <span class="accent-text">Conditions</span>
              </h1>
              <p class="terms-hero-sub">
                Rules and guidelines governing your participation in the RaktDal voluntary healthcare coordination network.
              </p>
              <div class="terms-metadata-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Effective Version: November 2026</span>
              </div>
              <div class="terms-hero-ctas">
                <a href="#terms-content" class="button button-primary">
                  Read Guidelines
                </a>
                <a href="#/contact" class="button button-outline">
                  Contact Support
                </a>
              </div>
            </div>

            <div class="terms-hero-visual">
              <svg class="terms-illustration-svg" viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Terms of service and legal agreement shield illustration">
                <defs>
                  <linearGradient id="termsGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#C51E24"/>
                    <stop offset="100%" stop-color="#991B1B"/>
                  </linearGradient>
                  <linearGradient id="termsGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#f8fafc"/>
                  </linearGradient>
                </defs>
                <circle cx="240" cy="190" r="140" fill="#fef2f2" opacity="0.8"/>

                <!-- Main Shield / Outer Border -->
                <path d="M240 70 L340 120 V210 C340 275 295 325 240 340 C185 325 140 275 140 210 V120 Z" fill="url(#termsGradCard)" stroke="#e2e8f0" stroke-width="2.5"/>

                <!-- Inner Soft Red Shield -->
                <path d="M240 95 L315 132 V205 C315 255 280 295 240 310 C200 295 165 255 165 205 V132 Z" fill="#fee2e2" opacity="0.5"/>

                <!-- Central Agreement Document Icon -->
                <circle cx="240" cy="190" r="32" fill="url(#termsGradRed)"/>
                <!-- Document / Check Symbol -->
                <rect x="228" y="176" width="24" height="28" rx="3" fill="#ffffff"/>
                <line x1="233" y1="183" x2="247" y2="183" stroke="#C51E24" stroke-width="2" stroke-linecap="round"/>
                <line x1="233" y1="189" x2="247" y2="189" stroke="#C51E24" stroke-width="2" stroke-linecap="round"/>
                <line x1="233" y1="195" x2="241" y2="195" stroke="#C51E24" stroke-width="2" stroke-linecap="round"/>

                <!-- Floating Check Badge (Left) -->
                <g transform="translate(90, 110)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#ecfdf5"/>
                  <path d="M18 24 L22 28 L30 20" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <!-- Floating Trust / Verification Badge (Right) -->
                <g transform="translate(340, 220)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#eff6ff"/>
                  <path d="M18 24 H30 M24 18 V30" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round"/>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <!-- 2. Content Body -->
        <div id="terms-content" class="terms-body-wrapper">
          <div class="terms-main-card">
            
            <!-- Section 1 -->
            <div class="terms-section-block">
              <div class="terms-section-head">
                <span class="terms-number-badge" aria-hidden="true">1</span>
                <h2 class="terms-section-title">1. Strictly Voluntary &amp; Non-Remunerated</h2>
              </div>
              <p class="terms-section-body">
                Commercial buying or selling of human blood is strictly illegal under the Drugs and Cosmetics Act (India) and is fundamentally prohibited on RaktDal. Any user soliciting money or gifts will be permanently banned and reported to relevant law enforcement bodies.
              </p>
            </div>

            <!-- Section 2 -->
            <div class="terms-section-block">
              <div class="terms-section-head">
                <span class="terms-number-badge" aria-hidden="true">2</span>
                <h2 class="terms-section-title">2. User Responsibility &amp; Accurate Information</h2>
              </div>
              <p class="terms-section-body">
                Users submitting blood requests or donor profiles must provide truthful, authentic information. Fake requests or fraudulent emergency claims impair clinical responses and may result in immediate account suspension.
              </p>
            </div>

            <!-- Section 3 -->
            <div class="terms-section-block">
              <div class="terms-section-head">
                <span class="terms-number-badge" aria-hidden="true">3</span>
                <h2 class="terms-section-title">3. Independent Medical Judgment</h2>
              </div>
              <p class="terms-section-body">
                RaktDal provides a technology coordination layer. Transfusion compatibility, donor fitness, and disease screening must be executed independently by authorized clinical laboratories and hospital personnel.
              </p>
            </div>

            <!-- Section 4 -->
            <div class="terms-section-block">
              <div class="terms-section-head">
                <span class="terms-number-badge" aria-hidden="true">4</span>
                <h2 class="terms-section-title">4. Account Termination</h2>
              </div>
              <p class="terms-section-body">
                We reserve the right to suspend or terminate accounts that breach community privacy, spam other users, or attempt automated scraping of donor information.
              </p>
            </div>

            <!-- Protective Healthcare Advisory Box -->
            <div class="terms-notice-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div>
                <strong>Legal &amp; Clinical Notice:</strong> RaktDal operates strictly as a digital coordination platform in accordance with the National Blood Transfusion Council (NBTC) guidelines. We do not provide direct transfusion services or sell therapeutic biological products.
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  renderDisclaimer(container) {
    container.innerHTML = `
      <div class="disclaimer-page-container">
        <!-- 1. Hero Section -->
        <section class="disclaimer-hero-section" aria-labelledby="disclaimerHeroHeading">
          <div class="disclaimer-hero-inner">
            <div class="disclaimer-hero-text">
              <span class="disclaimer-badge">
                <span class="disclaimer-badge-dot" aria-hidden="true"></span>
                Essential Medical Advisory
              </span>
              <h1 id="disclaimerHeroHeading" class="disclaimer-hero-title">
                Medical <span class="accent-text">Disclaimer</span>
              </h1>
              <p class="disclaimer-hero-sub">
                Please read this advisory carefully before using RaktDal for blood donation or emergency coordination.
              </p>
              <div class="disclaimer-metadata-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Clinical Triage Protocol · Updated November 2026</span>
              </div>
              <div class="disclaimer-hero-ctas">
                <a href="#disclaimer-content" class="button button-primary">
                  Read Clinical Advisory
                </a>
                <a href="#/blood-banks" class="button button-outline">
                  Browse Verified Blood Banks
                </a>
              </div>
            </div>

            <div class="disclaimer-hero-visual">
              <svg class="disclaimer-illustration-svg" viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Medical advisory, stethoscope and clinical screening cross shield illustration">
                <defs>
                  <linearGradient id="disclaimerGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#D97706"/>
                    <stop offset="100%" stop-color="#B45309"/>
                  </linearGradient>
                  <linearGradient id="disclaimerGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#fffdf5"/>
                  </linearGradient>
                </defs>
                <circle cx="240" cy="190" r="140" fill="#fef3c7" opacity="0.6"/>

                <!-- Main Shield / Outer Border -->
                <path d="M240 70 L340 120 V210 C340 275 295 325 240 340 C185 325 140 275 140 210 V120 Z" fill="url(#disclaimerGradCard)" stroke="#fef08a" stroke-width="2.5"/>

                <!-- Inner Soft Warm Shield -->
                <path d="M240 95 L315 132 V205 C315 255 280 295 240 310 C200 295 165 255 165 205 V132 Z" fill="#fef9c3" opacity="0.6"/>

                <!-- Central Medical Advisory Badge -->
                <circle cx="240" cy="190" r="32" fill="url(#disclaimerGradAmber)"/>
                <!-- Medical Cross Icon -->
                <path d="M240 176 V204 M226 190 H254" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>

                <!-- Floating Heart/Lifeline Badge (Left) -->
                <g transform="translate(90, 110)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#fef08a" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#fef2f2"/>
                  <path d="M19 24 C19 20 22 18 24 20 C26 18 29 20 29 24 C29 27 24 30 24 30 C24 30 19 27 19 24 Z" fill="#C51F26"/>
                </g>

                <!-- Floating Caution / Warning Badge (Right) -->
                <g transform="translate(340, 220)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#fef08a" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#fffbeb"/>
                  <path d="M24 16 L31 29 H17 Z" stroke="#d97706" stroke-width="2.2" stroke-linejoin="round" fill="none"/>
                  <line x1="24" y1="21" x2="24" y2="24" stroke="#d97706" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="24" cy="26.5" r="1" fill="#d97706"/>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <!-- 2. Content Body -->
        <div id="disclaimer-content" class="disclaimer-body-wrapper">
          
          <!-- Warning Callout Card -->
          <div class="disclaimer-warning-banner">
            <div class="disclaimer-warning-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div class="disclaimer-warning-content">
              <h3>No Substitute for Medical Diagnosis or Professional Judgment</h3>
              <p>
                RaktDal is a digital communication platform and does NOT provide medical advice, transfusion verification, or laboratory diagnostic screening.
              </p>
            </div>
          </div>

          <!-- Card 1: Mandatory Clinical Screening -->
          <div class="disclaimer-card">
            <div class="disclaimer-card-head">
              <div class="disclaimer-card-icon clinical" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2>Mandatory Clinical Screening</h2>
            </div>
            <div class="disclaimer-card-body">
              <p>
                Before any blood transfusion occurs, authorized hospital blood bank staff and pathologists MUST independently perform:
              </p>
              <ul class="disclaimer-checklist">
                <li>
                  <span class="disclaimer-check-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span><strong>Compatibility Testing:</strong> ABO and Rh (D) blood typing and cross-matching of patient and donor units.</span>
                </li>
                <li>
                  <span class="disclaimer-check-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span><strong>Mandatory TTI Screening:</strong> Testing for Transfusion-Transmissible Infections including HIV, Hepatitis B (HBV), Hepatitis C (HCV), Syphilis, and Malaria.</span>
                </li>
                <li>
                  <span class="disclaimer-check-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span><strong>Physical Donor Assessment:</strong> Mandatory donor hemoglobin, pulse, weight, and blood pressure assessment conducted by licensed clinical personnel.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Card 2: Life-Threatening Emergency Protocol -->
          <div class="disclaimer-card">
            <div class="disclaimer-card-head">
              <div class="disclaimer-card-icon emergency" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h2>In Case of Life-Threatening Emergency</h2>
            </div>
            <div class="disclaimer-card-body">
              <p>
                If you or a family member is in critical trauma or active bleeding, immediately visit the nearest emergency medical room or call national ambulance services (108 / 112). Do not rely solely on asynchronous internet postings for immediate life support.
              </p>
              
              <div class="disclaimer-emergency-callout">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  <strong>National Emergency Lifeline:</strong> Dial <strong>108</strong> (Ambulance) or <strong>112</strong> (All-India Unified Emergency Helpline) for immediate clinical transport.
                </div>
              </div>

              <div style="margin-top: 24px;">
                <a href="#/blood-banks" class="button button-primary">Browse Verified Blood Banks</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  renderHelp(container) {
    container.innerHTML = `
      <div class="help-page-container">
        <!-- 1. Hero Section -->
        <section class="help-hero-section" aria-labelledby="helpHeroHeading">
          <div class="help-hero-inner">
            <div class="help-hero-text">
              <span class="help-badge">
                <span class="help-badge-dot" aria-hidden="true"></span>
                Knowledge Base &amp; FAQs
              </span>
              <h1 id="helpHeroHeading" class="help-hero-title">
                Help &amp; Frequently <span class="accent-text">Asked Questions</span>
              </h1>
              <p class="help-hero-sub">
                Find quick answers to common questions about donating blood, posting requests, and managing your account.
              </p>
              <div class="help-metadata-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Live Knowledge Base · 12 Verified Topics</span>
              </div>
              <div class="help-hero-ctas">
                <a href="#help-faq-section" class="button button-primary">
                  Browse Questions
                </a>
                <a href="#/contact" class="button button-outline">
                  Contact Support
                </a>
              </div>
            </div>

            <div class="help-hero-visual">
              <svg class="help-illustration-svg" viewBox="0 0 480 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Knowledge base, search and FAQ support desk illustration">
                <defs>
                  <linearGradient id="helpGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#C51F26"/>
                    <stop offset="100%" stop-color="#991B1B"/>
                  </linearGradient>
                  <linearGradient id="helpGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#f8fafc"/>
                  </linearGradient>
                </defs>
                <circle cx="240" cy="190" r="140" fill="#fef2f2" opacity="0.8"/>

                <!-- Main Support Shield / Outer Frame -->
                <path d="M240 70 L340 120 V210 C340 275 295 325 240 340 C185 325 140 275 140 210 V120 Z" fill="url(#helpGradCard)" stroke="#e2e8f0" stroke-width="2.5"/>

                <!-- Inner Soft Red Frame -->
                <path d="M240 95 L315 132 V205 C315 255 280 295 240 310 C200 295 165 255 165 205 V132 Z" fill="#fee2e2" opacity="0.5"/>

                <!-- Central Question Badge -->
                <circle cx="240" cy="190" r="32" fill="url(#helpGradRed)"/>
                <!-- Question Mark Symbol -->
                <path d="M233.5 180 C234 175 238 172 243 173 C247 174 249.5 178 248 182 C246 186 242 188 240 192 V195" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none"/>
                <circle cx="240" cy="203" r="1.8" fill="#ffffff"/>

                <!-- Floating Search Badge (Left) -->
                <g transform="translate(90, 110)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#eff6ff"/>
                  <circle cx="22" cy="22" r="5" stroke="#0284c7" stroke-width="2" fill="none"/>
                  <line x1="26" y1="26" x2="30" y2="30" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
                </g>

                <!-- Floating Check / Answer Badge (Right) -->
                <g transform="translate(340, 220)">
                  <circle cx="24" cy="24" r="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
                  <circle cx="24" cy="24" r="18" fill="#ecfdf5"/>
                  <path d="M18 24 L22 28 L30 20" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
              </svg>
            </div>
          </div>
        </section>

        <!-- 2. Main Body Wrapper -->
        <div id="help-faq-section" class="help-body-wrapper">
          
          <!-- Search Box -->
          <div class="help-search-container">
            <div class="help-search-box">
              <svg class="help-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="helpFaqSearchInput" class="help-search-input" placeholder="Search for answers (e.g. eligibility, availability, camps, privacy)..." aria-label="Search FAQs">
              <button type="button" id="helpSearchClearBtn" class="help-search-clear" aria-label="Clear search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Category Filter Pills -->
          <div class="help-filter-scroll" role="tablist" aria-label="FAQ Categories">
            <button type="button" class="help-filter-btn active" data-cat="all" role="tab" aria-selected="true">
              <span>All Topics</span>
              <span class="help-filter-count" id="count-all">12</span>
            </button>
            <button type="button" class="help-filter-btn" data-cat="donation" role="tab" aria-selected="false">
              <span>Blood Donation</span>
              <span class="help-filter-count" id="count-donation">3</span>
            </button>
            <button type="button" class="help-filter-btn" data-cat="eligibility" role="tab" aria-selected="false">
              <span>Donor Eligibility</span>
              <span class="help-filter-count" id="count-eligibility">2</span>
            </button>
            <button type="button" class="help-filter-btn" data-cat="requests" role="tab" aria-selected="false">
              <span>Blood Requests</span>
              <span class="help-filter-count" id="count-requests">2</span>
            </button>
            <button type="button" class="help-filter-btn" data-cat="dashboard" role="tab" aria-selected="false">
              <span>Donor Dashboard</span>
              <span class="help-filter-count" id="count-dashboard">2</span>
            </button>
            <button type="button" class="help-filter-btn" data-cat="privacy" role="tab" aria-selected="false">
              <span>Account &amp; Privacy</span>
              <span class="help-filter-count" id="count-privacy">3</span>
            </button>
          </div>

          <!-- FAQ Accordion List -->
          <div class="help-faq-list" id="helpFaqList">
            
            <!-- Item 1 (Original) -->
            <div class="help-faq-item" data-cat="eligibility" data-keywords="eligible eligibility weight age hemoglobin requirements healthy">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Donor Eligibility</span>
                  <h3 class="help-faq-title">Who is eligible to donate blood?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>Generally, healthy individuals aged 18–65 years, weighing at least 45 kg, with hemoglobin above 12.5 g/dL and no active infections or recent major surgeries can donate blood. Men can donate whole blood every 3 months, and women every 4 months.</p>
                </div>
              </div>
            </div>

            <!-- Item 2 (Original) -->
            <div class="help-faq-item" data-cat="dashboard" data-keywords="stop alert notifications busy pause availability toggle status unavailable">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Donor Dashboard</span>
                  <h3 class="help-faq-title">How do I stop receiving alert notifications when I am busy?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>Head to your <strong>Donor Dashboard</strong> (<a href="#/donor/dashboard">#/donor/dashboard</a>) and click on <strong>Availability Toggle</strong>. Switching your status to "Unavailable" temporarily pauses all discovery and alerts until you're ready to donate again.</p>
                </div>
              </div>
            </div>

            <!-- Item 3 (Original) -->
            <div class="help-faq-item" data-cat="requests" data-keywords="offer donate patient request blood requests coordinate units">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Blood Requests</span>
                  <h3 class="help-faq-title">How do I offer to donate for a patient's request?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>Open <strong>Blood Requests</strong> (<a href="#/requests">#/requests</a>), select the relevant request, and click "Offer to Donate". Enter the number of units you can provide and any notes. The requester will instantly receive your verified contact details to coordinate.</p>
                </div>
              </div>
            </div>

            <!-- Item 4 (Original) -->
            <div class="help-faq-item" data-cat="privacy" data-keywords="phone number visible privacy spam settings contact security">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Account &amp; Privacy</span>
                  <h3 class="help-faq-title">Is my phone number visible to everyone on the internet?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>No. RaktDal enforces strict privacy filters. Your contact number is only shared when you proactively submit an offer to a specific patient request or if you explicitly enable public contact in your consent settings.</p>
                </div>
              </div>
            </div>

            <!-- Item 5 -->
            <div class="help-faq-item" data-cat="donation" data-keywords="how it works platform coordination blood bank hospital voluntary">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Blood Donation</span>
                  <h3 class="help-faq-title">What is RaktDal and how does it work?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>RaktDal is India's dedicated voluntary blood donation coordination network. We connect patients, hospitals, and verified blood banks directly with compatible nearby voluntary donors in real-time, removing middlemen and reducing critical transit delays.</p>
                </div>
              </div>
            </div>

            <!-- Item 6 -->
            <div class="help-faq-item" data-cat="donation" data-keywords="money charge fee pay commercial cost free voluntary">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Blood Donation</span>
                  <h3 class="help-faq-title">Does RaktDal charge any fees for connecting donors and patients?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>Absolutely not. RaktDal is 100% free and voluntary. Buying, selling, or charging any financial fee for human blood is illegal under Indian law (Drugs &amp; Cosmetics Act) and strictly prohibited across our network.</p>
                </div>
              </div>
            </div>

            <!-- Item 7 -->
            <div class="help-faq-item" data-cat="requests" data-keywords="create post blood request hospital emergency urgent patient">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Blood Requests</span>
                  <h3 class="help-faq-title">How do I create an urgent blood request for a family member?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>Go to <a href="#/requests">Blood Requests</a> and click <strong>Create Request</strong>. Fill in the hospital name, required units, blood group, urgency level, and contact details. Compatible local donors will be notified immediately.</p>
                </div>
              </div>
            </div>

            <!-- Item 8 -->
            <div class="help-faq-item" data-cat="dashboard" data-keywords="register become donor profile account onboarding">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Donor Dashboard</span>
                  <h3 class="help-faq-title">How do I register as a voluntary blood donor?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>Click on <a href="#/donor/register">Become a Donor</a> in the navigation bar. Sign in with your account, select your blood group, city, state, and availability preferences. Once saved, you will be part of the voluntary donor directory.</p>
                </div>
              </div>
            </div>

            <!-- Item 9 -->
            <div class="help-faq-item" data-cat="eligibility" data-keywords="frequency gap months between donations whole blood platelets">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Donor Eligibility</span>
                  <h3 class="help-faq-title">How frequently can I donate blood or platelets?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>For whole blood donations, healthy male donors can donate every 90 days (3 months) and female donors every 120 days (4 months). Platelet apheresis donations can occur more frequently (typically every 2 weeks, up to 24 times a year), subject to clinical evaluation.</p>
                </div>
              </div>
            </div>

            <!-- Item 10 -->
            <div class="help-faq-item" data-cat="donation" data-keywords="camps blood bank drives schedule venue community">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Blood Donation</span>
                  <h3 class="help-faq-title">How can I find active blood donation camps in my city?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>Visit the <a href="#/camps">Donation Camps</a> section to browse authorized government-recognized blood collection camps, organized by regional blood banks and community groups with verified dates and addresses.</p>
                </div>
              </div>
            </div>

            <!-- Item 11 -->
            <div class="help-faq-item" data-cat="privacy" data-keywords="delete account profile data export removal privacy">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Account &amp; Privacy</span>
                  <h3 class="help-faq-title">Can I remove or delete my donor profile at any time?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>Yes. You maintain full sovereignty over your data. You can toggle off visibility instantly or permanently delete your donor record from the settings section in your dashboard, removing your details immediately from search indices.</p>
                </div>
              </div>
            </div>

            <!-- Item 12 -->
            <div class="help-faq-item" data-cat="privacy" data-keywords="medical screening tests hospital safety security diagnostic">
              <button type="button" class="help-faq-trigger" aria-expanded="false">
                <div class="help-faq-qwrap">
                  <span class="help-faq-cat-tag">Account &amp; Privacy</span>
                  <h3 class="help-faq-title">Does RaktDal perform physical medical testing or blood screening?</h3>
                </div>
                <div class="help-faq-icon-toggle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              <div class="help-faq-content">
                <div class="help-faq-inner">
                  <p>No. RaktDal is strictly a digital communication platform. Physical screening, cross-matching, disease testing (HIV, Hepatitis, Syphilis, Malaria), and transfusion procedures must always be performed independently by licensed hospital pathologists. See our <a href="#/disclaimer">Medical Disclaimer</a>.</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Empty State (Hidden by default) -->
          <div class="help-empty-state" id="helpEmptyState">
            <div class="help-empty-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
            <h3>No matching questions found</h3>
            <p>We couldn't find any questions matching your query. Try searching with different keywords or browse by category.</p>
            <button type="button" id="helpResetFilterBtn" class="button button-outline" style="font-size: 0.88rem; padding: 8px 18px;">
              Reset Search &amp; Filters
            </button>
          </div>

          <!-- Still Have Questions Card -->
          <div class="help-support-card">
            <span class="help-support-badge">
              <span class="help-badge-dot" aria-hidden="true"></span>
              24/7 Assistance
            </span>
            <h2>Still have questions?</h2>
            <p>Our dedicated support and healthcare coordination team is here to help you with any questions or concerns.</p>
            <a href="#/contact" class="help-support-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Contact Support</span>
            </a>
          </div>

        </div>
      </div>
    `;

    // Initialize Interactive Accordion, Search & Filter logic
    this.initHelpPage(container);
  },

  initHelpPage(container) {
    const items = container.querySelectorAll(".help-faq-item");
    const searchInput = container.querySelector("#helpFaqSearchInput");
    const clearBtn = container.querySelector("#helpSearchClearBtn");
    const filterBtns = container.querySelectorAll(".help-filter-btn");
    const emptyState = container.querySelector("#helpEmptyState");
    const resetBtn = container.querySelector("#helpResetFilterBtn");

    let currentCat = "all";
    let searchQuery = "";

    // Toggle Accordion Click
    items.forEach(item => {
      const trigger = item.querySelector(".help-faq-trigger");
      const content = item.querySelector(".help-faq-content");
      const toggle = item.querySelector(".help-faq-icon-toggle");

      if (trigger && content) {
        trigger.addEventListener("click", () => {
          const isOpen = item.classList.contains("is-open");

          // Close other open accordions
          items.forEach(other => {
            if (other !== item && other.classList.contains("is-open")) {
              other.classList.remove("is-open");
              const otherTrigger = other.querySelector(".help-faq-trigger");
              const otherContent = other.querySelector(".help-faq-content");
              const otherToggle = other.querySelector(".help-faq-icon-toggle");
              if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
              if (otherContent) otherContent.style.maxHeight = null;
              if (otherToggle) {
                otherToggle.innerHTML = `
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                `;
              }
            }
          });

          if (isOpen) {
            item.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
            content.style.maxHeight = null;
            if (toggle) {
              toggle.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              `;
            }
          } else {
            item.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
            content.style.maxHeight = content.scrollHeight + "px";
            if (toggle) {
              toggle.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              `;
            }
          }
        });
      }
    });

    // Filtering & Search
    const applyFilters = () => {
      let visibleCount = 0;
      const q = searchQuery.toLowerCase().trim();

      items.forEach(item => {
        const itemCat = item.getAttribute("data-cat");
        const titleText = (item.querySelector(".help-faq-title")?.textContent || "").toLowerCase();
        const bodyText = (item.querySelector(".help-faq-inner")?.textContent || "").toLowerCase();
        const keywords = (item.getAttribute("data-keywords") || "").toLowerCase();

        const matchesCat = (currentCat === "all" || itemCat === currentCat);
        const matchesQuery = (!q || titleText.includes(q) || bodyText.includes(q) || keywords.includes(q));

        if (matchesCat && matchesQuery) {
          item.style.display = "block";
          visibleCount++;
        } else {
          item.style.display = "none";
          // Close if hidden
          if (item.classList.contains("is-open")) {
            item.classList.remove("is-open");
            const trigger = item.querySelector(".help-faq-trigger");
            const content = item.querySelector(".help-faq-content");
            const toggle = item.querySelector(".help-faq-icon-toggle");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
            if (content) content.style.maxHeight = null;
            if (toggle) {
              toggle.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              `;
            }
          }
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? "block" : "none";
      }
    };

    // Search Input Event
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (clearBtn) {
          clearBtn.style.display = searchQuery ? "flex" : "none";
        }
        applyFilters();
      });
    }

    // Clear Button
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        searchQuery = "";
        clearBtn.style.display = "none";
        applyFilters();
        if (searchInput) searchInput.focus();
      });
    }

    // Category Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        currentCat = btn.getAttribute("data-cat");
        applyFilters();
      });
    });

    // Reset Button
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        searchQuery = "";
        if (clearBtn) clearBtn.style.display = "none";
        filterBtns.forEach(b => {
          const isAll = b.getAttribute("data-cat") === "all";
          b.classList.toggle("active", isAll);
          b.setAttribute("aria-selected", isAll ? "true" : "false");
        });
        currentCat = "all";
        applyFilters();
      });
    }
  }
};

