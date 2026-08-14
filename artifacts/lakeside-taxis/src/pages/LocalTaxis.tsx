import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconBackpack,
  IconBriefcase,
  IconCar,
  IconCheck,
  IconClock,
  IconDoor,
  IconLuggage,
  IconMap,
  IconPhone,
  IconPin,
  IconPlane,
  IconPound,
  IconShield,
  IconUsers,
} from "@/components/icons/Icons";
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

const trust = [
  { Icon: IconShield, strong: "Since 1990", sub: "Trusted in Thurrock" },
  { Icon: IconClock, strong: "All Hours", sub: "Days, evenings & weekends" },
  { Icon: IconPound, strong: "Fixed Price", sub: "Confirmed before travel" },
  { Icon: IconPin, strong: "9 Areas", sub: "Across Thurrock & Essex" },
];

const included = [
  {
    Icon: IconPhone,
    title: "Book by call or WhatsApp",
    desc: "No app. No account. Just call or message us with your pickup and we'll sort the rest.",
  },
  {
    Icon: IconPound,
    title: "Fixed price up front",
    desc: "We confirm your fare before the journey. No meter surprises. What we quote is what you pay.",
  },
  {
    Icon: IconClock,
    title: "Day & evening pickups",
    desc: "Early mornings, late nights, weekends — we cover all hours across Thurrock.",
  },
  {
    Icon: IconLuggage,
    title: "All journey types",
    desc: "Shopping trips, hospital appointments, nights out, station pickups — any journey, any size.",
  },
  {
    Icon: IconCar,
    title: "Clean, comfortable cars",
    desc: "Well-maintained vehicles and professional local drivers who know Thurrock inside out.",
  },
  {
    Icon: IconDoor,
    title: "Door to door",
    desc: "We pick you up from your door and drop you exactly where you need to be. No shared rides.",
  },
];

const why = [
  {
    Icon: IconUsers,
    title: "You deal with us directly",
    desc: "No call centres. No platforms. You speak directly to the team who will arrange your taxi.",
  },
  {
    Icon: IconShield,
    title: "Over 30 years of service",
    desc: "Thurrock families have trusted us since 1990. Our reputation matters more than anything.",
  },
  {
    Icon: IconPound,
    title: "No hidden charges",
    desc: "Your quoted price is your final price. We don't add surcharges or change the fare after the fact.",
  },
];

const related = [
  { Icon: IconPlane, title: "Airport transfers", desc: "All major London airports.", href: "/airport-transfers" },
  { Icon: IconBackpack, title: "School runs", desc: "Safe and reliable daily runs.", href: "/school-runs" },
  { Icon: IconBriefcase, title: "Corporate travel", desc: "Business accounts available.", href: "/corporate-accounts" },
  { Icon: IconMap, title: "Long distance", desc: "UK-wide journeys.", href: "/long-distance-travel" },
];

export default function LocalTaxis() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>Local Taxis Thurrock | Grays, Purfleet &amp; Essex | Lakeside Taxis</title>
        <meta name="description" content="Reliable local taxis across Thurrock. Serving Grays, Purfleet, Chafford Hundred, Tilbury and all surrounding areas day and night. Fixed prices, no app needed." />
      </Helmet>
      <div className="ip" ref={scope}>

        {/* ── HERO ── */}
        <section className="ip-hero" style={{ "--hero-image": "url('/images/local-taxis-hero.webp')" } as React.CSSProperties}>
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow ls-reveal">Local taxis · Thurrock &amp; Essex</div>
            <h1 className="ls-reveal">Thurrock's <span>local taxi</span> service</h1>
            <p className="ip-hero-copy ls-reveal">
              Day, evening or weekend — fast, reliable taxis across Grays, Purfleet, Lakeside, Chafford Hundred and all of Thurrock. No app. No hassle. Just call or WhatsApp.
            </p>
            <div className="ip-hero-actions ls-reveal">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">
                Request a quote
                <IconArrowRight size={18} />
              </Link>
              <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro ls-reveal">
              <span><IconClock size={17} /> Reply within 2 hours</span>
              <span><IconCheck size={17} /> Fixed price confirmed up front</span>
              <span><IconCheck size={17} /> No app needed</span>
            </div>
          </div>
          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid ls-stagger">
              {trust.map(({ Icon, strong, sub }) => (
                <div className="ip-trust-item ls-reveal" key={strong}>
                  <div className="ip-trust-icon"><Icon size={21} /></div>
                  <div><strong>{strong}</strong><span>{sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT WE OFFER ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">What's included</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">Your local taxi, <span>done right</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light ls-reveal">
              Tell us where you're going, we confirm your price, and we get you there.
            </p>
            <div className="ip-cards-3 ls-stagger">
              {included.map(({ Icon, title, desc }) => (
                <div className="ip-card ls-reveal" key={title}>
                  <div className="ip-card-icon"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AREAS ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker ls-reveal">Coverage</div>
              <h2 className="ip-section-title ls-reveal">Every corner <span>of Thurrock</span></h2>
              <p className="ip-section-sub ip-section-sub-dark ls-reveal">
                Our drivers are local people who've covered these roads for over 30 years — no sat-nav errors, no wasted time.
              </p>
              <div className="ip-area-pills ls-reveal">
                {areas.map(a => (
                  <Link key={a.href} href={a.href} className="ip-area-pill-dark">
                    <IconPin size={15} />
                    {a.label}
                  </Link>
                ))}
              </div>
              <Link href="/areas-covered" className="ip-btn ip-btn-primary ls-reveal">
                See all areas
                <IconArrowRight size={18} />
              </Link>
            </div>
            <ul className="ip-check-list ip-check-list-dark ls-reveal">
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
            <div className="ip-kicker ip-kicker-center ls-reveal">Why Thurrock chooses us</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">Local, reliable, <span>honest</span></h2>
            <div className="ip-cards-3 ls-stagger">
              {why.map(({ Icon, title, desc }) => (
                <div className="ip-card ls-reveal" key={title}>
                  <div className="ip-card-icon"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA + RELATED ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner ls-reveal">
              <div>
                <h2>Need a local taxi today?</h2>
                <p>Call us, WhatsApp, or send your details — we reply within 2 hours.</p>
              </div>
              <div className="ip-cta-actions">
                <Link href="/quote-request" className="ip-btn ip-btn-primary">
                  Request a quote
                  <IconArrowRight size={18} />
                </Link>
                <a href={TEL} className="ip-cta-btn-dark">01375 383878</a>
                <a href={WA} className="ip-cta-btn-whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </div>

            <div className="ip-related-section">
              <div className="ip-kicker ip-kicker-center ls-reveal">Our other services</div>
              <div className="ip-related-grid ls-stagger">
                {related.map(({ Icon, title, desc, href }) => (
                  <Link key={href} href={href} className="ip-related-card ls-reveal">
                    <div className="ip-related-icon"><Icon size={22} /></div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
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
