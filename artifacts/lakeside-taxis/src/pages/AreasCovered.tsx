import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { BUSINESS_URL } from "@/lib/schema";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconChevronRight,
  IconClock,
  IconMap,
  IconMessage,
  IconPhone,
  IconPin,
  IconPlane,
  IconPound,
} from "@/components/icons/Icons";
import "./areas-covered.css";

const TEL = "tel:01375383878";
const WA = "https://wa.me/447879956275";

const areas = [
  {
    name: "Grays",
    href: "/areas/grays",
    postcode: "RM17 · RM20",
    desc: "Our home base. We cover the full town centre, Grays station, the High Street and all surrounding residential roads.",
    places: ["Town Centre", "Grays Station", "Lakeside", "Orsett Road", "Hospital"],
  },
  {
    name: "Purfleet",
    href: "/areas/purfleet",
    postcode: "RM19",
    desc: "Purfleet village to the Lakeside and Thurrock retail parks — we know every road and shortcut.",
    places: ["Purfleet Village", "Lakeside Retail Park", "Thurrock Park", "Royal Hotel"],
  },
  {
    name: "Chafford Hundred",
    href: "/areas/chafford-hundred",
    postcode: "RM16",
    desc: "The fast-growing residential area around Chafford Hundred station. Great for early morning commuter runs.",
    places: ["Chafford Hundred Station", "Bluewater Ferry Link", "Drake Circus", "Schools"],
  },
  {
    name: "Tilbury",
    href: "/areas/tilbury",
    postcode: "RM18",
    desc: "Tilbury Town, the Docks and surrounding RM18 postcodes. We cover ferry connections and port pickups.",
    places: ["Tilbury Town", "Tilbury Docks", "Tilbury Ferry", "Port of Tilbury"],
  },
  {
    name: "South Ockendon",
    href: "/areas/south-ockendon",
    postcode: "RM15",
    desc: "South Ockendon and North Stifford, including all residential streets and local amenities.",
    places: ["South Ockendon", "North Stifford", "Belhus", "Arisdale Avenue"],
  },
  {
    name: "Aveley",
    href: "/areas/aveley",
    postcode: "RM15",
    desc: "Aveley village and the South Ockendon border areas. Quiet, reliable local service for residents.",
    places: ["Aveley Village", "Purfleet Road", "South Ockendon Borders", "Local Schools"],
  },
  {
    name: "West Thurrock",
    href: "/areas/west-thurrock",
    postcode: "RM20",
    desc: "West Thurrock and the Lakeside shopping area — one of our busiest zones, covered around the clock.",
    places: ["Lakeside Shopping Centre", "Grays Border", "West Thurrock Way", "Arterial Road"],
  },
  {
    name: "Stanford-le-Hope",
    href: "/areas/stanford-le-hope",
    postcode: "SS17",
    desc: "Stanford-le-Hope town and the Corringham road corridor. Regular runs to Grays station and beyond.",
    places: ["Stanford-le-Hope Station", "Town Centre", "Corringham Road", "Homesteads"],
  },
  {
    name: "Corringham",
    href: "/areas/corringham",
    postcode: "SS17",
    desc: "Corringham village and surrounding residential areas — dependable local taxis, day and night.",
    places: ["Corringham Village", "Fobbing", "Shell Haven", "Corringham Road"],
  },
];

const coveragePoints = [
  {
    Icon: IconClock,
    title: "24/7 availability",
    body: "Early morning airport runs, late night returns, school runs — we run round the clock across all nine areas.",
  },
  {
    Icon: IconPin,
    title: "Door-to-door pickup",
    body: "We come to your address, not a pickup point. Every journey starts and ends where you need it.",
  },
  {
    Icon: IconPound,
    title: "Fixed prices, no surprises",
    body: "Every quote is agreed before travel. No surge pricing, no hidden extras — just a fixed fare you can trust.",
  },
  {
    Icon: IconPlane,
    title: "Airport & long-distance",
    body: "All nine areas covered for Heathrow, Gatwick, Stansted, Luton, London City and Southend runs.",
  },
  {
    Icon: IconPhone,
    title: "Book by phone or WhatsApp",
    body: "No app required. Call 01375 383878 or message us on WhatsApp — we reply fast, every day.",
  },
  {
    Icon: IconMap,
    title: "Local knowledge",
    body: "Our drivers know every shortcut, school gate and back road across Thurrock. You'll never wait for a missed turn.",
  },
];

const acTitle = "Areas Covered | Lakeside & Purfleet Taxis | Thurrock, Essex";
const acMetaDesc = "Taxi services covering all areas of Thurrock including Grays, Purfleet, Chafford Hundred, Tilbury, South Ockendon, Aveley, West Thurrock, Stanford-le-Hope and Corringham. Fixed prices, 24/7.";
const acCanonicalUrl = `${BUSINESS_URL}/areas-covered`;
const acSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${acCanonicalUrl}#page`,
      name: acTitle,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: areas.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.name,
          url: `${BUSINESS_URL}${a.href}`,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BUSINESS_URL}/` },
        { "@type": "ListItem", position: 2, name: "Areas Covered", item: acCanonicalUrl },
      ],
    },
  ],
};

export default function AreasCovered() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>{acTitle}</title>
        <meta name="description" content={acMetaDesc} />
        <link rel="canonical" href={acCanonicalUrl} />
        <meta property="og:title" content={acTitle} />
        <meta property="og:description" content={acMetaDesc} />
        <meta property="og:url" content={acCanonicalUrl} />
        <meta property="og:image" content={`${BUSINESS_URL}/opengraph.jpg`} />
        <script type="application/ld+json">{JSON.stringify(acSchema)}</script>
      </Helmet>

      <div className="ac" ref={scope}>

        {/* ── Hero ── */}
        <section className="ac-hero">
          <div className="ac-inner">
            <nav className="ac-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">Areas covered</span>
            </nav>
            <div className="ac-hero-eyebrow ls-reveal">
              <IconPin size={15} />
              Coverage · Thurrock &amp; Essex
            </div>
            <h1 className="ls-reveal">
              Every corner of <span>Thurrock</span> covered.
            </h1>
            <p className="ac-hero-desc ls-reveal">
              Lakeside &amp; Purfleet Taxis serves 9 areas across Thurrock and wider Essex —
              from Grays town centre to Stanford-le-Hope, Tilbury Docks to Chafford Hundred.
              Fixed prices. 24/7. No app needed.
            </p>
            <div className="ac-hero-stats ls-reveal">
              {[
                { num: "9", lbl: "Areas covered" },
                { num: "30+", lbl: "Years serving Thurrock" },
                { num: "24/7", lbl: "Service" },
                { num: "100%", lbl: "Fixed pricing" },
              ].map((s) => (
                <div className="ac-hero-stat" key={s.lbl}>
                  <span className="ac-hero-stat-num">{s.num}</span>
                  <span className="ac-hero-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Area grid ── */}
        <section className="ac-grid-section">
          <div className="ac-inner">
            <span className="ac-section-kicker ls-reveal">All service areas</span>
            <h2 className="ac-section-h2 ls-reveal">Pick your area</h2>
            <p className="ac-section-desc ls-reveal">
              Choose any area for local routes, postcodes and a direct quote request for that location.
            </p>
            <div className="ac-areas-grid ls-stagger">
              {areas.map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="ac-area-card ls-reveal"
                  data-testid={`area-card-${area.href.split("/").pop()}`}
                >
                  <div className="ac-area-card-top">
                    <div className="ac-area-icon"><IconPin size={20} /></div>
                    <span className="ac-area-postcode">{area.postcode}</span>
                  </div>
                  <div className="ac-area-name">{area.name}</div>
                  <div className="ac-area-desc">{area.desc}</div>
                  <div className="ac-area-places">
                    {area.places.map((p) => (
                      <span className="ac-area-place-tag" key={p}>{p}</span>
                    ))}
                  </div>
                  <div className="ac-area-link">
                    Taxis in {area.name}
                    <IconArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Coverage info ── */}
        <section className="ac-coverage">
          <div className="ac-inner">
            <div className="ac-coverage-grid">
              <div className="ac-coverage-text">
                <span className="ac-section-kicker ls-reveal">Why book with us</span>
                <h3 className="ls-reveal">A local taxi service that actually knows Thurrock</h3>
                <p className="ls-reveal">
                  We've been driving Thurrock families, workers and businesses since 1990.
                  Every driver knows the area — the roads, the shortcuts, the school run
                  timing and the early airport rush.
                </p>
                <p className="ls-reveal">
                  Whether you need a regular run to Grays station, a late-night pickup from
                  Lakeside, or an early morning transfer to Heathrow — we've got you covered,
                  every time.
                </p>
                <div className="ac-coverage-actions ls-reveal">
                  <a href={TEL} className="ac-btn ac-btn-primary">
                    <IconPhone size={18} />
                    01375 383878
                  </a>
                  <a href={WA} className="ac-btn ac-btn-whatsapp" target="_blank" rel="noopener noreferrer">
                    <IconMessage size={18} />
                    WhatsApp us
                  </a>
                </div>
              </div>

              <div className="ac-coverage-list ls-stagger">
                {coveragePoints.map(({ Icon, title, body }) => (
                  <div className="ac-coverage-item ls-reveal" key={title}>
                    <span className="ac-coverage-item-icon"><Icon size={20} /></span>
                    <div className="ac-coverage-item-text">
                      <strong>{title}</strong>
                      <span>{body}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ac-cta">
          <div className="ac-inner">
            <h2 className="ls-reveal">Not sure if we cover your area?</h2>
            <p className="ls-reveal">Call us or send a quote request — we'll confirm within minutes.</p>
            <div className="ac-cta-actions ls-reveal">
              <Link href="/quote-request" className="ac-cta-btn-primary">
                Request a quote
                <IconArrowRight size={18} />
              </Link>
              <a href={TEL} className="ac-cta-btn-outline">
                <IconPhone size={18} />
                01375 383878
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
