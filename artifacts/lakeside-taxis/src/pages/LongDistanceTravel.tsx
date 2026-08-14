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
  IconMoon,
  IconPhone,
  IconPlane,
  IconPound,
  IconUsers,
} from "@/components/icons/Icons";
import "./inner-page.css";

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";

const destinations = [
  "London", "Birmingham", "Manchester", "Brighton", "Cambridge",
  "Oxford", "Southampton", "Bristol", "Leeds", "Edinburgh",
];

const trust = [
  { Icon: IconMap, strong: "UK-wide", sub: "Any destination, any distance" },
  { Icon: IconPound, strong: "Fixed price", sub: "No meter, no surprises" },
  { Icon: IconCar, strong: "Spacious vehicles", sub: "Comfortable for long trips" },
  { Icon: IconUsers, strong: "Professional drivers", sub: "Experienced and reliable" },
];

const reasons = [
  {
    Icon: IconPound,
    title: "Fixed price, agreed up front",
    desc: "No meters running. No toll surprises added at the end. One clear price before you set off.",
  },
  {
    Icon: IconDoor,
    title: "True door to door",
    desc: "Picked up from your home and dropped at your exact destination — no stations, no transfers.",
  },
  {
    Icon: IconMoon,
    title: "Comfortable for long trips",
    desc: "Spacious, clean vehicles. You can relax, sleep, or work while we handle the driving.",
  },
  {
    Icon: IconLuggage,
    title: "Plenty of luggage space",
    desc: "Heading somewhere for a week? We have vehicles with ample boot space for all your bags.",
  },
  {
    Icon: IconClock,
    title: "No timetables",
    desc: "Leave when you want. No rushing to make a train. Your journey, your schedule.",
  },
  {
    Icon: IconPhone,
    title: "Easy to book",
    desc: "Call or WhatsApp us with your destination and date. We'll give you a quote and confirm your driver.",
  },
];

const steps = [
  {
    n: "1",
    title: "Tell us where you're going",
    desc: "Share your pickup address, destination, date and number of passengers — call, WhatsApp or use our quote form.",
  },
  {
    n: "2",
    title: "We confirm your fixed price",
    desc: "We'll come back to you with a clear fixed price. No obligation — just a straightforward quote.",
  },
  {
    n: "3",
    title: "We pick you up",
    desc: "On the day, your driver arrives at your door at the agreed time and takes you all the way there.",
  },
];

const related = [
  { Icon: IconPlane, title: "Airport transfers", desc: "All major London airports.", href: "/airport-transfers" },
  { Icon: IconCar, title: "Local taxis", desc: "Anywhere in Thurrock.", href: "/local-taxis" },
  { Icon: IconBriefcase, title: "Corporate travel", desc: "Business accounts available.", href: "/corporate-accounts" },
  { Icon: IconBackpack, title: "School runs", desc: "Safe and reliable.", href: "/school-runs" },
];

export default function LongDistanceTravel() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>Long Distance Taxi from Thurrock &amp; Essex | UK-Wide Travel | Lakeside Taxis</title>
        <meta name="description" content="Long distance taxi journeys from Thurrock and Essex to anywhere in the UK. Fixed prices, comfortable vehicles, professional drivers. Call for a quote today." />
      </Helmet>
      <div className="ip" ref={scope}>

        {/* ── HERO ── */}
        {/* No hero photograph exists for this page. Rather than pull a remote
            stock image on every visit — a live mobile PageSpeed concern — the
            hero uses the plain ink ground, exactly as the town pages do. */}
        <section className="ip-hero">
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow ls-reveal">Long distance · UK-wide from Thurrock</div>
            <h1 className="ls-reveal">Go further <span>with confidence</span></h1>
            <p className="ip-hero-copy ls-reveal">
              UK-wide long distance journeys from Thurrock and Essex. Fixed price agreed upfront, comfortable vehicles, and a driver who knows how to make a long journey easy.
            </p>
            <div className="ip-hero-actions ls-reveal">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">
                Get a distance quote
                <IconArrowRight size={18} />
              </Link>
              <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro ls-reveal">
              <span><IconCheck size={17} /> Fixed price agreed before travel</span>
              <span><IconCheck size={17} /> Comfortable, spacious vehicles</span>
              <span><IconCheck size={17} /> Any UK destination</span>
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

        {/* ── WHY LONG DISTANCE ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">Why book with us</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">The better way <span>to travel far</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light ls-reveal">
              Trains are expensive. Driving is tiring. A private taxi lets you travel comfortably, door to door, at a price you agree before you leave.
            </p>
            <div className="ip-cards-3 ls-stagger">
              {reasons.map(({ Icon, title, desc }) => (
                <div className="ip-card ls-reveal" key={title}>
                  <div className="ip-card-icon"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DESTINATIONS ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker ls-reveal">Popular destinations</div>
              <h2 className="ip-section-title ls-reveal">We'll take you <span>anywhere in the UK</span></h2>
              <p className="ip-section-sub ip-section-sub-dark ls-reveal">
                From a day trip to London to a week in Edinburgh — we quote for any distance, any destination.
              </p>
              <div className="ip-area-pills ls-reveal">
                {destinations.map(d => (
                  <span key={d} className="ip-area-pill-dark">{d}</span>
                ))}
              </div>
              <p className="ip-note-on-ink ls-reveal">
                Don't see your destination? Just ask — if it's in the UK, we'll quote for it.
              </p>
              <Link href="/quote-request" className="ip-btn ip-btn-primary ls-reveal">
                Get a distance quote
                <IconArrowRight size={18} />
              </Link>
            </div>
            <ul className="ip-check-list ip-check-list-dark ls-reveal">
              <li>London and all central London areas</li>
              <li>All major UK cities on request</li>
              <li>Seaside destinations — Brighton, Whitstable, Whitby</li>
              <li>University drop-offs and student travel</li>
              <li>Event and venue transfers across the UK</li>
              <li>Hospital and specialist medical appointments</li>
              <li>Overnight stays and multi-stop journeys</li>
              <li>Return journey bookings available</li>
            </ul>
          </div>
        </section>

        {/* ── HOW TO BOOK ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">How to book</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">Three easy <span>steps</span></h2>
            <div className="ip-cards-3 ls-stagger">
              {steps.map(({ n, title, desc }) => (
                <div className="ip-card ls-reveal" key={n}>
                  <span className="ip-step-num" aria-hidden="true">{n}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner ls-reveal">
              <div>
                <h2>Going somewhere far?</h2>
                <p>Tell us your destination and we'll come back with a fixed price — no obligation.</p>
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
