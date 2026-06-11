import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./inner-page.css";

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";

export default function SchoolRuns() {
  return (
    <Layout>
      <Helmet>
        <title>School Runs Thurrock & Essex | Safe, Reliable | Lakeside Taxis</title>
        <meta name="description" content="Safe and reliable school runs across Thurrock and Essex. Regular or one-off journeys, experienced local drivers, fixed prices. Trusted by Thurrock families since 1990." />
      </Helmet>
      <div className="ip">

        {/* ── HERO ── */}
        <section className="ip-hero" style={{ "--hero-image": "url('https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=1920&q=80')" } as React.CSSProperties}>
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow">School Runs · Thurrock & Essex</div>
            <h1>Safe, Reliable <span>School Runs</span> You Can Trust</h1>
            <p className="ip-hero-copy">
              Experienced local drivers, fixed routes, and total reliability every morning and afternoon. Trusted by Thurrock families since 1990.
            </p>
            <div className="ip-hero-actions">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">Get a School Run Quote →</Link>
              <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro">
              <span><strong>✓</strong> Regular or one-off journeys</span>
              <span><strong>✓</strong> Experienced, vetted local drivers</span>
              <span><strong>✓</strong> Fixed price every time</span>
            </div>
          </div>
          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid">
              {[
                { icon: "🛡", strong: "Safe & Trusted", sub: "Thurrock families since 1990" },
                { icon: "⏰", strong: "Never Late", sub: "Reliable morning & afternoon" },
                { icon: "👤", strong: "Known Drivers", sub: "Same driver, every day" },
                { icon: "💷", strong: "Fixed Price", sub: "No surprises, ever" },
              ].map(t => (
                <div className="ip-trust-item" key={t.strong}>
                  <div className="ip-trust-icon">{t.icon}</div>
                  <div><strong>{t.strong}</strong><span>{t.sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT WE OFFER ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">What We Provide</div>
            <h2 className="ip-section-title ip-section-title-center">School Runs <span>Done Properly</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light">
              We understand how much a reliable school run matters. We've been trusted by Thurrock families for over 30 years.
            </p>
            <div className="ip-cards-3">
              {[
                { icon: "📅", title: "Regular Daily Runs", desc: "Morning drop-off and afternoon pickup — the same driver, the same time, every school day." },
                { icon: "1️⃣", title: "One-Off Journeys", desc: "Need a single pickup? No problem. We cover one-off school runs with the same care and reliability." },
                { icon: "👤", title: "Consistent Drivers", desc: "Your child will get to know their driver. We try to keep the same driver on your route every day." },
                { icon: "📍", title: "All Thurrock Schools", desc: "Primary, secondary and special schools across Grays, Purfleet, Chafford Hundred and beyond." },
                { icon: "💬", title: "Direct Communication", desc: "Any change to the route or time? Call or WhatsApp us directly. No apps, no automated systems." },
                { icon: "🔒", title: "Peace of Mind", desc: "We know how important this is. Our drivers are professional, local, and trusted by your neighbours." },
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

        {/* ── HOW IT WORKS ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker">How It Works</div>
              <h2 className="ip-section-title">Simple to <span>Set Up</span></h2>
              <p className="ip-section-sub ip-section-sub-dark">
                Setting up a school run with us takes five minutes. We handle the rest.
              </p>
              <ul className="ip-check-list ip-check-list-dark">
                <li>Call or WhatsApp us with your child's school and address</li>
                <li>We confirm availability, timing and your fixed price</li>
                <li>We introduce you to your driver before the first run</li>
                <li>Your driver picks up at the agreed time every day</li>
                <li>Any issues — call us directly, we sort it immediately</li>
                <li>Flexible for holidays, inset days and schedule changes</li>
              </ul>
              <div style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap" as const }}>
                <Link href="/quote-request" className="ip-btn ip-btn-primary">Get a Quote →</Link>
                <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              </div>
            </div>
            <div>
              <div style={{
                background: "color-mix(in srgb, hsl(var(--card)) 4%, transparent)",
                border: "1px solid color-mix(in srgb, hsl(var(--card)) 14%, transparent)",
                borderRadius: 18,
                padding: 32,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", color: "hsl(var(--primary))", fontSize: 28, fontWeight: 900, textTransform: "uppercase" as const, marginBottom: 12 }}>What Parents Say</div>
                <p style={{ color: "color-mix(in srgb, hsl(var(--card)) 80%, transparent)", lineHeight: 1.7, fontStyle: "italic" as const, marginBottom: 20 }}>
                  "They do our daughter's school run every morning. She's always picked up on time and the driver is brilliant with her. Complete peace of mind."
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "hsl(var(--primary))", display: "grid", placeItems: "center", fontWeight: 900, color: "hsl(var(--primary-foreground))", flexShrink: 0 }}>A</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "hsl(var(--card))", fontSize: 14 }}>Amanda K.</div>
                    <div style={{ fontSize: 12, color: "color-mix(in srgb, hsl(var(--card)) 55%, transparent)" }}>Chafford Hundred parent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AREAS ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">Areas We Cover</div>
            <h2 className="ip-section-title ip-section-title-center">School Runs Across <span>All of Thurrock</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light">
              We cover primary and secondary schools across all major areas of Thurrock and surrounding Essex.
            </p>
            <div className="ip-area-pills" style={{ justifyContent: "center" }}>
              {[
                { label: "Grays", href: "/areas/grays" },
                { label: "Purfleet", href: "/areas/purfleet" },
                { label: "Chafford Hundred", href: "/areas/chafford-hundred" },
                { label: "Tilbury", href: "/areas/tilbury" },
                { label: "South Ockendon", href: "/areas/south-ockendon" },
                { label: "Aveley", href: "/areas/aveley" },
                { label: "West Thurrock", href: "/areas/west-thurrock" },
                { label: "Stanford-le-Hope", href: "/areas/stanford-le-hope" },
                { label: "Corringham", href: "/areas/corringham" },
              ].map(a => (
                <Link key={a.href} href={a.href} className="ip-area-pill">{a.label}</Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner">
              <div>
                <h2>Book a School Run Today</h2>
                <p>Get in touch and we'll confirm availability for your child's route.</p>
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
                  { icon: "🚕", title: "Local Taxis", desc: "Anywhere in Thurrock.", href: "/local-taxis" },
                  { icon: "✈️", title: "Airport Transfers", desc: "All major London airports.", href: "/airport-transfers" },
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
