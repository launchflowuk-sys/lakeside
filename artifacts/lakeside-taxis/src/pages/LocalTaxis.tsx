import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import CoverageMap from "@/components/CoverageMap";
import "./inner-page.css";

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";

const areas = [
  { label: "Grays", href: "/areas/grays" },
  { label: "Purfleet", href: "/areas/purfleet" },
  { label: "Chafford Hundred", href: "/areas/chafford-hundred" },
  { label: "Tilbury", href: "/areas/tilbury" },
  { label: "South Ockendon", href: "/areas/south-ockendon" },
  { label: "Aveley", href: "/areas/aveley" },
  { label: "West Thurrock", href: "/areas/west-thurrock" },
  { label: "Stanford-le-Hope", href: "/areas/stanford-le-hope" },
  { label: "Corringham", href: "/areas/corringham" },
];

export default function LocalTaxis() {
  return (
    <Layout>
      <Helmet>
        <title>Local Taxis Thurrock | Grays, Purfleet & Essex | Lakeside Taxis</title>
        <meta name="description" content="Reliable local taxis across Thurrock. Serving Grays, Purfleet, Chafford Hundred, Tilbury and all surrounding areas day and night. Fixed prices, no app needed." />
      </Helmet>
      <div className="ip">

        {/* ── HERO ── */}
        <section className="ip-hero" style={{ "--hero-image": "url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1920&q=80')" } as React.CSSProperties}>
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow">Local Taxis · Thurrock & Essex</div>
            <h1>Thurrock's <span>Local Taxi</span> Service</h1>
            <p className="ip-hero-copy">
              Day, evening or weekend — fast, reliable taxis across Grays, Purfleet, Lakeside, Chafford Hundred and all of Thurrock. No app. No hassle. Just call or WhatsApp.
            </p>
            <div className="ip-hero-actions">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">Request a Quote →</Link>
              <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro">
              <span><strong>⚡</strong> Reply within 2 hours</span>
              <span><strong>✓</strong> Fixed price confirmed up front</span>
              <span><strong>✓</strong> No app needed</span>
            </div>
          </div>
          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid">
              {[
                { icon: "🛡", strong: "30+ Years", sub: "Trusted in Thurrock" },
                { icon: "🚕", strong: "All Hours", sub: "Days, evenings & weekends" },
                { icon: "✓", strong: "Fixed Price", sub: "Confirmed before travel" },
                { icon: "📍", strong: "9 Areas", sub: "Across Thurrock & Essex" },
              ].map(t => (
                <div className="ip-trust-item" key={t.strong}>
                  <div className="ip-trust-icon">{t.icon}</div>
                  <div><strong>{t.strong}</strong><span>{t.sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COVERAGE MAP ── */}
        <section className="ip-dark ip-map-section">
          <div className="ip-inner">
            <div className="ip-map-header">
              <div>
                <div className="ip-kicker">Coverage Area</div>
                <h2 className="ip-section-title">Where We <span>Cover</span></h2>
                <p className="ip-section-sub ip-section-sub-dark">
                  Hover or tap any hotspot to explore our coverage across Thurrock Borough. Click through to each area page.
                </p>
              </div>
              <div className="ip-map-stats">
                <div className="ip-map-stat"><strong>9</strong><span>Areas</span></div>
                <div className="ip-map-stat"><strong>30+</strong><span>Years local</span></div>
                <div className="ip-map-stat"><strong>24/7</strong><span>Available</span></div>
              </div>
            </div>
            <CoverageMap />
          </div>
        </section>

        {/* ── WHAT WE OFFER ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">What's Included</div>
            <h2 className="ip-section-title ip-section-title-center">Your Local Taxi, <span>Done Right</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light">
              Tell us where you're going, we confirm your price, and we get you there.
            </p>
            <div className="ip-cards-3">
              {[
                { icon: "📞", title: "Book by Call or WhatsApp", desc: "No app. No account. Just call or message us with your pickup and we'll sort the rest." },
                { icon: "💰", title: "Fixed Price Up Front", desc: "We confirm your fare before the journey. No meter surprises. What we quote is what you pay." },
                { icon: "⏰", title: "Day & Evening Pickups", desc: "Early mornings, late nights, weekends — we cover all hours across Thurrock." },
                { icon: "🧳", title: "All Journey Types", desc: "Shopping trips, hospital appointments, nights out, station pickups — any journey, any size." },
                { icon: "🚗", title: "Clean, Comfortable Cars", desc: "Well-maintained vehicles and professional local drivers who know Thurrock inside out." },
                { icon: "📍", title: "Door to Door", desc: "We pick you up from your door and drop you exactly where you need to be. No shared rides." },
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

        {/* ── AREAS ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker">Coverage</div>
              <h2 className="ip-section-title">Every Corner <span>Of Thurrock</span></h2>
              <p className="ip-section-sub ip-section-sub-dark">
                Our drivers are local people who've covered these roads for over 30 years — no sat-nav errors, no wasted time.
              </p>
              <div className="ip-area-pills">
                {areas.map(a => (
                  <Link key={a.href} href={a.href} className="ip-area-pill-dark">{a.label}</Link>
                ))}
              </div>
              <Link href="/areas-covered" className="ip-btn ip-btn-primary">See All Areas →</Link>
            </div>
            <ul className="ip-check-list ip-check-list-dark">
              <li>Grays town centre and surrounding streets</li>
              <li>Purfleet and the riverside areas</li>
              <li>Lakeside shopping and retail parks</li>
              <li>Chafford Hundred residential areas</li>
              <li>Tilbury docks and town centre</li>
              <li>South Ockendon and Aveley</li>
              <li>West Thurrock and Stonehouse Corner</li>
              <li>Stanford-le-Hope and Corringham</li>
              <li>Wider Essex on request</li>
            </ul>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">Why Thurrock Chooses Us</div>
            <h2 className="ip-section-title ip-section-title-center">Local, Reliable, <span>Honest</span></h2>
            <div className="ip-cards-3">
              {[
                { icon: "🤝", title: "You Deal With Us Directly", desc: "No call centres. No platforms. You speak directly to the team who will arrange your taxi." },
                { icon: "📅", title: "Over 30 Years of Service", desc: "Thurrock families have trusted us since 1990. Our reputation matters more than anything." },
                { icon: "🔒", title: "No Hidden Charges", desc: "Your quoted price is your final price. We don't add surcharges or change the fare after the fact." },
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

        {/* ── CTA + RELATED ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner">
              <div>
                <h2>Need a Local Taxi Today?</h2>
                <p>Call us, WhatsApp, or send your details — we reply within 2 hours.</p>
              </div>
              <div className="ip-cta-actions">
                <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
                <a href={TEL} className="ip-cta-btn-dark">01375 383878</a>
                <Link href="/quote-request" className="ip-cta-btn-dark">Request a Quote</Link>
              </div>
            </div>
            <div style={{ marginTop: 56 }}>
              <div className="ip-kicker ip-kicker-center" style={{ marginBottom: 16 }}>Our Other Services</div>
              <div className="ip-related-grid">
                {[
                  { icon: "✈️", title: "Airport Transfers", desc: "All major London airports.", href: "/airport-transfers" },
                  { icon: "🎒", title: "School Runs", desc: "Safe and reliable daily runs.", href: "/school-runs" },
                  { icon: "💼", title: "Corporate Travel", desc: "Business accounts available.", href: "/corporate-accounts" },
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
