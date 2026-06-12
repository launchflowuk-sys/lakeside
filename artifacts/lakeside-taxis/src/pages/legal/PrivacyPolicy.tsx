import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./legal.css";

export default function PrivacyPolicy() {
  const updated = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" });

  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Privacy policy for Lakeside & Purfleet Taxis Ltd, Thurrock, Essex. How we collect, use and protect your personal information." />
      </Helmet>

      <section className="lg-hero">
        <div className="lg-inner">
          <nav className="lg-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Privacy Policy</span>
          </nav>
          <span className="lg-hero-tag">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="lg-hero-meta">
            <strong>Lakeside &amp; Purfleet Taxis Ltd</strong> · Last updated: {updated}
          </p>
        </div>
      </section>

      <div className="lg-body">
        <div className="lg-inner">
          <div className="lg-doc">

            <div className="lg-content">

              <div className="lg-section">
                <span className="lg-section-num">Section 1</span>
                <h2>Who we are</h2>
                <p>
                  Lakeside &amp; Purfleet Taxis Ltd ("we", "our", "us") is a taxi company based in Thurrock, Essex, UK. This privacy policy explains how we collect, use and protect your personal information when you use our website or contact us to make a booking.
                </p>
                <p>
                  We are committed to handling your personal data responsibly and in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 2</span>
                <h2>What information we collect</h2>
                <p>When you submit a booking request through our website or contact us directly, we may collect the following information:</p>
                <div className="lg-list">
                  {[
                    "Your full name",
                    "Your mobile number",
                    "Your email address",
                    "Journey details (pickup location, destination, date and time)",
                    "Number of passengers and luggage information",
                    "Any additional requirements you provide",
                  ].map((item) => (
                    <div className="lg-list-item" key={item}>{item}</div>
                  ))}
                </div>
                <p>We only collect information that is necessary to process and fulfil your booking request.</p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 3</span>
                <h2>How we use your information</h2>
                <p>We use your personal information solely to:</p>
                <div className="lg-list">
                  {[
                    "Respond to your booking request and provide a price quote",
                    "Contact you to confirm availability and journey details",
                    "Manage your journey if a booking is confirmed",
                    "Send you relevant communications about your confirmed booking",
                  ].map((item) => (
                    <div className="lg-list-item" key={item}>{item}</div>
                  ))}
                </div>
                <p>We do not use your information for marketing purposes and we do not sell your data to third parties.</p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 4</span>
                <h2>Data retention</h2>
                <p>
                  We retain booking request data for a reasonable period in order to manage ongoing journeys and for accounting and legal compliance purposes. Data that is no longer required is securely deleted.
                </p>
                <p>
                  You may request deletion of your personal data at any time by contacting us at <a href="mailto:info@lakesidetaxi.co.uk">info@lakesidetaxi.co.uk</a>.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 5</span>
                <h2>Your rights under UK GDPR</h2>
                <p>Under UK GDPR, you have the following rights regarding your personal data:</p>
                <div className="lg-list">
                  {[
                    "The right to access your personal data",
                    "The right to correct inaccurate data",
                    "The right to request deletion of your data",
                    "The right to restrict or object to processing",
                    "The right to data portability",
                  ].map((item) => (
                    <div className="lg-list-item" key={item}>{item}</div>
                  ))}
                </div>
                <p>
                  To exercise any of these rights, please contact us at <a href="mailto:info@lakesidetaxi.co.uk">info@lakesidetaxi.co.uk</a> or call <a href="tel:01375383878">01375 383878</a>.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 6</span>
                <h2>Contact us about this policy</h2>
                <p>
                  If you have any questions or concerns about how we handle your personal data, please get in touch:
                </p>
                <div className="lg-list">
                  <div className="lg-list-item">Email: <a href="mailto:info@lakesidetaxi.co.uk" style={{ marginLeft: 6 }}>info@lakesidetaxi.co.uk</a></div>
                  <div className="lg-list-item">Phone: <a href="tel:01375383878" style={{ marginLeft: 6 }}>01375 383878</a></div>
                  <div className="lg-list-item">WhatsApp: <a href="https://wa.me/447879956275" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 6 }}>07879 956275</a></div>
                </div>
              </div>

              <div className="lg-contact-note">
                <span className="lg-contact-note-icon">📋</span>
                <div className="lg-contact-note-text">
                  <strong>Also see our other legal documents</strong>
                  <p>
                    Read our <Link href="/terms-conditions">Terms &amp; Conditions</Link> and <Link href="/cookie-policy">Cookie Policy</Link> for further information about how we operate.
                  </p>
                </div>
              </div>

            </div>

            <aside className="lg-sidenav">
              <span className="lg-sidenav-title">On this page</span>
              <nav className="lg-sidenav-links">
                {[
                  "Who we are",
                  "What we collect",
                  "How we use it",
                  "Data retention",
                  "Your rights",
                  "Contact us",
                ].map((item) => (
                  <span key={item} className="lg-sidenav-link">{item}</span>
                ))}
              </nav>
              <div className="lg-sidenav-divider" />
              <span className="lg-sidenav-title">Other legal pages</span>
              <div className="lg-sidenav-other">
                <Link href="/terms-conditions">Terms &amp; Conditions</Link>
                <Link href="/cookie-policy">Cookie Policy</Link>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </Layout>
  );
}
