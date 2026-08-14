import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconBriefcase,
  IconCar,
  IconCheck,
  IconChevronRight,
  IconLuggage,
  IconMap,
  IconMessage,
  IconPhone,
  IconPin,
  IconPlane,
  IconPound,
  IconShip,
  IconSignal,
  IconUsers,
} from "@/components/icons/Icons";
import "./inner-page.css";
import "./cruise-terminal.css";

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";
const EMAIL = "mailto:info@lakesidetaxi.co.uk";

const cruiseLines = [
  { name: "P&O Cruises", note: "UK's largest cruise brand — regular Tilbury sailings" },
  { name: "Cunard", note: "Queen Mary 2 & world voyages from Tilbury" },
  { name: "MSC Cruises", note: "Mediterranean & world cruises" },
  { name: "Marella Cruises", note: "TUI's cruise line — popular holiday sailings" },
  { name: "Fred. Olsen", note: "Boutique cruises from Tilbury year-round" },
  { name: "Ambassador", note: "British boutique cruise line based at Tilbury" },
  { name: "Saga Cruises", note: "Premium over-50s voyages" },
  { name: "Hebridean", note: "Small-ship Scottish island cruises" },
];

const coverage = [
  "London & Greater London", "Essex & East Anglia", "Kent & South East",
  "Surrey & Sussex", "Hampshire & Dorset", "Hertfordshire & Bedfordshire",
  "Oxfordshire & Buckinghamshire", "Berkshire & Wiltshire", "Midlands",
  "North West England", "North East England", "Yorkshire",
  "South West & Cornwall", "Wales", "Scotland",
];

const faqs = [
  {
    q: "Which cruise terminal do you serve in Tilbury?",
    a: "We serve the London International Cruise Terminal (LICT) at Tilbury Docks, Tilbury, Essex RM18 7HS. This is the primary UK cruise terminal for P&O, Cunard, MSC, Marella, Fred. Olsen, Ambassador and other major cruise lines.",
  },
  {
    q: "Do you cover transfers from anywhere in the UK to Tilbury Cruise Terminal?",
    a: "Yes. We offer door-to-door transfers to Tilbury Cruise Terminal from anywhere in the UK — from Cornwall to Scotland. We quote a fixed price for your journey regardless of distance. Contact us with your location and travel date for a quote.",
  },
  {
    q: "How far in advance should I book a cruise terminal transfer?",
    a: "We recommend booking as early as possible — ideally at least 2–4 weeks before your sailing date. For peak summer and holiday sailings, earlier is better. We can sometimes accommodate last-minute bookings, but early booking guarantees your vehicle and price.",
  },
  {
    q: "What happens if our cruise ship is delayed arriving back to Tilbury?",
    a: "For return pickups from the terminal, we monitor ship arrival times and adjust your collection accordingly. There is no extra charge for reasonable delays. We stay in contact with you as the ship approaches so you're never waiting around.",
  },
  {
    q: "Do you offer meet and greet at the cruise terminal?",
    a: "Yes. For return pickups from Tilbury Cruise Terminal, your driver will meet you in the arrivals area with a name board. We coordinate with terminal schedules so you walk off the ship straight to your driver — no waiting, no confusion.",
  },
  {
    q: "Can you handle large groups and lots of luggage for a cruise?",
    a: "Absolutely. Cruise passengers tend to travel with substantial luggage. We have large vehicles with generous boot space, and for bigger groups we can arrange multiple vehicles travelling together. Let us know your passenger numbers and luggage requirements when you book.",
  },
  {
    q: "How is the price calculated for a cruise terminal transfer?",
    a: "We quote a fixed price based on your pickup location and the number of passengers. The price is confirmed before you travel — no meters, no surprises. We aim to offer very competitive rates, particularly for the long-distance UK-wide transfers we specialise in.",
  },
  {
    q: "Can you arrange a return transfer — both to and from the cruise terminal?",
    a: "Yes. We can book both legs of your journey at the same time — the outbound transfer to Tilbury before your cruise, and the return pickup when your ship arrives back. Many of our cruise customers prefer to book both together for peace of mind.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TaxiService",
      "@id": "https://lakesidetaxi.co.uk/tilbury-cruise-terminal#service",
      "name": "Tilbury Cruise Terminal Transfers — Lakeside & Purfleet Taxis",
      "description": "Door-to-door taxi and private hire transfers to and from London International Cruise Terminal, Tilbury, Essex. UK-wide coverage. Fixed prices. Meet and greet available.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Lakeside & Purfleet Taxis Ltd",
        "telephone": "01375383878",
        "email": "info@lakesidetaxi.co.uk",
        "url": "https://lakesidetaxi.co.uk",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Thurrock",
          "addressRegion": "Essex",
          "postalCode": "RM17",
          "addressCountry": "GB",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 51.4875,
          "longitude": 0.3564,
        },
        "openingHours": "Mo-Su 00:00-23:59",
        "priceRange": "££",
      },
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom",
      },
      "serviceType": "Cruise Terminal Transfer",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cruise Terminal Transfer Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Transfer TO Tilbury Cruise Terminal",
              "description": "Door-to-door private hire from anywhere in the UK to London International Cruise Terminal, Tilbury.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Transfer FROM Tilbury Cruise Terminal",
              "description": "Meet and greet collection from Tilbury Cruise Terminal to any UK destination.",
            },
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://lakesidetaxi.co.uk/tilbury-cruise-terminal#faq",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lakesidetaxi.co.uk/" },
        { "@type": "ListItem", "position": 2, "name": "Cruise Terminal Transfers", "item": "https://lakesidetaxi.co.uk/tilbury-cruise-terminal" },
      ],
    },
  ],
};

const includes = [
  { Icon: IconPound, title: "Fixed price, always", desc: "Your price is agreed and confirmed before travel. No meters. No last-minute additions. What we quote is what you pay." },
  { Icon: IconSignal, title: "Ship tracking", desc: "For return pickups, we monitor your vessel's arrival time. If the schedule changes, we know — and we adjust. You won't be left waiting." },
  { Icon: IconUsers, title: "Meet & greet", desc: "Your driver arrives at the terminal with a name board. You walk off the ship and straight into your car. No stress, no searching." },
  { Icon: IconLuggage, title: "Luggage for cruisers", desc: "We know cruise passengers travel with a lot. We have large-boot vehicles and can accommodate everything from suitcases to mobility equipment." },
  { Icon: IconPin, title: "True door to door", desc: "Collected from your home address and dropped at the terminal entrance. On the return, taken all the way to your front door." },
  { Icon: IconPhone, title: "Direct contact", desc: "No automated systems. No intermediaries. You have a direct phone number and WhatsApp for your driver on the day of travel." },
];

const related = [
  { Icon: IconPlane, title: "Airport transfers", desc: "Heathrow, Gatwick, Stansted & more.", href: "/airport-transfers" },
  { Icon: IconMap, title: "Long distance travel", desc: "UK-wide private hire journeys.", href: "/long-distance-travel" },
  { Icon: IconBriefcase, title: "Corporate accounts", desc: "Business travel & monthly billing.", href: "/corporate-accounts" },
  { Icon: IconCar, title: "Local taxis", desc: "Anywhere in Thurrock, any time.", href: "/local-taxis" },
];

export default function CruiseTerminalTransfers() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>Tilbury Cruise Terminal Transfers | UK-Wide Door to Ship | Lakeside Taxis</title>
        <meta
          name="description"
          content="Door-to-door transfers to and from London International Cruise Terminal, Tilbury. UK-wide coverage, fixed prices, meet & greet. P&O, Cunard, MSC and all major cruise lines. Call or WhatsApp for a competitive quote."
        />
        <meta name="keywords" content="Tilbury cruise terminal taxi, cruise terminal transfers Tilbury, taxi to Tilbury cruise terminal, London International Cruise Terminal transfers, P&O taxi Tilbury, Cunard transfers Tilbury Essex" />
        <meta property="og:title" content="Tilbury Cruise Terminal Transfers | Lakeside & Purfleet Taxis" />
        <meta property="og:description" content="UK-wide door-to-door transfers to and from London International Cruise Terminal, Tilbury. Fixed prices. Meet and greet. All major cruise lines." />
        <link rel="canonical" href="https://lakesidetaxi.co.uk/tilbury-cruise-terminal" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="ip cruise" ref={scope}>

        {/* ── HERO ──
            Both photographs on this page were dropped: a 175kB hero and a
            285kB aerial, on a page whose visitors are often booking months
            ahead on mobile. The ink ground carries it, as on the town pages. */}
        <section className="ip-hero cruise-hero">
          <div className="ip-inner ip-hero-inner">

            <nav className="cruise-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">Cruise terminal transfers</span>
            </nav>

            <div className="ip-eyebrow ls-reveal">London International Cruise Terminal · Tilbury, Essex</div>

            <h1 className="ls-reveal">
              Door to ship. <span>Ship to door.</span>
            </h1>

            <p className="ip-hero-copy ls-reveal">
              UK-wide transfers to and from <strong>London International Cruise Terminal, Tilbury</strong>. Fixed prices. Meet and greet. Flight-style punctuality — for every sailing, every cruise line, from any door in the UK.
            </p>

            {/* Two-way strip */}
            <div className="cruise-two-way ls-reveal">
              <div className="cruise-direction">
                <span className="cruise-direction-icon" aria-hidden="true">
                  <IconCar size={19} />
                  <IconArrowRight size={15} />
                  <IconShip size={19} />
                </span>
                <div>
                  <strong>Travelling to the ship?</strong>
                  <span>We collect from your door anywhere in the UK</span>
                </div>
              </div>
              <div className="cruise-direction-divider" />
              <div className="cruise-direction">
                <span className="cruise-direction-icon" aria-hidden="true">
                  <IconShip size={19} />
                  <IconArrowRight size={15} />
                  <IconCar size={19} />
                </span>
                <div>
                  <strong>Returning from the ship?</strong>
                  <span>We meet you at the terminal with a name board</span>
                </div>
              </div>
            </div>

            <div className="ip-hero-actions ls-reveal">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">
                Get a cruise transfer quote
                <IconArrowRight size={18} />
              </Link>
              <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">WhatsApp us now</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro ls-reveal">
              <span><IconCheck size={17} /> Fixed price before travel</span>
              <span><IconCheck size={17} /> UK-wide coverage</span>
              <span><IconCheck size={17} /> Ship delay monitoring</span>
            </div>
          </div>

          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid ls-stagger">
              {[
                { Icon: IconMap, strong: "UK-wide coverage", sub: "Any UK door to the ship" },
                { Icon: IconPound, strong: "Fixed prices", sub: "Agreed before you travel" },
                { Icon: IconUsers, strong: "Meet & greet", sub: "Name board at arrivals" },
                { Icon: IconShip, strong: "All cruise lines", sub: "P&O, Cunard, MSC & more" },
              ].map(({ Icon, strong, sub }) => (
                <div className="ip-trust-item ls-reveal" key={strong}>
                  <div className="ip-trust-icon"><Icon size={21} /></div>
                  <div><strong>{strong}</strong><span>{sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TWO-WAY SERVICE ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">How we can help you</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">Both directions, <span>perfectly handled</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light ls-reveal">
              Whether you're setting off on your cruise or arriving back in Tilbury, we handle both legs with the same care and precision.
            </p>
            <div className="ip-cards-2 ls-stagger">

              <div className="cruise-direction-card ls-reveal">
                <div className="cruise-direction-card-header">
                  <span className="cruise-direction-card-icon" aria-hidden="true">
                    <IconCar size={22} />
                    <IconArrowRight size={16} />
                    <IconShip size={22} />
                  </span>
                  <h3>Transfers <em>to</em> the terminal</h3>
                </div>
                <ul className="ip-check-list ip-check-list-light">
                  <li>Collected from your home address anywhere in the UK</li>
                  <li>Fixed price — no meter, no surprises on the day</li>
                  <li>Timed to arrive well before embarkation</li>
                  <li>Large vehicles for all your cruise luggage</li>
                  <li>Multi-stop pickups for travelling companions</li>
                  <li>Dropped directly at the terminal check-in entrance</li>
                </ul>
                <Link href="/quote-request" className="ip-btn ip-btn-primary cruise-card-btn">
                  Book your outbound transfer
                  <IconArrowRight size={18} />
                </Link>
              </div>

              <div className="cruise-direction-card ls-reveal">
                <div className="cruise-direction-card-header">
                  <span className="cruise-direction-card-icon" aria-hidden="true">
                    <IconShip size={22} />
                    <IconArrowRight size={16} />
                    <IconCar size={22} />
                  </span>
                  <h3>Transfers <em>from</em> the terminal</h3>
                </div>
                <ul className="ip-check-list ip-check-list-light">
                  <li>Driver meets you in arrivals with a name board</li>
                  <li>We monitor your ship's arrival time</li>
                  <li>If the ship is delayed, we adjust — no extra charge</li>
                  <li>Help with luggage as you disembark</li>
                  <li>Comfortable ride home however long the journey</li>
                  <li>Book both legs together for total peace of mind</li>
                </ul>
                <a href={WA} className="ip-btn ip-btn-green cruise-card-btn" target="_blank" rel="noopener noreferrer">
                  WhatsApp to book
                  <IconArrowRight size={18} />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── ABOUT THE TERMINAL ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker ls-reveal">London International Cruise Terminal</div>
              <h2 className="ip-section-title ls-reveal">Tilbury's <span>world-class port</span></h2>
              <p className="ip-section-sub ip-section-sub-dark ls-reveal">
                The London International Cruise Terminal (LICT) at Tilbury Docks is one of the UK's premier departure ports — and we know it like our own back garden. Our drivers have been running cruise transfers from across the UK to Tilbury for decades.
              </p>
              <ul className="ip-check-list ip-check-list-dark ls-reveal">
                <li>Located at Tilbury Docks, Essex RM18 7HS</li>
                <li>Approx. 25 miles east of central London</li>
                <li>Home port for P&amp;O, Cunard, MSC, Marella and others</li>
                <li>Direct road access — A13 and A126</li>
                <li>Covered drop-off and pick-up areas</li>
                <li>Porter and luggage handling on site</li>
                <li>Accessible terminal facilities</li>
              </ul>
            </div>

            <div className="cruise-stat-block ls-stagger">
              {[
                { number: "30+", label: "Years serving Thurrock & Tilbury" },
                { number: "All UK", label: "Collection and drop-off coverage" },
                { number: "All lines", label: "Every cruise line at LICT" },
                { number: "2hr", label: "Quote response time" },
              ].map(s => (
                <div key={s.label} className="cruise-stat ls-reveal">
                  <div className="cruise-stat-number">{s.number}</div>
                  <div className="cruise-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CRUISE LINES ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">Cruise lines we cover</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">Every line, <span>every sailing</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light ls-reveal">
              We provide transfers for all cruise lines operating out of Tilbury — past and present. If your cruise sails from LICT, we'll get you there.
            </p>
            <div className="cruise-lines-grid ls-reveal">
              {cruiseLines.map(line => (
                <div key={line.name} className="cruise-line-card">
                  <IconShip size={19} />
                  <div>
                    <strong>{line.name}</strong>
                    <span>{line.note}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="cruise-lines-note ls-reveal">
              Don't see your cruise line? Contact us — if it sails from Tilbury, we cover it.
            </p>
          </div>
        </section>

        {/* ── UK-WIDE COVERAGE ── */}
        <section className="ip-dark">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">UK-wide coverage</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">We'll collect from <span>anywhere in the UK</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-dark ls-reveal">
              No journey is too far. We quote fixed prices for long-distance transfers to Tilbury Cruise Terminal from anywhere in the United Kingdom.
            </p>
            <div className="ip-area-pills ip-area-pills-center ls-reveal">
              {coverage.map(area => (
                <span key={area} className="ip-area-pill-dark">
                  <IconPin size={14} />
                  {area}
                </span>
              ))}
            </div>
            <div className="cruise-center-actions ls-reveal">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">
                Get a UK transfer quote
                <IconArrowRight size={18} />
              </Link>
              <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">WhatsApp your location</a>
            </div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">What every booking includes</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">No corners cut. <span>No nasty surprises.</span></h2>
            <div className="ip-cards-3 ls-stagger">
              {includes.map(({ Icon, title, desc }) => (
                <div className="ip-card ls-reveal" key={title}>
                  <div className="ip-card-icon"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">Why choose Lakeside Taxis</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">We know <span>Tilbury</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light ls-reveal">
              We're not a national booking platform farming your job out to the lowest bidder. We're a local Thurrock taxi company with 30 years of experience — and Tilbury is on our doorstep.
            </p>
            <ul className="ip-check-list cruise-why-list ls-reveal">
              <li>Based in Thurrock — Tilbury is our home territory</li>
              <li>Over 30 years operating in and around the docks area</li>
              <li>We know the terminal layout, access roads and timings</li>
              <li>Competitive long-distance pricing for UK-wide journeys</li>
              <li>Genuine local knowledge means no detours, no delays</li>
              <li>Every fare agreed with a person before you travel</li>
            </ul>
            <div className="cruise-center-actions ls-reveal">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">
                Get a quote
                <IconArrowRight size={18} />
              </Link>
              <a href={TEL} className="ip-btn ip-btn-outline-dark">Call 01375 383878</a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center ls-reveal">Frequently asked questions</div>
            <h2 className="ip-section-title ip-section-title-center ls-reveal">Everything you need to know</h2>
            <div className="cruise-faq-grid ls-stagger">
              {faqs.map((f, i) => (
                <div key={i} className="cruise-faq-item ls-reveal">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
            <div className="cruise-faq-foot ls-reveal">
              <p>Still have a question? Just ask us directly.</p>
              <div className="cruise-center-actions">
                <a href={WA} className="ip-btn ip-btn-green" target="_blank" rel="noopener noreferrer">
                  <IconMessage size={18} />
                  WhatsApp us
                </a>
                <a href={EMAIL} className="ip-btn ip-btn-outline-dark">Email us</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner ls-reveal">
              <div>
                <h2>Ready to book your cruise transfer?</h2>
                <p>Tell us your location, your sailing date, and your cruise line — we'll come back with a fixed price fast.</p>
              </div>
              <div className="ip-cta-actions">
                <Link href="/quote-request" className="ip-btn ip-btn-primary">
                  Request a quote
                  <IconArrowRight size={18} />
                </Link>
                <a href={TEL} className="ip-cta-btn-dark">01375 383878</a>
                <a href={WA} className="ip-cta-btn-dark" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </div>

            <div className="ip-related-section">
              <div className="ip-kicker ip-kicker-center ls-reveal">Other services</div>
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
