import type { ComponentType } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { buildAirportServiceSchema, BUSINESS_URL } from "@/lib/schema";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconDoor,
  IconLuggage,
  IconMoon,
  IconPhone,
  IconPlane,
  IconPlaneLanding,
  IconPound,
  IconShield,
  IconSignal,
  IconWhatsApp,
} from "@/components/icons/Icons";
import "../seo-pages.css";

const TEL = "tel:01375383878";
const TEL_DISPLAY = "01375 383878";
const WA = "https://wa.me/447879956275";

type IconCmp = ComponentType<{ size?: number; className?: string }>;

interface AirportPageProps {
  airportName: string;
  airportSlug: string;
  airportCode?: string;
  description: string;
  content: string;
  distance?: string;
  terminals?: string[];
  highlights?: { Icon: IconCmp; title: string; body: string }[];
}

/* Every item below is a service the business confirmed it actually provides. */
const defaultIncludes: { Icon: IconCmp; title: string; body: string }[] = [
  { Icon: IconDoor, title: "Door-to-door pickup", body: "We collect from your home address, not a rank" },
  { Icon: IconPlaneLanding, title: "Meet & greet on return", body: "Driver waiting in arrivals with a name board" },
  { Icon: IconLuggage, title: "Luggage assistance", body: "Help loading and unloading, every journey" },
  { Icon: IconSignal, title: "Flight monitoring", body: "We track delays so you're never left waiting" },
  { Icon: IconMoon, title: "Early and late transfers", body: "3am departures, midnight arrivals — no problem" },
  { Icon: IconPound, title: "Fixed price agreed upfront", body: "No meter, no surge — confirmed before travel" },
  { Icon: IconCheck, title: "All terminals covered", body: "Drop off and collect at any terminal on request" },
  { Icon: IconPhone, title: "Book by phone or WhatsApp", body: "No app, no account — just call or message" },
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
  const scope = useReveal<HTMLDivElement>();

  const otherAirports = [
    { name: "Heathrow", href: "/airport-transfers/heathrow" },
    { name: "Gatwick", href: "/airport-transfers/gatwick" },
    { name: "Stansted", href: "/airport-transfers/stansted" },
    { name: "Luton", href: "/airport-transfers/luton" },
    { name: "London City", href: "/airport-transfers/london-city" },
    { name: "Southend", href: "/airport-transfers/southend" },
  ].filter((a) => a.name !== airportName);

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
              <Link href="/airport-transfers">Airport transfers</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">{airportName}</span>
            </nav>

            <div className="sp-hero-badges ls-reveal">
              {airportCode && <span className="ls-pill ls-pill-yellow">{airportCode}</span>}
              {distance && (
                <span className="ls-pill ls-pill-on-ink">{distance} from Thurrock</span>
              )}
              <span className="ls-pill ls-pill-on-ink">All terminals</span>
            </div>

            <h1 className="sp-hero-title ls-reveal">
              <span>{airportName}</span> transfers from Thurrock
            </h1>

            <p className="sp-hero-lede ls-reveal">{description}</p>

            <div className="sp-hero-actions ls-reveal">
              <Link href="/quote-request" className="ls-btn ls-btn-primary ls-btn-lg">
                Get a quote
                <IconArrowRight size={18} />
              </Link>
              <a
                href={WA}
                className="ls-btn ls-btn-on-ink ls-btn-lg"
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
                <IconSignal size={17} />
                <span>
                  <strong>Flight monitored</strong> for delays
                </span>
              </span>
              <span className="sp-hero-fact">
                <IconPlaneLanding size={17} />
                <span>
                  <strong>Meet &amp; greet</strong> in arrivals
                </span>
              </span>
              <span className="sp-hero-fact">
                <IconPound size={17} />
                <span>
                  <strong>Fixed price</strong> before travel
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
                { Icon: IconPound, title: "Fixed price", sub: "Agreed before you travel" },
                { Icon: IconPlaneLanding, title: "Meet & greet", sub: "Waiting in arrivals on return" },
                { Icon: IconSignal, title: "Flight tracking", sub: "We monitor your arrival time" },
                { Icon: IconClock, title: "24/7 service", sub: "Any hour, any day" },
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
                <h2 className="ls-h2 ls-reveal">
                  {airportName} from Thurrock and Essex
                </h2>
                <p className="ls-prose ls-reveal">{content}</p>

                {terminals && terminals.length > 0 && (
                  <>
                    <h2 className="ls-h2 ls-reveal">Terminals served</h2>
                    <div className="sp-terminals ls-reveal">
                      {terminals.map((t) => (
                        <span className="ls-pill" key={t}>
                          <IconPlane size={15} />
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <h2 className="ls-h2 ls-reveal">What's included</h2>
                <div className="sp-includes ls-stagger">
                  {includes.map(({ Icon, title: t, body }) => (
                    <div className="sp-include ls-reveal" key={t}>
                      <Icon size={20} />
                      <span className="sp-include-text">
                        <strong>{t}</strong>
                        <span>{body}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <h2 className="ls-h2 ls-reveal">How our pricing works</h2>
                <div className="sp-note ls-reveal">
                  <strong>Every quote is confirmed by a person</strong>
                  <p>
                    We don't publish prices online. Send us your journey and one of our
                    team confirms a fixed price back to you, usually within the hour, by
                    phone or message. That price is what you pay — no hidden extras, no
                    meter, nothing added at drop-off.
                  </p>
                </div>

                <div className="sp-nearby ls-reveal">
                  <span className="sp-nearby-label">Other airports we cover</span>
                  <div className="sp-nearby-links">
                    {otherAirports.map((a) => (
                      <Link key={a.href} href={a.href} className="sp-nearby-link">
                        <IconPlane size={15} />
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
                    Tell us your journey and flight time. We'll come back with a fixed
                    price, usually within the hour.
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
                      className="ls-btn ls-btn-quiet"
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
            <h2 className="sp-cta-title ls-reveal">
              Ready to book your {airportName} transfer?
            </h2>
            <p className="sp-cta-sub ls-reveal">
              Fixed price confirmed before travel. All terminals, 24 hours a day.
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
