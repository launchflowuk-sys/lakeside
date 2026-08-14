import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { buildAreaServiceSchema, BUSINESS_URL } from "@/lib/schema";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconBackpack,
  IconBriefcase,
  IconCar,
  IconChevronRight,
  IconClock,
  IconMap,
  IconPhone,
  IconPin,
  IconPlane,
  IconPound,
  IconShield,
  IconWhatsApp,
} from "@/components/icons/Icons";
import "../seo-pages.css";

const TEL = "tel:01375383878";
const TEL_DISPLAY = "01375 383878";
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
  const scope = useReveal<HTMLDivElement>();

  const nearby =
    nearbyAreas ?? allAreas.filter((a) => a.slug !== areaSlug).slice(0, 6);

  const services = [
    {
      Icon: IconCar,
      name: "Local taxis",
      desc: `Everyday journeys across ${areaName} and the wider Thurrock area — station runs, appointments, shopping, nights out.`,
      link: "/local-taxis",
      label: "Local taxi service",
      lead: true,
    },
    {
      Icon: IconPlane,
      name: "Airport transfers",
      desc: `Pre-booked from ${areaName} to Heathrow, Gatwick, Stansted, Luton, London City and Southend.`,
      link: "/airport-transfers",
      label: "Airport transfers",
    },
    {
      Icon: IconBriefcase,
      name: "Corporate accounts",
      desc: `Monthly billing, fixed rates and priority booking for businesses based in ${areaName}.`,
      link: "/corporate-accounts",
      label: "Open an account",
    },
    {
      Icon: IconBackpack,
      name: "School runs",
      desc: `Regular morning and afternoon runs from ${areaName}. Same driver, same time, fixed weekly price.`,
      link: "/school-runs",
      label: "School run service",
    },
  ];

  const reasons = [
    {
      Icon: IconMap,
      title: `Drivers who know ${areaName}`,
      body: "Not sat-nav guesswork. Our drivers know the roads, the shortcuts and how the school-run traffic actually behaves.",
    },
    {
      Icon: IconPound,
      title: "Fixed price before you travel",
      body: "Every fare is agreed before the journey starts. No meter running, no surge pricing, no surprise at the door.",
    },
    {
      Icon: IconPhone,
      title: "Book by phone or WhatsApp",
      body: `Call ${TEL_DISPLAY} or send a message. No app to download, no account to create, no registration.`,
    },
    {
      Icon: IconClock,
      title: "On time, including at 4am",
      body: "We turn up when we say we will. That matters most on the early airport departures nobody else wants to cover.",
    },
    {
      Icon: IconShield,
      title: "Serving Thurrock since 1990",
      body: "Over thirty years as a local firm in the same area, licensed private hire, still answering the phone ourselves.",
    },
  ];

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

      <div className="sp" ref={scope}>
        {/* ── Hero ── */}
        <section className="sp-hero">
          <div className="ls-shell">
            <nav className="sp-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <IconChevronRight size={13} />
              <Link href="/areas-covered">Areas covered</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">{areaName}</span>
            </nav>

            <div className="sp-hero-badges ls-reveal">
              {postcode && (
                <span className="ls-pill ls-pill-on-ink">
                  <IconPin size={15} />
                  {postcode} · Thurrock, Essex
                </span>
              )}
              <span className="ls-pill ls-pill-on-ink">Licensed private hire</span>
            </div>

            <h1 className="sp-hero-title ls-reveal">
              Taxis in <span>{areaName}</span>
            </h1>

            <p className="sp-hero-lede ls-reveal">{description}</p>

            <div className="sp-hero-actions ls-reveal">
              <Link href="/quote-request" className="ls-btn ls-btn-primary ls-btn-lg">
                Get a quote
                <IconArrowRight size={18} />
              </Link>
              <a
                href={WA}
                className="ls-btn ls-btn-whatsapp ls-btn-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWhatsApp size={18} />
                WhatsApp
              </a>
              <a href={TEL} className="ls-btn ls-btn-on-ink ls-btn-lg">
                <IconPhone size={18} />
                {TEL_DISPLAY}
              </a>
            </div>

            <div className="sp-hero-facts ls-reveal">
              <span className="sp-hero-fact">
                <IconShield size={17} />
                <span>
                  Local firm <strong>since 1990</strong>
                </span>
              </span>
              <span className="sp-hero-fact">
                <IconPound size={17} />
                <span>
                  <strong>Fixed price</strong> agreed before travel
                </span>
              </span>
              <span className="sp-hero-fact">
                <IconClock size={17} />
                <span>
                  <strong>24/7</strong>, every day of the year
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* ── Guarantee band ── */}
        <div className="sp-band">
          <div className="ls-shell">
            <div className="sp-band-grid ls-stagger">
              {[
                { Icon: IconMap, title: "Local knowledge", sub: `We know every road in ${areaName}` },
                { Icon: IconPound, title: "Fixed pricing", sub: "Agreed before every journey" },
                { Icon: IconClock, title: "24/7 service", sub: "Any hour, any day of the year" },
                { Icon: IconPhone, title: "No app needed", sub: "Just call or message us" },
              ].map(({ Icon, title: t, sub }) => (
                <div className="sp-band-item ls-reveal" key={t}>
                  <Icon size={21} className="sp-band-icon" />
                  <span className="sp-band-text">
                    <strong>{t}</strong>
                    <span>{sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="sp-body">
          <div className="ls-shell ls-shell-wide">
            <div className="sp-layout">
              <div className="sp-content">
                <h2 className="ls-h2 ls-reveal">Taxis from {areaName}, done properly</h2>
                <p className="ls-prose ls-reveal">{content}</p>

                <h2 className="ls-h2 ls-reveal">Everything you need, covered</h2>
                <div className="sp-tiles ls-stagger">
                  {services.map(({ Icon, name, desc, link, label, lead }) => (
                    <Link
                      key={name}
                      href={link}
                      className={`sp-tile ls-reveal${lead ? " sp-tile-lead" : ""}`}
                    >
                      <Icon size={24} className="sp-tile-icon" />
                      <span className="sp-tile-name">{name}</span>
                      <span className="sp-tile-desc">{desc}</span>
                      <span className="sp-tile-go">
                        {label}
                        <IconArrowRight size={16} />
                      </span>
                    </Link>
                  ))}
                </div>

                <h2 className="ls-h2 ls-reveal">Why people in {areaName} call us</h2>
                <div className="sp-reasons ls-stagger">
                  {reasons.map(({ Icon, title: t, body }) => (
                    <div className="sp-reason ls-reveal" key={t}>
                      <span className="sp-reason-icon">
                        <Icon size={20} />
                      </span>
                      <span className="sp-reason-body">
                        <strong>{t}</strong>
                        <span>{body}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="sp-nearby ls-reveal">
                  <span className="sp-nearby-label">Other areas we cover</span>
                  <div className="sp-nearby-links">
                    {nearby.map((a) => (
                      <Link key={a.slug} href={`/areas/${a.slug}`} className="sp-nearby-link">
                        <IconPin size={15} />
                        {a.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Quote card ── */}
              <aside className="sp-form-col">
                <div className="sp-form-card">
                  <h2 className="sp-form-title">Get a quote</h2>
                  <p className="sp-form-sub">
                    Taxis from {areaName}. Tell us the journey and we'll come back with a
                    fixed price, usually within the hour.
                  </p>
                  <BookingForm compact />
                  <div className="sp-form-divider">or reach us directly</div>
                  <div className="sp-form-contacts">
                    <a href={TEL} className="ls-btn ls-btn-quiet">
                      <IconPhone size={17} />
                      Call
                    </a>
                    <a
                      href={WA}
                      className="ls-btn ls-btn-whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconWhatsApp size={17} />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ── Closing CTA ── */}
        <section className="sp-cta">
          <div className="ls-shell">
            <h2 className="sp-cta-title ls-reveal">Need a taxi from {areaName}?</h2>
            <p className="sp-cta-sub ls-reveal">
              Local drivers, fixed prices, 24 hours a day across Thurrock and Essex.
            </p>
            <div className="sp-cta-actions ls-reveal">
              <Link href="/quote-request" className="ls-btn ls-btn-primary ls-btn-lg">
                Request a quote
                <IconArrowRight size={18} />
              </Link>
              <a href={TEL} className="ls-btn ls-btn-on-ink ls-btn-lg">
                <IconPhone size={18} />
                {TEL_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
