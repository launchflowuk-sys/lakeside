import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./inner-page.css";

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";
const EMAIL = "mailto:info@lakesidetaxi.co.uk";

export default function CorporateAccounts() {
  return (
    <Layout>
      <Helmet>
        <title>Corporate Taxi Accounts Thurrock & Essex | Business Travel | Lakeside Taxis</title>
        <meta name="description" content="Corporate taxi accounts for businesses in Thurrock and Essex. Monthly invoicing, dedicated drivers, reliable business travel. Set up your account today." />
      </Helmet>
      <div className="ip">

        {/* ── HERO ── */}
        <section className="ip-hero" style={{ "--hero-image": "url('https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1920&q=80')" } as React.CSSProperties}>
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow">Corporate Accounts · Thurrock & Essex Businesses</div>
            <h1>Business Travel <span>That Works</span> For You</h1>
            <p className="ip-hero-copy">
              Reliable, professional taxi services for businesses across Thurrock. Monthly invoicing, account management, and a team you can trust with your clients and staff.
            </p>
            <div className="ip-hero-actions">
              <a href={EMAIL} className="ip-btn ip-btn-primary">Enquire About an Account →</a>
              <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro">
              <span><strong>✓</strong> Monthly invoicing available</span>
              <span><strong>✓</strong> Dedicated account management</span>
              <span><strong>✓</strong> Professional, punctual drivers</span>
            </div>
          </div>
          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid">
              {[
                { icon: "🏢", strong: "Corporate Accounts", sub: "For Thurrock businesses" },
                { icon: "📋", strong: "Monthly Invoicing", sub: "Simplified billing" },
                { icon: "👔", strong: "Professional Drivers", sub: "Smart, punctual, reliable" },
                { icon: "📞", strong: "Dedicated Support", sub: "Direct line to your team" },
              ].map(t => (
                <div className="ip-trust-item" key={t.strong}>
                  <div className="ip-trust-icon">{t.icon}</div>
                  <div><strong>{t.strong}</strong><span>{t.sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">What You Get</div>
            <h2 className="ip-section-title ip-section-title-center">A Corporate Account <span>Built Around You</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light">
              We keep it straightforward. You get professional service, simple billing, and a team that actually picks up the phone.
            </p>
            <div className="ip-cards-3">
              {[
                { icon: "📋", title: "Monthly Invoicing", desc: "One consolidated invoice per month. No chasing individual receipts. Simple end-of-month billing for your accounts team." },
                { icon: "🚘", title: "Priority Booking", desc: "Corporate accounts get priority scheduling. Your journeys are confirmed and locked in — no last-minute problems." },
                { icon: "👔", title: "Smart, Professional Drivers", desc: "Our drivers know how to represent your business. Professional, presentable, and on time." },
                { icon: "✈️", title: "Airport Transfers", desc: "From client pickups at Heathrow to staff travel to Gatwick — all covered under your account." },
                { icon: "📍", title: "Multi-Location Pickups", desc: "Multiple staff pickups across Thurrock and Essex all managed under one account." },
                { icon: "📞", title: "Direct Point of Contact", desc: "No call centres. You have a direct line to us for bookings, changes and any queries." },
              ].map(c => (
                <div className="ip-card" key={c.title}>
                  <div className="ip-card-icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker">Who It's For</div>
              <h2 className="ip-section-title">Perfect For <span>Any Business</span></h2>
              <p className="ip-section-sub ip-section-sub-dark">
                Whether you're a small team or a large organisation, if you need reliable business travel in and around Thurrock, a corporate account makes sense.
              </p>
              <ul className="ip-check-list ip-check-list-dark">
                <li>Staff airport transfers and business trips</li>
                <li>Client pickups and drop-offs</li>
                <li>Regular commuter runs for your team</li>
                <li>Last-minute travel at short notice</li>
                <li>Out-of-hours business journeys</li>
                <li>Multi-passenger bookings and group travel</li>
              </ul>
              <div style={{ marginTop: 28 }}>
                <a href={EMAIL} className="ip-btn ip-btn-primary">Enquire About an Account →</a>
              </div>
            </div>
            <div className="ip-contact-cards-vert">
              {[
                { icon: "📧", title: "Email Us", sub: "info@lakesidetaxi.co.uk", href: EMAIL, label: "Send an Email" },
                { icon: "💬", title: "WhatsApp Us", sub: "07879 956275", href: WA, label: "Chat on WhatsApp" },
                { icon: "📞", title: "Call Us", sub: "01375 383878", href: TEL, label: "Call Now" },
              ].map(c => (
                <div key={c.title} style={{
                  border: "1px solid color-mix(in srgb, hsl(var(--card)) 14%, transparent)",
                  borderRadius: 14,
                  padding: "22px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 16,
                  background: "color-mix(in srgb, hsl(var(--card)) 4%, transparent)",
                }}>
                  <span style={{ fontSize: 30 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, textTransform: "uppercase" as const, color: "hsl(var(--card))", fontSize: 15 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: "color-mix(in srgb, hsl(var(--card)) 60%, transparent)" }}>{c.sub}</div>
                  </div>
                  <a href={c.href} className="ip-btn ip-btn-primary" style={{ fontSize: 12, padding: "10px 16px" }}>{c.label}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">Why Choose Us</div>
            <h2 className="ip-section-title ip-section-title-center">Trusted By <span>Thurrock Businesses</span></h2>
            <div className="ip-cards-3">
              {[
                { icon: "🛡", title: "Fully Licensed & Insured", desc: "All vehicles and drivers fully licensed, insured and compliant. Your business is protected." },
                { icon: "⏱", title: "Punctuality Guaranteed", desc: "Late arrivals hurt your reputation too. We take punctuality as seriously as you do." },
                { icon: "📊", title: "Simple, Transparent Billing", desc: "Monthly invoices with a clear breakdown. No surprises, no disputes." },
              ].map(c => (
                <div className="ip-card" key={c.title}>
                  <div className="ip-card-icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner">
              <div>
                <h2>Set Up a Corporate Account</h2>
                <p>Get in touch and we'll discuss your requirements. No commitment, no fuss.</p>
              </div>
              <div className="ip-cta-actions">
                <a href={EMAIL} className="ip-btn ip-btn-green">Email Us</a>
                <a href={TEL} className="ip-cta-btn-dark">01375 383878</a>
                <a href={WA} className="ip-cta-btn-dark">WhatsApp</a>
              </div>
            </div>
            <div style={{ marginTop: 56 }}>
              <div className="ip-kicker ip-kicker-center" style={{ marginBottom: 16 }}>Our Other Services</div>
              <div className="ip-related-grid">
                {[
                  { icon: "✈️", title: "Airport Transfers", desc: "All major London airports.", href: "/airport-transfers" },
                  { icon: "🚕", title: "Local Taxis", desc: "Anywhere in Thurrock.", href: "/local-taxis" },
                  { icon: "🎒", title: "School Runs", desc: "Safe and reliable.", href: "/school-runs" },
                  { icon: "🛣️", title: "Long Distance", desc: "UK-wide journeys.", href: "/long-distance-travel" },
                ].map(r => (
                  <Link key={r.href} href={r.href} className="ip-related-card">
                    <div className="ip-related-icon">{r.icon}</div>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
