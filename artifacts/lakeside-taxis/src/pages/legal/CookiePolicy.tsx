import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./legal.css";

export default function CookiePolicy() {
  const updated = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" });

  return (
    <Layout>
      <Helmet>
        <title>Cookie Policy | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Cookie policy for Lakeside & Purfleet Taxis Ltd. We use minimal functional cookies only — no tracking or advertising cookies." />
      </Helmet>

      <section className="lg-hero">
        <div className="lg-inner">
          <nav className="lg-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>Cookie Policy</span>
          </nav>
          <span className="lg-hero-tag">Legal</span>
          <h1>Cookie Policy</h1>
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
                <h2>What are cookies?</h2>
                <p>
                  Cookies are small text files that are stored on your device (computer, tablet or phone) when you visit a website. They are widely used to make websites work correctly, improve performance, and provide a better user experience.
                </p>
                <p>
                  Cookies cannot carry viruses or install malware on your device.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 2</span>
                <h2>How we use cookies</h2>
                <p>
                  Our website uses only the minimal cookies necessary for the site to function correctly. We do not use tracking cookies, advertising cookies, or any form of behavioural profiling. We do not share cookie data with third parties.
                </p>
                <p>The cookies we use are:</p>
                <div className="lg-list">
                  {[
                    "Session cookies — to maintain your browsing session while you navigate the site. These are deleted automatically when you close your browser.",
                    "Functional cookies — to remember your preferences during a visit, such as form progress. These expire at the end of your session.",
                  ].map((item) => (
                    <div className="lg-list-item" key={item}>{item}</div>
                  ))}
                </div>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 3</span>
                <h2>What we do not use cookies for</h2>
                <p>We want to be clear about what our site does not do:</p>
                <div className="lg-list">
                  {[
                    "We do not use Google Analytics or any other analytics tracking",
                    "We do not use advertising or remarketing cookies",
                    "We do not track your behaviour across other websites",
                    "We do not use any third-party cookies",
                    "We do not use cookies to build a profile of you",
                  ].map((item) => (
                    <div className="lg-list-item" key={item}>{item}</div>
                  ))}
                </div>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 4</span>
                <h2>Managing cookies</h2>
                <p>
                  You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or be notified when new cookies are set.
                </p>
                <p>
                  Please note that disabling essential session cookies may affect the functionality of our website, particularly the booking request form.
                </p>
                <p>
                  For guidance on managing cookies in your browser, visit your browser's help documentation or <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 5</span>
                <h2>Changes to this policy</h2>
                <p>
                  We may update this cookie policy from time to time. Any changes will be reflected on this page with an updated "last updated" date. We encourage you to review this page periodically.
                </p>
              </div>

              <div className="lg-section">
                <span className="lg-section-num">Section 6</span>
                <h2>Contact us</h2>
                <p>
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="lg-list">
                  <div className="lg-list-item">Email: <a href="mailto:info@lakesidetaxi.co.uk" style={{ marginLeft: 6 }}>info@lakesidetaxi.co.uk</a></div>
                  <div className="lg-list-item">Phone: <a href="tel:01375383878" style={{ marginLeft: 6 }}>01375 383878</a></div>
                </div>
              </div>

              <div className="lg-contact-note">
                <span className="lg-contact-note-icon">📋</span>
                <div className="lg-contact-note-text">
                  <strong>Also see our other legal documents</strong>
                  <p>
                    Read our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/terms-conditions">Terms &amp; Conditions</Link> for further information.
                  </p>
                </div>
              </div>

            </div>

            <aside className="lg-sidenav">
              <span className="lg-sidenav-title">On this page</span>
              <nav className="lg-sidenav-links">
                {[
                  "What are cookies?",
                  "How we use them",
                  "What we don't do",
                  "Managing cookies",
                  "Policy changes",
                  "Contact",
                ].map((item) => (
                  <span key={item} className="lg-sidenav-link">{item}</span>
                ))}
              </nav>
              <div className="lg-sidenav-divider" />
              <span className="lg-sidenav-title">Other legal pages</span>
              <div className="lg-sidenav-other">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms-conditions">Terms &amp; Conditions</Link>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </Layout>
  );
}
