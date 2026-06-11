import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./inner-page.css";

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";

const airports = [
  { icon: "✈️", name: "Heathrow", code: "LHR", href: "/airport-transfers/heathrow", desc: "The UK's largest airport, all 5 terminals." },
  { icon: "✈️", name: "Gatwick", code: "LGW", href: "/airport-transfers/gatwick", desc: "North and South terminals covered." },
  { icon: "✈️", name: "Stansted", code: "STN", href: "/airport-transfers/stansted", desc: "Single terminal, fast access from Thurrock." },
  { icon: "✈️", name: "Luton", code: "LTN", href: "/airport-transfers/luton", desc: "Popular for budget airlines and charters." },
  { icon: "✈️", name: "London City", code: "LCY", href: "/airport-transfers/london-city", desc: "The executive airport in Docklands." },
  { icon: "✈️", name: "Southend", code: "SEN", href: "/airport-transfers/southend", desc: "Your closest Essex airport option." },
];

export default function AirportTransfers() {
  return (
    <Layout>
      <Helmet>
        <title>Airport Transfers from Thurrock | Heathrow, Gatwick & More | Lakeside Taxis</title>
        <meta name="description" content="Reliable airport transfers from Grays, Purfleet and Thurrock to Heathrow, Gatwick, Stansted, Luton, London City and Southend. Fixed prices, flight tracking, 24/7 service." />
      </Helmet>
      <div className="ip">

        {/* ── HERO ── */}
        <section className="ip-hero" style={{ "--hero-image": "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80')" } as React.CSSProperties}>
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow">Airport Transfers · All Major UK Airports</div>
            <h1>Airport Transfers <span>From Thurrock</span></h1>
            <p className="ip-hero-copy">
              Stress-free transfers from Grays, Purfleet, Lakeside and wider Thurrock to every major London and Essex airport. Early departures. Late arrivals. Your driver is always waiting.
            </p>
            <div className="ip-hero-actions">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">Get Airport Quote →</Link>
              <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro">
              <span><strong>✓</strong> Fixed price confirmed before travel</span>
              <span><strong>✓</strong> Flight tracking on return pickups</span>
              <span><strong>✓</strong> 24/7 service</span>
            </div>
          </div>
          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid">
              {[
                { icon: "✈", strong: "6 Airports", sub: "All major London & Essex" },
                { icon: "📡", strong: "Flight Tracking", sub: "We monitor your arrival" },
                { icon: "🕐", strong: "24/7 Service", sub: "Any hour, any day" },
                { icon: "💷", strong: "Fixed Price", sub: "No surprises on the day" },
              ].map(t => (
                <div className="ip-trust-item" key={t.strong}>
                  <div className="ip-trust-icon">{t.icon}</div>
                  <div><strong>{t.strong}</strong><span>{t.sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AIRPORTS GRID ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">We Cover Every Major Airport</div>
            <h2 className="ip-section-title ip-section-title-center">Pick Your <span>Airport</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light">
              From Heathrow to Southend — we cover every terminal at every major airport serving London and Essex.
            </p>
            <div className="ip-cards-3">
              {airports.map(a => (
                <Link key={a.href} href={a.href} className="ip-related-card" style={{ padding: "28px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{a.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: 18, textTransform: "uppercase" as const }}>{a.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.5, fontWeight: 700 }}>{a.code}</div>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "hsl(var(--muted-foreground))" }}>{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker">How It Works</div>
              <h2 className="ip-section-title">Simple. <span>Reliable. Stress-Free.</span></h2>
              <p className="ip-section-sub ip-section-sub-dark">
                No guesswork. No waiting around. We handle everything so your journey starts and ends smoothly.
              </p>
              <ul className="ip-check-list ip-check-list-dark">
                <li>Send us your flight details and pickup address</li>
                <li>We confirm your fixed price and driver details</li>
                <li>Your driver arrives on time — or early for early flights</li>
                <li>For return pickups we track your flight live</li>
                <li>If your flight is delayed, we adjust — no extra charge</li>
                <li>Meet and greet available at the arrivals hall</li>
                <li>Help with luggage as standard</li>
              </ul>
              <div className="ip-hero-actions" style={{ marginTop: 28 }}>
                <Link href="/quote-request" className="ip-btn ip-btn-primary">Book Your Transfer →</Link>
                <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              </div>
            </div>
            <div
              className="ip-image-block"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=900&q=80')" }}
            />
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">What's Included</div>
            <h2 className="ip-section-title ip-section-title-center">Everything You <span>Need Covered</span></h2>
            <div className="ip-cards-4">
              {[
                { icon: "🛫", title: "Outbound Transfers", desc: "We get you to the terminal on time. Every time." },
                { icon: "🛬", title: "Return Pickups", desc: "We're waiting when you land — however late the flight." },
                { icon: "👔", title: "Meet & Greet", desc: "Driver meets you in arrivals with a name board." },
                { icon: "🧳", title: "Extra Luggage", desc: "Large vehicles available for multiple bags and oversized items." },
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
                <h2>Airport Transfer from Thurrock?</h2>
                <p>Send us your flight details and we'll confirm your price within 2 hours.</p>
              </div>
              <div className="ip-cta-actions">
                <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
                <a href={TEL} className="ip-cta-btn-dark">01375 383878</a>
                <Link href="/quote-request" className="ip-cta-btn-dark">Get a Quote</Link>
              </div>
            </div>
            <div style={{ marginTop: 56 }}>
              <div className="ip-kicker ip-kicker-center" style={{ marginBottom: 16 }}>Our Other Services</div>
              <div className="ip-related-grid">
                {[
                  { icon: "🚕", title: "Local Taxis", desc: "Anywhere in Thurrock, any time.", href: "/local-taxis" },
                  { icon: "💼", title: "Corporate Travel", desc: "Business accounts available.", href: "/corporate-accounts" },
                  { icon: "🎒", title: "School Runs", desc: "Safe, reliable daily service.", href: "/school-runs" },
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
