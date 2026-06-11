import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
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

export default function AirportTransfers() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <Layout>
      <Helmet>
        <title>Airport Transfers from Thurrock | Heathrow, Gatwick & More | Lakeside Taxis</title>
        <meta name="description" content="Reliable airport transfers from Grays, Purfleet and Thurrock to Heathrow, Gatwick, Stansted, Luton, London City and Southend. Fixed prices, flight tracking, 24/7 service." />
      </Helmet>
      <div className="ip">

        {/* ── HERO ── */}
        <section className="ip-hero" style={{ "--hero-image": "url('/images/airport-transfers-hero.webp')" } as React.CSSProperties}>
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow">Airport Transfers · All Major UK Airports</div>
            <h1>Airport Transfers <span>From Thurrock</span></h1>
            <p className="ip-hero-copy">
              Stress-free transfers from Grays, Purfleet, Lakeside and wider Thurrock to every major London and Essex airport. Early departures. Late arrivals. Your driver is always waiting.
            </p>
            <div className="ip-hero-actions">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">Get Airport Quote →</Link>
              <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro">
              <span><strong>✓</strong> Fixed price confirmed before travel</span>
              <span><strong>✓</strong> Flight tracking on return pickups</span>
              <span><strong>✓</strong> 24/7 service</span>
            </div>
          </div>
          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid">
              {[
                { icon: "✈", strong: "6 Airports", sub: "All major London & Essex" },
                { icon: "📡", strong: "Flight Tracking", sub: "We monitor your arrival" },
                { icon: "🕐", strong: "24/7 Service", sub: "Any hour, any day" },
                { icon: "💷", strong: "Fixed Price", sub: "No surprises on the day" },
              ].map(t => (
                <div className="ip-trust-item" key={t.strong}>
                  <div className="ip-trust-icon">{t.icon}</div>
                  <div><strong>{t.strong}</strong><span>{t.sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AIRPORTS GRID ── */}
        <section className="ip-dark">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center" style={{ color: "hsl(var(--primary))" }}>Fixed Prices From Thurrock</div>
            <h2 className="ip-section-title ip-section-title-center" style={{ color: "hsl(var(--card))" }}>Airport Transfer <span>Prices</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-dark">
              All prices are fixed — confirmed before travel, no surprises on the day.
            </p>
            <div className="ip-airport-grid">
              {airports.map(a => (
                <div key={a.href} className="ip-airport-card">
                  <div className="ip-airport-card-header">
                    <div>
                      <div className="ip-airport-name">{a.name}</div>
                      <div className="ip-airport-code">{a.code}</div>
                    </div>
                  </div>
                  <div className="ip-airport-price">{a.price}</div>
                  <div className="ip-airport-price-label">fixed price from Thurrock</div>
                  <p className="ip-airport-desc">{a.desc}</p>
                  <Link href="/quote-request" className="ip-airport-book-btn">Book Now →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker">How It Works</div>
              <h2 className="ip-section-title">Simple. <span>Reliable. Stress-Free.</span></h2>
              <p className="ip-section-sub ip-section-sub-dark">
                No guesswork. No waiting around. We handle everything so your journey starts and ends smoothly.
              </p>
              <ul className="ip-check-list ip-check-list-dark">
                <li>Send us your flight details and pickup address</li>
                <li>We confirm your fixed price and driver details</li>
                <li>Your driver arrives on time — or early for early flights</li>
                <li>For return pickups we track your flight live</li>
                <li>If your flight is delayed, we adjust — no extra charge</li>
                <li>Meet and greet available at the arrivals hall</li>
                <li>Help with luggage as standard</li>
              </ul>
              <div className="ip-hero-actions" style={{ marginTop: 28 }}>
                <Link href="/quote-request" className="ip-btn ip-btn-primary">Book Your Transfer →</Link>
                <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              </div>
            </div>
            <div
              className="ip-image-block"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=900&q=80')" }}
            />
          </div>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section className="ip-muted">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">What's Included</div>
            <h2 className="ip-section-title ip-section-title-center">Everything You <span>Need Covered</span></h2>
            <div className="ip-cards-4">
              {[
                { icon: "🛫", title: "Outbound Transfers", desc: "We get you to the terminal on time. Every time." },
                { icon: "🛬", title: "Return Pickups", desc: "We're waiting when you land — however late the flight." },
                { icon: "👔", title: "Meet & Greet", desc: "Driver meets you in arrivals with a name board." },
                { icon: "🧳", title: "Extra Luggage", desc: "Large vehicles available for multiple bags and oversized items." },
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

        {/* ── FAQ ── */}
        <section className="ip-faq-section">
          <div className="ip-inner">
            <div className="ip-faq-layout">
              <div className="ip-faq-header">
                <div className="ip-kicker">Common Questions</div>
                <h2 className="ip-faq-title">Everything You <span>Need to Know</span></h2>
                <p className="ip-faq-intro">
                  Quick answers to the questions we get asked most. If yours isn't here, just WhatsApp us.
                </p>
                <a href={WA} className="ip-btn ip-btn-green ip-faq-wa-btn">Ask Us on WhatsApp →</a>
              </div>
              <div className="ip-faq-list">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`ip-faq-item${openFaq === i ? " ip-faq-item--open" : ""}`}
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <button
                      className="ip-faq-question"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span className="ip-faq-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="ip-faq-q-text">{faq.q}</span>
                      <span className="ip-faq-toggle">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    <div className="ip-faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner">
              <div>
                <h2>Airport Transfer from Thurrock?</h2>
                <p>Send us your flight details and we'll confirm your price within 2 hours.</p>
              </div>
              <div className="ip-cta-actions">
                <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
                <a href={TEL} className="ip-cta-btn-dark">01375 383878</a>
                <Link href="/quote-request" className="ip-cta-btn-dark">Get a Quote</Link>
              </div>
            </div>
            <div style={{ marginTop: 56 }}>
              <div className="ip-kicker ip-kicker-center" style={{ marginBottom: 16 }}>Our Other Services</div>
              <div className="ip-related-grid">
                {[
                  { icon: "🚕", title: "Local Taxis", desc: "Anywhere in Thurrock, any time.", href: "/local-taxis" },
                  { icon: "💼", title: "Corporate Travel", desc: "Business accounts available.", href: "/corporate-accounts" },
                  { icon: "🎒", title: "School Runs", desc: "Safe, reliable daily service.", href: "/school-runs" },
                  { icon: "🛣️", title: "Long Distance", desc: "UK-wide journeys.", href: "/long-distance-travel" },
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
