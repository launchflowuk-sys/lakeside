import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconBriefcase,
  IconCar,
  IconCheck,
  IconClock,
  IconMap,
  IconMessage,
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

const trust = [
  { Icon: IconShield, strong: "Safe & trusted", sub: "Thurrock families since 1990" },
  { Icon: IconClock, strong: "Never late", sub: "Reliable morning & afternoon" },
  { Icon: IconUsers, strong: "Known drivers", sub: "Same driver, every day" },
  { Icon: IconPound, strong: "Fixed price", sub: "No surprises, ever" },
];

const provided = [
  {
    Icon: IconClock,
    title: "Regular daily runs",
    desc: "Morning drop-off and afternoon pickup — the same driver, the same time, every school day.",
  },
  {
    Icon: IconCar,
    title: "One-off journeys",
    desc: "Need a single pickup? No problem. We cover one-off school runs with the same care and reliability.",
  },
  {
    Icon: IconUsers,
    title: "Consistent drivers",
    desc: "Your child will get to know their driver. We try to keep the same driver on your route every day.",
  },
  {
    Icon: IconPin,
    title: "All Thurrock schools",
    desc: "Primary, secondary and special schools across Grays, Purfleet, Chafford Hundred and beyond.",
  },
  {
    Icon: IconMessage,
    title: "Direct communication",
    desc: "Any change to the route or time? Call or WhatsApp us directly. No apps, no automated systems.",
  },
  {
    Icon: IconShield,
    title: "Peace of mind",
    desc: "We know how important this is. Our drivers are professional, local, and licensed private hire.",
  },
];

/* What a parent actually gets — verifiable commitments, not invented quotes.
   A hardcoded "What Parents Say" testimonial attributed to a named parent
   previously sat here; it was fabricated and has been removed. */
const commitments = [
  { Icon: IconPhone, t: "One number, a real person", d: "You call us direct — no call centre, no ticket, no app notification." },
  { Icon: IconUsers, t: "You meet the driver first", d: "We introduce you before the first run so your child knows who is collecting them." },
  { Icon: IconPound, t: "A fixed weekly price", d: "Agreed before the first journey and unchanged for the term." },
  { Icon: IconClock, t: "Flexible around the school year", d: "Holidays, inset days and timetable changes handled with a phone call." },
];

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

const related = [
  { Icon: IconCar, title: "Local taxis", desc: "Anywhere in Thurrock.", href: "/local-taxis" },
  { Icon: IconPlane, title: "Airport transfers", desc: "All major London airports.", href: "/airport-transfers" },
  { Icon: IconBriefcase, title: "Corporate travel", desc: "Business accounts available.", href: "/corporate-accounts" },
  { Icon: IconMap, title: "Long distance", desc: "UK-wide journeys.", href: "/long-distance-travel" },
];

export default function SchoolRuns() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>School Runs Thurrock &amp; Essex | Safe, Reliable | Lakeside Taxis</title>
        <meta name="description" content="Safe and reliable school runs across Thurrock and Essex. Regular or one-off journeys, experienced local drivers, fixed prices. Trusted by Thurrock families since 1990." />
      </Helmet>
      <div className="ip" ref={scope}>

        {/* ── HERO ── */}
        <section className="ip-hero" style={{ "--hero-image": "url('/images/school-runs-hero.webp')" } as React.CSSProperties}>
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow ls-reveal">School runs · Thurrock &amp; Essex</div>
            <h1 className="ls-reveal">Safe, reliable <span>school runs</span> you can trust</h1>
            <p className="ip-hero-copy ls-reveal">
              Experienced local drivers, fixed routes, and total reliability every morning and afternoon. Trusted by Thurrock families since 1990.
            </p>
            <div className="ip-hero-actions ls-reveal">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">
                Get a school run quote
                <IconArrowRight size={18} />
              </Link>
              <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro ls-reveal">
              <span><IconCheck size={17} /> Regular or one-off journeys</span>
              <span><IconCheck size={17} /> Experienced local drivers</span>
              <span><IconCheck size={17} /> Fixed price every time</span>
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

        {/* ── WHAT WE PROVIDE ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">What we provide</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">School runs <span>done properly</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light ls-reveal">
              We understand how much a reliable school run matters. We've been trusted by Thurrock families for over 30 years.
            </p>
            <div className="ip-cards-3 ls-stagger">
              {provided.map(({ Icon, title, desc }) => (
                <div className="ip-card ls-reveal" key={title}>
                  <div className="ip-card-icon"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker ls-reveal">How it works</div>
              <h2 className="ip-section-title ls-reveal">Simple to <span>set up</span></h2>
              <p className="ip-section-sub ip-section-sub-dark ls-reveal">
                Setting up a school run with us takes five minutes. We handle the rest.
              </p>
              <ul className="ip-check-list ip-check-list-dark ls-reveal">
                <li>Call or WhatsApp us with your child's school and address</li>
                <li>We confirm availability, timing and your fixed price</li>
                <li>We introduce you to your driver before the first run</li>
                <li>Your driver picks up at the agreed time every day</li>
                <li>Any issues — call us directly, we sort it immediately</li>
                <li>Flexible for holidays, inset days and schedule changes</li>
              </ul>
              <div className="ip-hero-actions ls-reveal">
                <Link href="/quote-request" className="ip-btn ip-btn-primary">
                  Get a quote
                  <IconArrowRight size={18} />
                </Link>
                <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
              </div>
            </div>

            <div className="ip-commitments ls-stagger">
              {commitments.map(({ Icon, t, d }) => (
                <div className="ip-commitment ls-reveal" key={t}>
                  <span className="ip-commitment-icon"><Icon size={20} /></span>
                  <span className="ip-commitment-body">
                    <strong>{t}</strong>
                    <span>{d}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AREAS ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">Areas we cover</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">School runs across <span>all of Thurrock</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light ls-reveal">
              We cover primary and secondary schools across all major areas of Thurrock and surrounding Essex.
            </p>
            <div className="ip-area-pills ip-area-pills-center ls-reveal">
              {areas.map(a => (
                <Link key={a.href} href={a.href} className="ip-area-pill">
                  <IconPin size={15} />
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner ls-reveal">
              <div>
                <h2>Book a school run today</h2>
                <p>Get in touch and we'll confirm availability for your child's route.</p>
              </div>
              <div className="ip-cta-actions">
                <Link href="/quote-request" className="ip-btn ip-btn-primary">
                  Get a quote
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
