import { icons } from "../icons.js";

export const infoViews = {
  renderAbout(container) {
    container.innerHTML = `
      <div style="background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%); padding: 60px 20px 40px; border-bottom: 1px solid var(--border);">
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
          <span style="display: inline-flex; align-items: center; gap: 8px; background: #fee2e2; color: var(--red); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            ❤️ Our Mission & Vision
          </span>
          <h1 style="font-size: 2.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0 0 16px;">
            Bridging the Critical Gap Between Donors and Patients
          </h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; max-width: 720px; margin: 0 auto;">
            RaktDal is India’s open-access voluntary blood donation network, engineered to eliminate emergency blood shortages through technology, privacy protection, and transparent community coordination.
          </p>
        </div>
      </div>

      <div style="max-width: 1040px; margin: 0 auto; padding: 48px 20px 80px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 56px;">
          <div class="request-card" style="padding: 28px; border-radius: 14px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef2f2; color: var(--red); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">
              🛡️
            </div>
            <h3 style="margin: 0 0 10px; font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Donor Privacy First</h3>
            <p style="margin: 0; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
              Personal contact details and donation history are never made public without explicit donor consent. In-app emergency alerts protect donor numbers from spam and data scraping.
            </p>
          </div>

          <div class="request-card" style="padding: 28px; border-radius: 14px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef2f2; color: var(--red); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">
              ⚡
            </div>
            <h3 style="margin: 0 0 10px; font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Rapid Coordination</h3>
            <p style="margin: 0; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
              Geographical matching connects patients and verified hospitals directly with nearby compatible donors in real-time, drastically reducing response hours in critical emergencies.
            </p>
          </div>

          <div class="request-card" style="padding: 28px; border-radius: 14px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: #fef2f2; color: var(--red); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">
              🏥
            </div>
            <h3 style="margin: 0 0 10px; font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Verified Blood Camps</h3>
            <p style="margin: 0; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
              We partner with recognized healthcare organizations, government-approved blood banks, and verified voluntary camps to ensure strict adherence to safe transfusion protocols.
            </p>
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 40px; margin-bottom: 48px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          <div style="display: flex; gap: 32px; flex-wrap: wrap; align-items: center;">
            <div style="flex: 1; min-width: 280px;">
              <h2 style="font-size: 1.7rem; font-weight: 800; color: var(--text-main); margin: 0 0 16px;">Why RaktDal Was Built</h2>
              <p style="color: var(--text-muted); line-height: 1.7; margin: 0 0 14px;">
                Every day in India, thousands of families struggle during surgical and trauma emergencies to arrange compatible blood units. Fragmented WhatsApp groups and social media requests frequently expose sensitive personal contact information or cause critical delays.
              </p>
              <p style="color: var(--text-muted); line-height: 1.7; margin: 0;">
                RaktDal addresses this by standardizing blood request requirements, enabling structured donor responses, verifying blood camp schedules, and upholding privacy and medical compliance.
              </p>
            </div>
            <div style="background: var(--red-light); border-left: 4px solid var(--red); padding: 24px; border-radius: 10px; max-width: 340px;">
              <h4 style="margin: 0 0 8px; color: var(--red-dark); font-size: 1.05rem;">National Voluntary Goal</h4>
              <p style="margin: 0; font-size: 0.88rem; color: #7f1d1d; line-height: 1.5;">
                Promoting 100% voluntary, non-remunerated regular blood donations across urban and rural healthcare centres in accordance with national safety guidelines.
              </p>
            </div>
          </div>
        </div>

        <div style="text-align: center; padding: 36px 20px; background: #fff5f5; border-radius: 16px;">
          <h3 style="font-size: 1.4rem; font-weight: 700; margin: 0 0 10px; color: var(--text-main);">Be a Part of the Life-Saving Mission</h3>
          <p style="color: var(--text-muted); margin: 0 0 20px;">Registering as a voluntary donor takes less than 2 minutes and can save up to 3 lives.</p>
          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            <a href="#/donor/register" class="button">Become a Donor</a>
            <a href="#/find-blood" class="button button-outline">Find Blood Donors</a>
          </div>
        </div>
      </div>
    `;
  },

  renderHowItWorks(container) {
    container.innerHTML = `
      <div style="background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%); padding: 60px 20px 40px; border-bottom: 1px solid var(--border);">
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
          <span style="display: inline-flex; align-items: center; gap: 8px; background: #fee2e2; color: var(--red); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            ⚙️ Simple & Streamlined
          </span>
          <h1 style="font-size: 2.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0 0 16px;">
            How RaktDal Works
          </h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; max-width: 720px; margin: 0 auto;">
            A fast, secure, step-by-step workflow designed to connect patients in emergency need with active voluntary donors in their area.
          </p>
        </div>
      </div>

      <div style="max-width: 960px; margin: 0 auto; padding: 50px 20px 80px;">
        <div style="display: flex; flex-direction: column; gap: 32px; margin-bottom: 56px;">
          
          <div style="display: flex; gap: 24px; align-items: flex-start; background: #ffffff; padding: 28px; border-radius: 14px; border: 1px solid var(--border); box-shadow: 0 3px 12px rgba(0,0,0,0.03);">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--red); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800; flex-shrink: 0;">
              1
            </div>
            <div>
              <h3 style="margin: 0 0 8px; font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Post a Blood Request</h3>
              <p style="margin: 0 0 12px; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
                When blood is urgently needed, create a verified blood request specifying the required blood group, hospital location, required date, and required units. Requests are instantly indexed for matching donors.
              </p>
              <span style="font-size: 0.82rem; background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-weight: 600;">For Patients & Families</span>
            </div>
          </div>

          <div style="display: flex; gap: 24px; align-items: flex-start; background: #ffffff; padding: 28px; border-radius: 14px; border: 1px solid var(--border); box-shadow: 0 3px 12px rgba(0,0,0,0.03);">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--red); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800; flex-shrink: 0;">
              2
            </div>
            <div>
              <h3 style="margin: 0 0 8px; font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Instant Donor Matching & In-App Alerts</h3>
              <p style="margin: 0 0 12px; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
                Search available donors by blood group and city. Use the <strong>In-App Alert</strong> feature to notify active donors in your vicinity without unsolicited phone calls or privacy infringements.
              </p>
              <span style="font-size: 0.82rem; background: #fef2f2; color: var(--red); padding: 4px 10px; border-radius: 6px; font-weight: 600;">Real-Time Notification System</span>
            </div>
          </div>

          <div style="display: flex; gap: 24px; align-items: flex-start; background: #ffffff; padding: 28px; border-radius: 14px; border: 1px solid var(--border); box-shadow: 0 3px 12px rgba(0,0,0,0.03);">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--red); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800; flex-shrink: 0;">
              3
            </div>
            <div>
              <h3 style="margin: 0 0 8px; font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Donor Confirms & Submits Offer</h3>
              <p style="margin: 0 0 12px; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
                Available donors review the hospital location and urgency, then submit a formal response indicating units offered, estimated arrival, and optional message.
              </p>
              <span style="font-size: 0.82rem; background: #f0fdf4; color: #15803d; padding: 4px 10px; border-radius: 6px; font-weight: 600;">Voluntary Donor Action</span>
            </div>
          </div>

          <div style="display: flex; gap: 24px; align-items: flex-start; background: #ffffff; padding: 28px; border-radius: 14px; border: 1px solid var(--border); box-shadow: 0 3px 12px rgba(0,0,0,0.03);">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--red); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800; flex-shrink: 0;">
              4
            </div>
            <div>
              <h3 style="margin: 0 0 8px; font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Hospital Verification & Donation</h3>
              <p style="margin: 0 0 12px; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">
                The patient coordinator receives the donor offer details, coordinates with the hospital blood bank for pre-donation screening (Hb, blood pressure, viral markers), and fulfills the requirement.
              </p>
              <span style="font-size: 0.82rem; background: #fffbeb; color: #b45309; padding: 4px 10px; border-radius: 6px; font-weight: 600;">Clinical Safety Standard</span>
            </div>
          </div>

        </div>

        <div style="text-align: center; background: #ffffff; border: 1px solid var(--border); border-radius: 16px; padding: 40px;">
          <h3 style="font-size: 1.4rem; font-weight: 800; margin: 0 0 10px; color: var(--text-main);">Ready to Get Started?</h3>
          <p style="color: var(--text-muted); margin: 0 0 24px;">Explore active requests or register as a donor today.</p>
          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            <a href="#/requests" class="button">View Blood Requests</a>
            <a href="#/find-blood" class="button button-outline">Search Donors</a>
          </div>
        </div>
      </div>
    `;
  },

  renderContact(container) {
    container.innerHTML = `
      <div style="background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%); padding: 60px 20px 40px; border-bottom: 1px solid var(--border);">
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
          <span style="display: inline-flex; align-items: center; gap: 8px; background: #fee2e2; color: var(--red); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 16px;">
            📞 Support & Inquiries
          </span>
          <h1 style="font-size: 2.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0 0 16px;">
            Contact RaktDal Support
          </h1>
          <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; max-width: 720px; margin: 0 auto;">
            Need technical assistance, want to onboard a blood bank, or have questions about our privacy guidelines? We’re here to help.
          </p>
        </div>
      </div>

      <div style="max-width: 1040px; margin: 0 auto; padding: 48px 20px 80px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
          
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="request-card" style="padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">📧</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">Email Inquiries</h4>
                  <p style="margin: 2px 0 0; color: var(--text-muted); font-size: 0.9rem;">For general queries and technical support</p>
                </div>
              </div>
              <p style="margin: 0; font-weight: 700; color: var(--red); font-size: 1rem;">support@raktdal.org</p>
            </div>

            <div class="request-card" style="padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">🏥</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">Organization Onboarding</h4>
                  <p style="margin: 2px 0 0; color: var(--text-muted); font-size: 0.9rem;">Hospitals, Blood Banks & NGOs</p>
                </div>
              </div>
              <p style="margin: 0; font-weight: 700; color: var(--red); font-size: 1rem;">organizations@raktdal.org</p>
            </div>

            <div class="request-card" style="padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">🚨</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">Emergency Medical Hotline</h4>
                  <p style="margin: 2px 0 0; color: var(--text-muted); font-size: 0.9rem;">National Emergency Helpline (India)</p>
                </div>
              </div>
              <p style="margin: 0; font-weight: 700; color: #15803d; font-size: 1rem;">Dial 112 / 108 (National Emergency)</p>
            </div>
          </div>

          <div class="auth-card" style="padding: 36px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
            <h3 style="margin: 0 0 8px; font-size: 1.4rem; color: var(--text-main);">Send Us a Message</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0 0 24px;">Fill out this form and our team will get back to you within 24 hours.</p>
            
            <form id="contactForm" onsubmit="event.preventDefault(); alert('Thank you for reaching out! Our team has received your message.'); this.reset();">
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">Your Name</label>
                <input type="text" class="input" required placeholder="Full name" style="width: 100%;">
              </div>
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">Email Address</label>
                <input type="email" class="input" required placeholder="you@example.com" style="width: 100%;">
              </div>
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">Subject</label>
                <input type="text" class="input" required placeholder="Query subject" style="width: 100%;">
              </div>
              <div class="form-group" style="margin-bottom: 24px;">
                <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">Message</label>
                <textarea class="input" rows="4" required placeholder="Describe your query or suggestion..." style="width: 100%; resize: vertical;"></textarea>
              </div>
              <button type="submit" class="button" style="width: 100%;">Submit Message</button>
            </form>
          </div>

        </div>
      </div>
    `;
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

