import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { buildFaqSchema, BUSINESS_URL } from "@/lib/schema";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconBackpack,
  IconBriefcase,
  IconCar,
  IconCheck,
  IconClock,
  IconLuggage,
  IconMap,
  IconPlane,
  IconPlaneLanding,
  IconPound,
  IconSignal,
  IconUsers,
} from "@/components/icons/Icons";
import "./inner-page.css";

const faqs = [
  {
    q: "How far in advance should I book my airport transfer?",
    a: "We recommend booking at least 24 hours ahead, especially for early-morning or late-night flights. That said, we'll always try to accommodate last-minute requests — just give us a call or WhatsApp us directly.",
  },
  {
    q: "What happens if my flight is delayed?",
    a: "We track all inbound flights in real time. If your flight is delayed, your driver adjusts automatically — no extra charge, no panicked calls. We're there when you land, not when you were supposed to land.",
  },
  {
    q: "Do you offer a meet & greet service?",
    a: "Yes. Your driver will meet you in the arrivals hall holding a name board. No hunting for your car outside — just walk out of customs and your driver is right there.",
  },
  {
    q: "What's included in the fixed price?",
    a: "Everything. Fuel, tolls, parking at the terminal, and the driver's time waiting for you. The price we quote is the price you pay — no surcharges for traffic, no hidden fees.",
  },
  {
    q: "Can you handle large groups or extra luggage?",
    a: "Absolutely. We have larger vehicles available for groups and passengers with oversized or multiple pieces of luggage. Just mention it when you request your quote so we can send the right vehicle.",
  },
  {
    q: "Do you cover all terminals at Heathrow?",
    a: "Yes — all five Heathrow terminals (T2, T3, T4, T5 and T5B satellites). We'll confirm your specific terminal when you book and your driver will go directly to the right drop-off or pick-up point.",
  },
  {
    q: "Can I book a return transfer at the same time?",
    a: "Yes, and we recommend it. Book both legs when you enquire and we'll lock in your return price too. Popular travel dates fill up, so securing the return early avoids any last-minute stress.",
  },
  {
    q: "How do I pay for my transfer?",
    a: "Payment is arranged directly with us — cash on the day is most common, but we can discuss other arrangements when we confirm your booking. There's no online payment required upfront.",
  },
];

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";

const airports = [
  { name: "Heathrow", code: "LHR", price: "£105", href: "/airport-transfers/heathrow", desc: "All 5 terminals. Meet & greet available." },
  { name: "Gatwick", code: "LGW", price: "£80", href: "/airport-transfers/gatwick", desc: "North and South terminals covered." },
  { name: "Stansted", code: "STN", price: "£70", href: "/airport-transfers/stansted", desc: "Single terminal. Quick access from Thurrock." },
  { name: "Luton", code: "LTN", price: "£100", href: "/airport-transfers/luton", desc: "Popular for budget airlines and charters." },
  { name: "London City", code: "LCY", price: "£55", href: "/airport-transfers/london-city", desc: "The executive airport in Docklands." },
  { name: "Southend", code: "SEN", price: "£50", href: "/airport-transfers/southend", desc: "Your closest Essex airport — shortest journey." },
];

const trust = [
  { Icon: IconPlane, strong: "6 airports", sub: "All major London & Essex" },
  { Icon: IconSignal, strong: "Flight tracking", sub: "We monitor your arrival" },
  { Icon: IconClock, strong: "24/7 service", sub: "Any hour, any day" },
  { Icon: IconPound, strong: "Fixed price", sub: "No surprises on the day" },
];

/* Replaces a remote stock photograph that previously filled this column.
   These are the commitments the photo was standing in for. */
const assurances = [
  { Icon: IconSignal, t: "We watch the flight, not the clock", d: "Inbound flights are tracked live, so a delay moves your pickup rather than costing you a fare." },
  { Icon: IconUsers, t: "Met in arrivals by name", d: "Your driver waits in the hall with a name board — no car park hunt after a long flight." },
  { Icon: IconPound, t: "Tolls, parking and waiting included", d: "The quoted price covers the lot. Nothing is added on the day." },
  { Icon: IconLuggage, t: "The right vehicle for the luggage", d: "Tell us the bags and the group size and we send something that actually fits." },
];

const included = [
  { Icon: IconPlane, title: "Outbound transfers", desc: "We get you to the terminal on time. Every time." },
  { Icon: IconPlaneLanding, title: "Return pickups", desc: "We're waiting when you land — however late the flight." },
  { Icon: IconUsers, title: "Meet & greet", desc: "Driver meets you in arrivals with a name board." },
  { Icon: IconLuggage, title: "Extra luggage", desc: "Large vehicles available for multiple bags and oversized items." },
];

const related = [
  { Icon: IconCar, title: "Local taxis", desc: "Anywhere in Thurrock, any time.", href: "/local-taxis" },
  { Icon: IconBriefcase, title: "Corporate travel", desc: "Business accounts available.", href: "/corporate-accounts" },
  { Icon: IconBackpack, title: "School runs", desc: "Safe, reliable daily service.", href: "/school-runs" },
  { Icon: IconMap, title: "Long distance", desc: "UK-wide journeys.", href: "/long-distance-travel" },
];

export default function AirportTransfers() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>Airport Transfers from Thurrock | Heathrow, Gatwick &amp; More | Lakeside Taxis</title>
        <meta name="description" content="Reliable airport transfers from Grays, Purfleet and Thurrock to Heathrow, Gatwick, Stansted, Luton, London City and Southend. Fixed prices, flight tracking, 24/7 service." />
        <link rel="canonical" href={`${BUSINESS_URL}/airport-transfers`} />
        <meta property="og:title" content="Airport Transfers from Thurrock | Lakeside & Purfleet Taxis" />
        <meta property="og:description" content="Reliable airport transfers from Grays, Purfleet and Thurrock to Heathrow, Gatwick, Stansted, Luton, London City and Southend. Fixed prices, flight tracking, 24/7 service." />
        <meta property="og:url" content={`${BUSINESS_URL}/airport-transfers`} />
        <meta property="og:image" content={`${BUSINESS_URL}/opengraph.jpg`} />
        <script type="application/ld+json">{JSON.stringify(buildFaqSchema(faqs, "/airport-transfers"))}</script>
      </Helmet>
      <div className="ip" ref={scope}>

        {/* ── HERO ──
            The hero photograph was dropped: it cost a 450kB download on the
            page most often opened on mobile data, and the ink ground with its
            single warm field is the same treatment the town pages use. */}
        <section className="ip-hero">
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow ls-reveal">Airport transfers · All major UK airports</div>
            <h1 className="ls-reveal">Airport transfers <span>from Thurrock</span></h1>
            <p className="ip-hero-copy ls-reveal">
              Stress-free transfers from Grays, Purfleet, Lakeside and wider Thurrock to every major London and Essex airport. Early departures. Late arrivals. Your driver is always waiting.
            </p>
            <div className="ip-hero-actions ls-reveal">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">
                Get an airport quote
                <IconArrowRight size={18} />
              </Link>
              <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro ls-reveal">
              <span><IconCheck size={17} /> Fixed price confirmed before travel</span>
              <span><IconCheck size={17} /> Flight tracking on return pickups</span>
              <span><IconCheck size={17} /> 24/7 service</span>
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

        {/* ── AIRPORTS GRID ── */}
        <section className="ip-dark">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">Fixed prices from Thurrock</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">Airport transfer <span>prices</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-dark ls-reveal">
              All prices are fixed — confirmed before travel, no surprises on the day.
            </p>
            <div className="ip-airport-grid ls-stagger">
              {airports.map(a => (
                <Link key={a.href} href={a.href} className="ip-airport-card ls-reveal">
                  <div className="ip-airport-card-header">
                    <span className="ip-airport-name">{a.name}</span>
                    <span className="ip-airport-code">{a.code}</span>
                  </div>
                  <div className="ip-airport-price">{a.price}</div>
                  <div className="ip-airport-price-label">fixed price from Thurrock</div>
                  <p className="ip-airport-desc">{a.desc}</p>
                  <span className="ip-airport-book-btn">
                    See {a.name} transfers
                    <IconArrowRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="ip-muted">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker ls-reveal">How it works</div>
              <h2 className="ip-section-title ls-reveal">Simple. <span>Reliable. Stress-free.</span></h2>
              <p className="ip-section-sub ip-section-sub-light ls-reveal">
                No guesswork. No waiting around. We handle everything so your journey starts and ends smoothly.
              </p>
              <ul className="ip-check-list ls-reveal">
                <li>Send us your flight details and pickup address</li>
                <li>We confirm your fixed price and driver details</li>
                <li>Your driver arrives on time — or early for early flights</li>
                <li>For return pickups we track your flight live</li>
                <li>If your flight is delayed, we adjust — no extra charge</li>
                <li>Meet and greet available at the arrivals hall</li>
                <li>Help with luggage as standard</li>
              </ul>
              <div className="ip-hero-actions ls-reveal">
                <Link href="/quote-request" className="ip-btn ip-btn-primary">
                  Book your transfer
                  <IconArrowRight size={18} />
                </Link>
                <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
              </div>
            </div>

            <div className="ip-commitments ls-stagger">
              {assurances.map(({ Icon, t, d }) => (
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

        {/* ── WHAT'S INCLUDED ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">What's included</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">Everything you <span>need covered</span></h2>
            <div className="ip-cards-4 ls-stagger">
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

        {/* ── FAQ ── */}
        <section className="ip-faq-section">
          <div className="ip-inner">
            <div className="ip-faq-layout">
              <div className="ip-faq-header">
                <div className="ip-kicker ls-reveal">Common questions</div>
                <h2 className="ip-faq-title ls-reveal">Everything you need to know</h2>
                <p className="ip-faq-intro ls-reveal">
                  Quick answers to the questions we get asked most. If yours isn't here, just WhatsApp us.
                </p>
                <a href={WA} className="ip-btn ip-btn-green ip-faq-wa-btn ls-reveal" target="_blank" rel="noopener noreferrer">
                  Ask us on WhatsApp
                  <IconArrowRight size={18} />
                </a>
              </div>
              <div className="ip-faq-list">
                {faqs.map((faq, i) => (
                  <div key={i} className={`ip-faq-item${openFaq === i ? " ip-faq-item--open" : ""}`}>
                    <button
                      className="ip-faq-question"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span className="ip-faq-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="ip-faq-q-text">{faq.q}</span>
                      {/* Always a plus; the open state rotates it into a cross. */}
                      <span className="ip-faq-toggle" aria-hidden="true">+</span>
                    </button>
                    {openFaq === i && (
                      <div className="ip-faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner ls-reveal">
              <div>
                <h2>Airport transfer from Thurrock?</h2>
                <p>Send us your flight details and we'll confirm your price within 2 hours.</p>
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
