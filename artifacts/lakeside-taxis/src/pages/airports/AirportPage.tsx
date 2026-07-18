import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { buildAirportServiceSchema, BUSINESS_URL } from "@/lib/schema";
import "../seo-pages.css";

const TEL = "tel:01375383878";
const WA = "https://wa.me/447879956275";

interface AirportPageProps {
  airportName: string;
  airportSlug: string;
  airportCode?: string;
  description: string;
  content: string;
  distance?: string;
  terminals?: string[];
  highlights?: { icon: string; title: string; body: string }[];
}

const defaultIncludes = [
  { icon: "🚪", title: "Door-to-door pickup", body: "We collect from your home address, not a rank" },
  { icon: "🛬", title: "Meet & greet on return", body: "Driver waiting in arrivals with name board" },
  { icon: "🧳", title: "Luggage assistance", body: "Help loading and unloading every time" },
  { icon: "📡", title: "Flight monitoring", body: "We track delays so you're never left waiting" },
  { icon: "🌙", title: "Early & late transfers", body: "3am departures, midnight arrivals — no problem" },
  { icon: "💷", title: "Fixed price agreed upfront", body: "No meter, no surprises — confirmed before travel" },
  { icon: "✅", title: "All terminals covered", body: "Drop and collect at any terminal on request" },
  { icon: "📞", title: "Book by phone or WhatsApp", body: "No app, no faff — just call or message us" },
];

export default function AirportPage({
  airportName,
  airportSlug,
  airportCode,
  description,
  content,
  distance,
  terminals,
  highlights,
}: AirportPageProps) {
  const title = `${airportName} Airport Transfers from Thurrock | Lakeside & Purfleet Taxis`;
  const metaDesc = `${airportName} airport transfers from Thurrock, Grays and Purfleet. Pre-booked, fixed price. All terminals. Request a quote from Lakeside & Purfleet Taxis Ltd.`;
  const canonicalUrl = `${BUSINESS_URL}/airport-transfers/${airportSlug}`;
  const schema = buildAirportServiceSchema({ airportName, airportSlug });
  const includes = highlights ?? defaultIncludes;

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${BUSINESS_URL}/opengraph.jpg`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="sp-hero">
        <div className="sp-inner sp-hero-inner">
          <nav className="sp-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/airport-transfers">Airport Transfers</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{airportName}</span>
          </nav>
          <div className="sp-hero-badges">
            {airportCode && <span className="sp-hero-code">{airportCode}</span>}
            {distance && <span className="sp-hero-distance">~{distance} from Thurrock</span>}
          </div>
          <h1>
            {airportName} Airport<br />
            <span>Transfers from Thurrock</span>
          </h1>
          <p className="sp-hero-sub">Grays · Purfleet · Lakeside · Chafford Hundred · Tilbury</p>
          <p className="sp-hero-desc">{description}</p>
          <div className="sp-hero-actions">
            <Link href="/quote-request" className="sp-btn-primary">
              Get a Quote →
            </Link>
            <a href={WA} className="sp-btn-green" target="_blank" rel="noopener noreferrer">
              WhatsApp Us
            </a>
            <a href={TEL} className="sp-btn-outline">
              01375 383878
            </a>
          </div>
          <div className="sp-hero-micros">
            <span><strong>✓</strong> Fixed price confirmed before travel</span>
            <span><strong>✓</strong> All terminals covered</span>
            <span><strong>✓</strong> 24/7 service</span>
            <span><strong>✓</strong> No app needed</span>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="sp-trust">
        <div className="sp-inner">
          <div className="sp-trust-inner">
            {[
              { icon: "💷", title: "Fixed price", sub: "Agreed before you travel" },
              { icon: "🛬", title: "Meet & greet", sub: "In arrivals on return" },
              { icon: "📡", title: "Flight tracking", sub: "We monitor your arrival" },
              { icon: "🕐", title: "24/7 service", sub: "Any hour, any day" },
            ].map((t) => (
              <div className="sp-trust-item" key={t.title}>
                <span className="sp-trust-icon">{t.icon}</span>
                <div className="sp-trust-text">
                  <strong>{t.title}</strong>
                  <span>{t.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="sp-body">
        <div className="sp-inner">
          <div className="sp-layout">

            {/* ── Left: Content ── */}
            <div className="sp-content">

              {/* About this route */}
              <span className="sp-section-kicker">About this route</span>
              <h2 className="sp-section-h2">
                {airportName} from Thurrock &amp; Essex
              </h2>
              <p className="sp-prose">{content}</p>

              {/* Terminals */}
              {terminals && terminals.length > 0 && (
                <>
                  <span className="sp-section-kicker">Terminals served</span>
                  <div className="sp-terminals">
                    {terminals.map((t) => (
                      <span className="sp-terminal-badge" key={t}>{t}</span>
                    ))}
                  </div>
                </>
              )}

              <div className="sp-divider" />

              {/* What's included */}
              <span className="sp-section-kicker">What's included</span>
              <h2 className="sp-section-h2">Everything you need, included</h2>
              <div className="sp-includes-grid">
                {includes.map((item) => (
                  <div className="sp-include-item" key={item.title}>
                    <span className="sp-include-icon">{item.icon}</span>
                    <div className="sp-include-text">
                      <strong>{item.title}</strong>
                      <span>{item.body}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing note */}
              <div className="sp-note">
                <strong>How our pricing works</strong>
                <p>
                  We don't show prices online — every quote is confirmed personally
                  by our team before your journey. Submit a request and we'll call or
                  message you back with your fixed price, usually within the hour.
                  No hidden extras, no surprises at drop-off.
                </p>
              </div>

              {/* Other airports */}
              <div className="sp-nearby">
                <span className="sp-nearby-label">Other airports we cover</span>
                <div className="sp-nearby-links">
                  {[
                    { name: "Heathrow", href: "/airport-transfers/heathrow" },
                    { name: "Gatwick", href: "/airport-transfers/gatwick" },
                    { name: "Stansted", href: "/airport-transfers/stansted" },
                    { name: "Luton", href: "/airport-transfers/luton" },
                    { name: "London City", href: "/airport-transfers/london-city" },
                    { name: "Southend", href: "/airport-transfers/southend" },
                  ]
                    .filter((a) => a.name !== airportName)
                    .map((a) => (
                      <Link key={a.href} href={a.href} className="sp-nearby-link">
                        ✈ {a.name}
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            {/* ── Right: Form ── */}
            <aside className="sp-form-col">
              <div className="sp-form-card">
                <div className="sp-form-card-title">Get a Quote</div>
                <div className="sp-form-card-sub">
                  Tell us your journey — we'll reply with a fixed price, fast.
                </div>
                <BookingForm compact />
                <div className="sp-form-contact-row">
                  <a href={TEL} className="sp-form-contact-tel">
                    📞 01375 383878
                  </a>
                  <a href={WA} className="sp-form-contact-wa" target="_blank" rel="noopener noreferrer">
                    💬 WhatsApp Us
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="sp-cta">
        <div className="sp-inner">
          <h2>Ready to book your {airportName} transfer?</h2>
          <p>Fixed price confirmed before travel. All terminals. 24/7 availability.</p>
          <div className="sp-cta-actions">
            <Link href="/quote-request" className="sp-cta-btn-dark">
              Request a Quote →
            </Link>
            <a href={TEL} className="sp-cta-btn-outline">
              📞 01375 383878
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
