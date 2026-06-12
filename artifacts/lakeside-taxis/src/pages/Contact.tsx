import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./contact.css";

export default function Contact() {
  return (
    <Layout>
      <Helmet>
        <title>Contact Us | Lakeside & Purfleet Taxis Ltd | Thurrock, Essex</title>
        <meta name="description" content="Contact Lakeside & Purfleet Taxis. Call 01375 383878, WhatsApp 07879 956275 or email info@lakesidetaxi.co.uk. Based in Thurrock, Essex. Available 24/7." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="ct-hero">
        <div className="ct-inner">
          <span className="ct-hero-eyebrow">Lakeside &amp; Purfleet Taxis Ltd</span>
          <h1>
            Get in <span>Touch</span>
          </h1>
          <p className="ct-hero-desc">
            We're a local team — call, WhatsApp or email us directly. No chatbots, no call centres. A real person picks up.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="ct-body">
        <div className="ct-inner">

          {/* ── Primary contact methods ── */}
          <div className="ct-methods">
            <a
              href="tel:01375383878"
              className="ct-method-card ct-method-card--tel"
              data-testid="contact-link-call-us"
            >
              <span className="ct-method-icon">📞</span>
              <span className="ct-method-label">Call us</span>
              <div className="ct-method-value">01375 383878</div>
              <div className="ct-method-sub">
                Available 24 hours a day, 7 days a week. Best for same-day bookings.
              </div>
              <span className="ct-method-cta">Call now →</span>
            </a>

            <a
              href="https://wa.me/447879956275"
              className="ct-method-card ct-method-card--wa"
              data-testid="contact-link-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="ct-method-icon">💬</span>
              <span className="ct-method-label">WhatsApp</span>
              <div className="ct-method-value">07879 956275</div>
              <div className="ct-method-sub">
                Message us any time. Great for sending journey details, we reply fast.
              </div>
              <span className="ct-method-cta">Message us →</span>
            </a>

            <a
              href="mailto:info@lakesidetaxi.co.uk"
              className="ct-method-card ct-method-card--email"
              data-testid="contact-link-email"
            >
              <span className="ct-method-icon">✉️</span>
              <span className="ct-method-label">Email</span>
              <div className="ct-method-value">info@lakesidetaxi.co.uk</div>
              <div className="ct-method-sub">
                For non-urgent enquiries, corporate account requests and feedback.
              </div>
              <span className="ct-method-cta">Send email →</span>
            </a>
          </div>

          {/* ── Lower: info + booking ── */}
          <div className="ct-lower">
            <div className="ct-info-col">
              <span className="ct-col-kicker">Our details</span>
              <h2 className="ct-col-h2">Where to find us</h2>
              <div className="ct-info-rows">
                {[
                  {
                    icon: "📍",
                    title: "Based in",
                    detail: "Thurrock, Essex, UK\nServing Grays, Purfleet, Lakeside and the wider Thurrock area",
                  },
                  {
                    icon: "🕐",
                    title: "Hours",
                    detail: "Available 24 hours, 7 days a week\nIncluding bank holidays and Christmas",
                  },
                  {
                    icon: "📞",
                    title: "Phone",
                    detail: "01375 383878\nCall or text any time",
                  },
                  {
                    icon: "💬",
                    title: "WhatsApp",
                    detail: "07879 956275\nwa.me/447879956275",
                  },
                  {
                    icon: "✉️",
                    title: "Email",
                    detail: "info@lakesidetaxi.co.uk\nWe aim to reply within a few hours",
                  },
                ].map((row) => (
                  <div className="ct-info-row" key={row.title}>
                    <span className="ct-info-icon">{row.icon}</span>
                    <div className="ct-info-text">
                      <strong>{row.title}</strong>
                      {row.detail.split("\n").map((line) => (
                        <span key={line} style={{ display: "block" }}>{line}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ct-booking-col">
              <span className="ct-col-kicker">Book a journey</span>
              <h2 className="ct-col-h2">Send us your journey details</h2>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.88rem", lineHeight: "1.7", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
                Use our quote request form for the quickest response. We'll review your journey and get back to you with a fixed price and availability confirmation.
              </p>

              <div className="ct-booking-list">
                {[
                  "Pickup location and destination",
                  "Date and time of travel",
                  "Number of passengers",
                  "Any luggage or special requirements",
                ].map((item) => (
                  <div className="ct-booking-item" key={item}>{item}</div>
                ))}
              </div>

              <div className="ct-booking-note">
                <p>
                  Booking requests are not confirmed bookings. Our team will contact you to confirm availability and your fixed price. Your booking is not confirmed until we have spoken with you.
                </p>
              </div>

              <Link href="/quote-request" className="ct-booking-btn" data-testid="contact-booking-btn">
                Request a Quote →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA ── */}
      <section className="ct-cta">
        <div className="ct-inner">
          <h2>Ready when you are</h2>
          <p>Fixed price. Local drivers. Available 24/7 across Thurrock and Essex.</p>
          <div className="ct-cta-actions">
            <Link href="/quote-request" className="ct-cta-btn-dark">
              Request a Quote →
            </Link>
            <a
              href="https://wa.me/447879956275"
              className="ct-cta-btn-wa"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
