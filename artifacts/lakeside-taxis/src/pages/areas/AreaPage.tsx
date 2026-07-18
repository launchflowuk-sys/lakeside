import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { buildAreaServiceSchema, BUSINESS_URL } from "@/lib/schema";
import "../seo-pages.css";

const TEL = "tel:01375383878";
const WA = "https://wa.me/447879956275";

interface AreaPageProps {
  areaName: string;
  areaSlug: string;
  postcode?: string;
  description: string;
  content: string;
  nearbyAreas?: { name: string; slug: string }[];
}

const allAreas = [
  { name: "Grays", slug: "grays" },
  { name: "Purfleet", slug: "purfleet" },
  { name: "Chafford Hundred", slug: "chafford-hundred" },
  { name: "Tilbury", slug: "tilbury" },
  { name: "South Ockendon", slug: "south-ockendon" },
  { name: "Aveley", slug: "aveley" },
  { name: "West Thurrock", slug: "west-thurrock" },
  { name: "Stanford-le-Hope", slug: "stanford-le-hope" },
  { name: "Corringham", slug: "corringham" },
];

export default function AreaPage({
  areaName,
  areaSlug,
  postcode,
  description,
  content,
  nearbyAreas,
}: AreaPageProps) {
  const title = `Taxis in ${areaName} | Lakeside & Purfleet Taxis Ltd`;
  const metaDesc = `Local taxis in ${areaName}, Thurrock, Essex. Airport transfers, school runs and corporate travel from ${areaName}. Fixed prices, 24/7. Request a quote from Lakeside & Purfleet Taxis.`;
  const canonicalUrl = `${BUSINESS_URL}/areas/${areaSlug}`;
  const schema = buildAreaServiceSchema({ areaName, areaSlug, postcode });

  const nearby =
    nearbyAreas ?? allAreas.filter((a) => a.slug !== areaSlug).slice(0, 6);

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
            <Link href="/areas-covered">Areas Covered</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>{areaName}</span>
          </nav>
          <div className="sp-hero-badges">
            {postcode && <span className="sp-hero-postcode">{postcode} · Thurrock, Essex</span>}
            <span className="sp-hero-distance">Lakeside &amp; Purfleet Taxis</span>
          </div>
          <h1>
            Taxis in <span>{areaName}</span>
          </h1>
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
            <span><strong>✓</strong> Local drivers who know {areaName}</span>
            <span><strong>✓</strong> Fixed price, no surprises</span>
            <span><strong>✓</strong> 24/7, 365 days</span>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="sp-trust">
        <div className="sp-inner">
          <div className="sp-trust-inner">
            {[
              { icon: "📍", title: "Local knowledge", sub: `We know every road in ${areaName}` },
              { icon: "💷", title: "Fixed pricing", sub: "Agreed before every journey" },
              { icon: "🕐", title: "24/7 service", sub: "Any hour, any day of the year" },
              { icon: "📞", title: "No app needed", sub: "Just call or WhatsApp us" },
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

              {/* About this area */}
              <span className="sp-section-kicker">Your local taxi service</span>
              <h2 className="sp-section-h2">
                Taxis from {areaName} — done properly
              </h2>
              <p className="sp-prose">{content}</p>

              <div className="sp-divider" />

              {/* Services */}
              <span className="sp-section-kicker">Services from {areaName}</span>
              <h2 className="sp-section-h2">Everything you need, covered</h2>
              <div className="sp-services-grid">
                {[
                  {
                    icon: "📍",
                    name: "Local Taxis",
                    desc: `Everyday rides across ${areaName} and the wider Thurrock area. Station runs, shopping, appointments — any journey.`,
                    link: "/local-taxis",
                    label: "Local taxi service →",
                  },
                  {
                    icon: "✈️",
                    name: "Airport Transfers",
                    desc: `Pre-booked transfers from ${areaName} to Heathrow, Gatwick, Stansted, Luton, London City and Southend.`,
                    link: "/airport-transfers",
                    label: "Airport transfers →",
                  },
                  {
                    icon: "💼",
                    name: "Corporate Accounts",
                    desc: `Monthly billing, fixed rates and priority booking for businesses and organisations based in ${areaName}.`,
                    link: "/corporate-accounts",
                    label: "Open an account →",
                  },
                  {
                    icon: "🎒",
                    name: "School Runs",
                    desc: `Regular morning and afternoon school runs from ${areaName}. Same driver, same time, fixed price every week.`,
                    link: "/school-runs",
                    label: "School run service →",
                  },
                ].map((s) => (
                  <Link key={s.name} href={s.link} className="sp-service-card">
                    <span className="sp-service-icon">{s.icon}</span>
                    <div className="sp-service-name">{s.name}</div>
                    <div className="sp-service-desc">{s.desc}</div>
                    <div className="sp-service-link">{s.label}</div>
                  </Link>
                ))}
              </div>

              <div className="sp-divider" />

              {/* Why choose us */}
              <span className="sp-section-kicker">Why choose us in {areaName}</span>
              <h2 className="sp-section-h2">Thurrock's most trusted taxis since 1990</h2>
              <div className="sp-points">
                {[
                  {
                    icon: "🗺️",
                    title: `Local drivers who know ${areaName}`,
                    body: "Not sat-nav guesswork — our drivers know the roads, the shortcuts and the school-run timing.",
                  },
                  {
                    icon: "💷",
                    title: "Fixed price before you travel",
                    body: "Every fare is agreed before your journey. No meter ticking, no surge pricing, no nasty surprises.",
                  },
                  {
                    icon: "📞",
                    title: "Book by phone or WhatsApp",
                    body: "Call 01375 383878 or message us. We reply fast — no app, no registration, no faff.",
                  },
                  {
                    icon: "🕐",
                    title: "On time, every time",
                    body: "We show up when we say we will. Your time matters — especially for early airport departures.",
                  },
                  {
                    icon: "30+",
                    title: "Over 30 years serving Thurrock",
                    body: "We've been Thurrock's local taxi firm since 1990. Thousands of families trust us with their journeys.",
                  },
                ].map((pt) => (
                  <div className="sp-point" key={pt.title}>
                    <span className="sp-point-icon">{pt.icon}</span>
                    <div className="sp-point-text">
                      <strong>{pt.title}</strong>
                      <span>{pt.body}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nearby areas */}
              <div className="sp-nearby">
                <span className="sp-nearby-label">Other areas we cover</span>
                <div className="sp-nearby-links">
                  {nearby.map((a) => (
                    <Link key={a.slug} href={`/areas/${a.slug}`} className="sp-nearby-link">
                      📍 {a.name}
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
                  Taxis from {areaName} — fixed price confirmed fast.
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
          <h2>Need a taxi from {areaName}?</h2>
          <p>Local, reliable, fixed price. Available 24/7 across Thurrock and Essex.</p>
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
