import { icons } from "../icons.js";
import { authState } from "../auth.js";

export const infoViews = {
  renderAbout(container) {
    container.innerHTML = `
      <div class="legal-compact-wrap">
        <div class="legal-compact-card">
          <div class="legal-compact-header">
            <span class="legal-compact-badge">About RaktDal</span>
            <h1>Bridging the Gap for Voluntary Blood Donation</h1>
            <p class="legal-compact-sub">A transparent, volunteer-driven coordination platform designed for patients, donors, and healthcare centers across India.</p>
          </div>

          <div class="legal-compact-grid">
            <div class="legal-item">
              <h3>1. Our Mission</h3>
              <p>Eliminate critical delays in emergency blood access by connecting willing donors directly with verified hospital requests and patient families.</p>
            </div>
            <div class="legal-item">
              <h3>2. 100% Voluntary &amp; Ethical</h3>
              <p>Strictly non-commercial and aligned with National Blood Transfusion Council policies. No middlemen, no commercial trade, and zero charges.</p>
            </div>
            <div class="legal-item">
              <h3>3. Privacy-First Architecture</h3>
              <p>Personal contact details remain protected and are never exposed publicly. Donors connect only upon explicit consent for specific verified needs.</p>
            </div>
            <div class="legal-item">
              <h3>4. Pan-India Network</h3>
              <p>Uniting voluntary donors, licensed blood banks, and community donation camps into a unified, accessible national healthcare system.</p>
            </div>
          </div>

          <div class="legal-compact-footer">
            <span>RaktDal Coordination Platform</span>
            <div class="legal-compact-links">
              <a href="#/donor/register" class="legal-compact-btn">Become a Donor</a>
              <a href="#/how-it-works" class="legal-compact-btn legal-compact-btn-outline">How It Works</a>
              <a href="#/contact" class="legal-compact-btn legal-compact-btn-outline">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderHowItWorks(container) {
    container.innerHTML = `
      <div class="legal-compact-wrap">
        <div class="legal-compact-card">
          <div class="legal-compact-header">
            <span class="legal-compact-badge">Simple &amp; Transparent Flow</span>
            <h1>How RaktDal Works</h1>
            <p class="legal-compact-sub">Fast, simple 4-step coordination flow connecting voluntary donors with real-time patient requirements.</p>
          </div>

          <div class="legal-compact-grid">
            <div class="legal-item">
              <h3>Step 1: Register or Search</h3>
              <p>Donors register voluntary availability in under two minutes. Requesters or patient families search nearby donors by blood group and city.</p>
            </div>
            <div class="legal-item">
              <h3>Step 2: Emergency Request</h3>
              <p>Requesters post verified emergency needs with patient details, hospital location, and attending physician or hospital contact numbers.</p>
            </div>
            <div class="legal-item">
              <h3>Step 3: Instant Local Match</h3>
              <p>Matching voluntary donors receive direct notifications in their city without exposing phone numbers or sensitive private information.</p>
            </div>
            <div class="legal-item">
              <h3>Step 4: Safe Clinical Donation</h3>
              <p>Willing donors confirm participation and donate safely at the verified hospital or licensed blood bank under certified medical supervision.</p>
            </div>
          </div>

          <div class="legal-compact-footer">
            <span>Every Connection Can Save a Life</span>
            <div class="legal-compact-links">
              <a href="#/requests/create" class="legal-compact-btn">Request Blood</a>
              <a href="#/find-blood" class="legal-compact-btn legal-compact-btn-outline">Find Donors</a>
              <a href="#/about" class="legal-compact-btn legal-compact-btn-outline">About RaktDal</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderContact(container) {
    container.innerHTML = `
      <div class="contact-page-container">
        <!-- 1. Hero Section -->
        <section class="contact-hero-section" aria-labelledby="contactHeroHeading">
          <div class="contact-hero-inner">
            <div class="contact-hero-text">
              <span class="contact-badge">
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
      <div class="legal-compact-wrap">
        <div class="legal-compact-card">
          <div class="legal-compact-header">
            <span class="legal-compact-badge">Privacy &amp; Data Protection</span>
            <h1>Privacy Policy</h1>
            <p class="legal-compact-sub">RaktDal prioritizes donor privacy, granular consent, and strict data security.</p>
          </div>

          <div class="legal-compact-grid">
            <div class="legal-item">
              <h3>1. Data We Collect</h3>
              <p>Essential profile details only: name, verified email, blood group, age (18–65), and city/PIN code for local donor matching.</p>
            </div>
            <div class="legal-item">
              <h3>2. Privacy by Design</h3>
              <p>Phone numbers and emails are never exposed publicly. Emergency requests notify you through secure, masked coordination.</p>
            </div>
            <div class="legal-item">
              <h3>3. Independent Controls</h3>
              <p>You can toggle public discovery or pause availability at any moment directly from your donor dashboard.</p>
            </div>
            <div class="legal-item">
              <h3>4. Zero Commercial Sale</h3>
              <p>We never sell, rent, or trade donor records. Data is solely used for non-commercial voluntary blood donation matching.</p>
            </div>
          </div>

          <div class="legal-compact-footer">
            <span>Last Updated: November 2026</span>
            <div class="legal-compact-links">
              <a href="#/donor/dashboard" class="legal-compact-btn">Privacy</a>
              <a href="#/terms" class="legal-compact-btn legal-compact-btn-outline">Terms</a>
              <a href="#/disclaimer" class="legal-compact-btn legal-compact-btn-outline">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderTerms(container) {
    container.innerHTML = `
      <div class="legal-compact-wrap">
        <div class="legal-compact-card">
          <div class="legal-compact-header">
            <span class="legal-compact-badge">Platform Rules</span>
            <h1>Terms and Conditions</h1>
            <p class="legal-compact-sub">Rules governing voluntary participation and use of the RaktDal network.</p>
          </div>

          <div class="legal-compact-grid">
            <div class="legal-item">
              <h3>1. Voluntary Participation</h3>
              <p>All blood donations are 100% voluntary, unpaid, and altruistic. Commercial transactions or sale of blood are strictly prohibited.</p>
            </div>
            <div class="legal-item">
              <h3>2. Coordination Only</h3>
              <p>RaktDal facilitates connections between donors and requesters. We do not operate blood banks or provide direct clinical services.</p>
            </div>
            <div class="legal-item">
              <h3>3. Accurate Information</h3>
              <p>Users must provide accurate details. Medical fitness and suitability must always be confirmed by licensed medical professionals.</p>
            </div>
            <div class="legal-item">
              <h3>4. Account Integrity</h3>
              <p>Accounts that spam, harass, or attempt automated scraping of donor information are subject to immediate suspension.</p>
            </div>
          </div>

          <div class="legal-compact-footer">
            <span>Effective: November 2026</span>
            <div class="legal-compact-links">
              <a href="#/privacy" class="legal-compact-btn legal-compact-btn-outline">Privacy Policy</a>
              <a href="#/disclaimer" class="legal-compact-btn legal-compact-btn-outline">Medical Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderDisclaimer(container) {
    container.innerHTML = `
      <div class="legal-compact-wrap">
        <div class="legal-compact-card">
          <div class="legal-compact-header">
            <span class="legal-compact-badge badge-warning">Medical Advisory</span>
            <h1>Medical Disclaimer</h1>
            <p class="legal-compact-sub">Essential healthcare advisory regarding blood donation and emergency requests.</p>
          </div>

          <div class="legal-compact-grid">
            <div class="legal-item">
              <h3>1. Not Medical Advice</h3>
              <p>RaktDal does not provide medical diagnosis, treatment, or clinical recommendations. Content is for informational coordination only.</p>
            </div>
            <div class="legal-item">
              <h3>2. Professional Verification</h3>
              <p>Blood compatibility, donor fitness, and disease screening must always be conducted independently by certified medical staff.</p>
            </div>
            <div class="legal-item">
              <h3>3. Critical Emergencies</h3>
              <p>In life-threatening situations, always contact emergency medical services (108/112) and hospital emergency units immediately.</p>
            </div>
            <div class="legal-item">
              <h3>4. No Transfusion Guarantee</h3>
              <p>Donor availability status does not guarantee immediate donation or transfusion success. Clinical evaluation is always mandatory.</p>
            </div>
          </div>

          <div class="legal-compact-footer">
            <span>Protocol: NBTC Guidelines (Nov 2026)</span>
            <div class="legal-compact-links">
              <a href="#/blood-banks" class="legal-compact-btn">Find Blood Banks</a>
              <a href="#/help" class="legal-compact-btn legal-compact-btn-outline">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderHelp(container) {
    container.innerHTML = `
      <div class="legal-compact-wrap">
        <div class="legal-compact-card">
          <div class="legal-compact-header">
            <span class="legal-compact-badge">Support &amp; FAQ</span>
            <h1>Help &amp; Support</h1>
            <p class="legal-compact-sub">Quick answers to common questions about using RaktDal.</p>
          </div>

          <div class="legal-compact-grid">
            <div class="legal-item">
              <h3>How do I donate?</h3>
              <p>Register as a voluntary donor, specify your blood group and city, and set your status to available to receive local alerts.</p>
            </div>
            <div class="legal-item">
              <h3>Who is eligible?</h3>
              <p>Healthy individuals aged 18–65, weighing &ge;45 kg, with hemoglobin &ge;12.5 g/dL and no recent illness or surgery.</p>
            </div>
            <div class="legal-item">
              <h3>How to request blood?</h3>
              <p>Navigate to "Blood Requests", click "Create Blood Request", and provide hospital details and clinical contact numbers.</p>
            </div>
            <div class="legal-item">
              <h3>Is my phone number private?</h3>
              <p>Yes. Contact details are never exposed in public searches; donors connect only after explicit consent for a verified request.</p>
            </div>
          </div>

          <div class="legal-compact-footer">
            <span>Need more help?</span>
            <div class="legal-compact-links">
              <a href="#/contact" class="legal-compact-btn">Contact Us</a>
              <a href="#/privacy" class="legal-compact-btn legal-compact-btn-outline">Privacy</a>
              <a href="#/terms" class="legal-compact-btn legal-compact-btn-outline">Terms</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
