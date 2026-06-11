import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./inner-page.css";
import "./cruise-terminal.css";

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";
const EMAIL = "mailto:info@lakesidetaxi.co.uk";

const cruiseLines = [
  { name: "P&O Cruises", icon: "🚢", note: "UK's largest cruise brand — regular Tilbury sailings" },
  { name: "Cunard", icon: "⚓", note: "Queen Mary 2 & world voyages from Tilbury" },
  { name: "MSC Cruises", icon: "🌊", note: "Mediterranean & world cruises" },
  { name: "Marella Cruises", icon: "☀️", note: "TUI's cruise line — popular holiday sailings" },
  { name: "Fred. Olsen", icon: "🛳️", note: "Boutique cruises from Tilbury year-round" },
  { name: "Ambassador", icon: "🎖️", note: "British boutique cruise line based at Tilbury" },
  { name: "Saga Cruises", icon: "🌍", note: "Premium over-50s voyages" },
  { name: "Hebridean", icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", note: "Small-ship Scottish island cruises" },
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

export default function CruiseTerminalTransfers() {
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

      <div className="ip cruise">

        {/* ── HERO ── */}
        <section
          className="ip-hero cruise-hero"
          style={{ "--hero-image": "url('/cruise-hero-desktop.webp')" } as React.CSSProperties}
        >
          <div className="ip-inner ip-hero-inner">

            {/* Breadcrumb */}
            <nav className="cruise-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span>Cruise Terminal Transfers</span>
            </nav>

            <div className="ip-eyebrow">London International Cruise Terminal · Tilbury, Essex</div>

            <h1>
              Door to Ship.
              <span>Ship to Door.</span>
            </h1>

            <p className="ip-hero-copy">
              UK-wide transfers to and from <strong style={{ color: "hsl(var(--primary))" }}>London International Cruise Terminal, Tilbury</strong>. Fixed prices. Meet and greet. Flight-style punctuality — for every sailing, every cruise line, from any door in the UK.
            </p>

            {/* Two-way CTA strip */}
            <div className="cruise-two-way">
              <div className="cruise-direction">
                <span className="cruise-direction-icon">🚗→🚢</span>
                <div>
                  <strong>Travelling TO the Ship?</strong>
                  <span>We collect from your door anywhere in the UK</span>
                </div>
              </div>
              <div className="cruise-direction-divider" />
              <div className="cruise-direction">
                <span className="cruise-direction-icon">🚢→🚗</span>
                <div>
                  <strong>Returning FROM the Ship?</strong>
                  <span>We meet you at the terminal with a name board</span>
                </div>
              </div>
            </div>

            <div className="ip-hero-actions">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">Get a Cruise Transfer Quote →</Link>
              <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us Now</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro">
              <span><strong>✓</strong> Fixed price confirmed before travel</span>
              <span><strong>✓</strong> UK-wide coverage</span>
              <span><strong>✓</strong> Ship delay monitoring</span>
              <span><strong>✓</strong> Extra luggage capacity</span>
            </div>
          </div>

          {/* Trust strip */}
          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid">
              {[
                { icon: "🌍", strong: "UK-Wide Coverage", sub: "Any UK door to the ship" },
                { icon: "💷", strong: "Fixed Prices", sub: "Agreed before you travel" },
                { icon: "🤝", strong: "Meet & Greet", sub: "Name board at arrivals" },
                { icon: "🛳️", strong: "All Cruise Lines", sub: "P&O, Cunard, MSC & more" },
              ].map(t => (
                <div className="ip-trust-item" key={t.strong}>
                  <div className="ip-trust-icon">{t.icon}</div>
                  <div><strong>{t.strong}</strong><span>{t.sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TWO-WAY SERVICE ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">How We Can Help You</div>
            <h2 className="ip-section-title ip-section-title-center">Both Directions, <span>Perfectly Handled</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light">
              Whether you're setting off on your cruise or arriving back in Tilbury, we handle both legs with the same care and precision.
            </p>
            <div className="ip-cards-2">

              {/* TO the terminal */}
              <div className="cruise-direction-card cruise-to">
                <div className="cruise-direction-card-header">
                  <span className="cruise-direction-card-icon">🚗 → 🚢</span>
                  <h3>Transfers <em>To</em> the Terminal</h3>
                </div>
                <ul className="ip-check-list ip-check-list-light">
                  <li>Collected from your home address anywhere in the UK</li>
                  <li>Fixed price — no meter, no surprises on the day</li>
                  <li>Timed to arrive well before embarkation</li>
                  <li>Large vehicles for all your cruise luggage</li>
                  <li>Multi-stop pickups for travelling companions</li>
                  <li>Dropped directly at the terminal check-in entrance</li>
                </ul>
                <div style={{ marginTop: 24 }}>
                  <Link href="/quote-request" className="ip-btn ip-btn-primary">Book Your Outbound Transfer →</Link>
                </div>
              </div>

              {/* FROM the terminal */}
              <div className="cruise-direction-card cruise-from">
                <div className="cruise-direction-card-header">
                  <span className="cruise-direction-card-icon">🚢 → 🚗</span>
                  <h3>Transfers <em>From</em> the Terminal</h3>
                </div>
                <ul className="ip-check-list ip-check-list-light">
                  <li>Driver meets you in arrivals with a name board</li>
                  <li>We monitor your ship's arrival time</li>
                  <li>If the ship is delayed, we adjust — no extra charge</li>
                  <li>Help with luggage as you disembark</li>
                  <li>Comfortable ride home however long the journey</li>
                  <li>Book both legs together for total peace of mind</li>
                </ul>
                <div style={{ marginTop: 24 }}>
                  <a href={WA} className="ip-btn ip-btn-green">WhatsApp to Book →</a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── ABOUT THE TERMINAL ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker">London International Cruise Terminal</div>
              <h2 className="ip-section-title">Tilbury's <span>World-Class Port</span></h2>
              <p className="ip-section-sub ip-section-sub-dark">
                The London International Cruise Terminal (LICT) at Tilbury Docks is one of the UK's premier departure ports — and we know it like our own back garden. Our drivers have been running cruise transfers from across the UK to Tilbury for decades.
              </p>
              <ul className="ip-check-list ip-check-list-dark">
                <li>Located at Tilbury Docks, Essex RM18 7HS</li>
                <li>Approx. 25 miles east of central London</li>
                <li>Home port for P&O, Cunard, MSC, Marella and others</li>
                <li>Direct road access — A13 and A126</li>
                <li>Covered drop-off and pick-up areas</li>
                <li>Porter and luggage handling on site</li>
                <li>Accessible terminal facilities</li>
              </ul>
            </div>
            <div
              className="ip-image-block"
              style={{
                backgroundImage: "url('/cruise-terminal-aerial.webp')",
                backgroundPosition: "center center",
                minHeight: 420,
              }}
            />
          </div>
        </section>

        {/* ── CRUISE LINES ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">Cruise Lines We Cover</div>
            <h2 className="ip-section-title ip-section-title-center">Every Line, <span>Every Sailing</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light">
              We provide transfers for all cruise lines operating out of Tilbury — past and present. If your cruise sails from LICT, we'll get you there.
            </p>
            <div className="cruise-lines-grid">
              {cruiseLines.map(line => (
                <div key={line.name} className="cruise-line-card">
                  <span className="cruise-line-icon">{line.icon}</span>
                  <div>
                    <strong>{line.name}</strong>
                    <span>{line.note}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="cruise-lines-note">
              Don't see your cruise line? Contact us — if it sails from Tilbury, we cover it.
            </p>
          </div>
        </section>

        {/* ── UK-WIDE COVERAGE ── */}
        <section className="ip-dark">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">UK-Wide Coverage</div>
            <h2 className="ip-section-title ip-section-title-center">We'll Collect From <span>Anywhere in the UK</span></h2>
            <p className="ip-section-sub ip-section-sub-center" style={{ color: "color-mix(in srgb, hsl(var(--card)) 75%, transparent)", textAlign: "center", maxWidth: 680, margin: "0 auto 36px" }}>
              No journey is too far. We quote fixed prices for long-distance transfers to Tilbury Cruise Terminal from anywhere in the United Kingdom.
            </p>
            <div className="cruise-coverage-grid">
              {coverage.map(area => (
                <div key={area} className="cruise-coverage-item">
                  <span>✦</span> {area}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <Link href="/quote-request" className="ip-btn ip-btn-primary" style={{ marginRight: 14 }}>Get a UK Transfer Quote →</Link>
              <a href={WA} className="ip-btn ip-btn-green">WhatsApp Your Location</a>
            </div>
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">What Every Booking Includes</div>
            <h2 className="ip-section-title ip-section-title-center">No Corners Cut. <span>No Nasty Surprises.</span></h2>
            <div className="ip-cards-3">
              {[
                { icon: "💷", title: "Fixed Price, Always", desc: "Your price is agreed and confirmed before travel. No meters. No last-minute additions. What we quote is what you pay." },
                { icon: "🛳️", title: "Ship Tracking", desc: "For return pickups, we monitor your vessel's arrival time. If the schedule changes, we know — and we adjust. You won't be left waiting." },
                { icon: "🤝", title: "Meet & Greet", desc: "Your driver arrives at the terminal with a name board. You walk off the ship and straight into your car. No stress, no searching." },
                { icon: "🧳", title: "Luggage for Cruisers", desc: "We know cruise passengers travel with a lot. We have large-boot vehicles and can accommodate everything from suitcases to mobility equipment." },
                { icon: "📍", title: "True Door to Door", desc: "Collected from your home address and dropped at the terminal entrance. On the return, taken all the way to your front door." },
                { icon: "📞", title: "Direct Contact", desc: "No automated systems. No intermediaries. You have a direct phone number and WhatsApp for your driver on the day of travel." },
              ].map(c => (
                <div className="ip-card" key={c.title}>
                  <div className="ip-card-icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker">Why Choose Lakeside Taxis</div>
              <h2 className="ip-section-title">We Know <span>Tilbury</span></h2>
              <p className="ip-section-sub ip-section-sub-dark">
                We're not a national booking platform farming your job out to the lowest bidder. We're a local Thurrock taxi company with 30 years of experience — and Tilbury is on our doorstep.
              </p>
              <ul className="ip-check-list ip-check-list-dark">
                <li>Based in Thurrock — Tilbury is our home territory</li>
                <li>30+ years operating in and around the docks area</li>
                <li>We know the terminal layout, access roads and timings</li>
                <li>Competitive long-distance pricing — often better than national firms</li>
                <li>Genuine local knowledge means no detours, no delays</li>
                <li>Trusted by repeat cruise passengers year after year</li>
              </ul>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, marginTop: 28 }}>
                <Link href="/quote-request" className="ip-btn ip-btn-primary">Get a Quote →</Link>
                <a href={TEL} className="ip-btn ip-btn-outline-light">Call 01375 383878</a>
              </div>
            </div>
            <div className="cruise-stat-block">
              {[
                { number: "30+", label: "Years serving Thurrock & Tilbury" },
                { number: "All UK", label: "Collection and drop-off coverage" },
                { number: "All Lines", label: "Every cruise line at LICT" },
                { number: "2hr", label: "Quote response time" },
              ].map(s => (
                <div key={s.label} className="cruise-stat">
                  <div className="cruise-stat-number">{s.number}</div>
                  <div className="cruise-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">Frequently Asked Questions</div>
            <h2 className="ip-section-title ip-section-title-center">Everything You <span>Need to Know</span></h2>
            <div className="cruise-faq-grid">
              {faqs.map((f, i) => (
                <div key={i} className="cruise-faq-item">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: 16, fontSize: 15 }}>Still have a question? Just ask us directly.</p>
              <a href={WA} className="ip-btn ip-btn-green" style={{ marginRight: 12 }}>WhatsApp Us</a>
              <a href={EMAIL} className="ip-btn ip-btn-outline-dark">Email Us</a>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner">
              <div>
                <h2>Ready to Book Your Cruise Transfer?</h2>
                <p>Tell us your location, your sailing date, and your cruise line — we'll come back with a fixed price fast.</p>
              </div>
              <div className="ip-cta-actions">
                <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us Now</a>
                <a href={TEL} className="ip-cta-btn-dark">01375 383878</a>
                <Link href="/quote-request" className="ip-cta-btn-dark">Request a Quote</Link>
              </div>
            </div>

            {/* Related services */}
            <div style={{ marginTop: 56 }}>
              <div className="ip-kicker ip-kicker-center" style={{ marginBottom: 16 }}>Other Services</div>
              <div className="ip-related-grid">
                {[
                  { icon: "✈️", title: "Airport Transfers", desc: "Heathrow, Gatwick, Stansted & more.", href: "/airport-transfers" },
                  { icon: "🛣️", title: "Long Distance Travel", desc: "UK-wide private hire journeys.", href: "/long-distance-travel" },
                  { icon: "💼", title: "Corporate Accounts", desc: "Business travel & monthly billing.", href: "/corporate-accounts" },
                  { icon: "🚕", title: "Local Taxis", desc: "Anywhere in Thurrock, any time.", href: "/local-taxis" },
                ].map(r => (
                  <Link key={r.href} href={r.href} className="ip-related-card">
                    <div className="ip-related-icon">{r.icon}</div>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
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
