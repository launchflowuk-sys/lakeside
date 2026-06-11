import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import BookingForm from "@/components/BookingForm";
import Layout from "@/components/layout/Layout";
import "./home-page.css";

const PHONE_HREF = "tel:01375383878";
const WA_HREF = "https://wa.me/447879956275";

const services = [
  { icon: "🚕", title: "Local Taxi", desc: "Fast, reliable local taxis across Thurrock day and night.", href: "/local-taxis" },
  { icon: "✈️", title: "Airport Transfers", desc: "Transfers to and from all major airports in the UK.", href: "/airport-transfers" },
  { icon: "🎒", title: "School Runs", desc: "Safe, reliable school transport you can count on.", href: "/school-runs" },
  { icon: "💼", title: "Corporate Travel", desc: "Business travel solutions and corporate accounts.", href: "/corporate-accounts" },
  { icon: "🛣️", title: "Long Distance", desc: "UK-wide journeys made comfortable and stress-free.", href: "/long-distance-travel" },
  { icon: "📞", title: "Any Journey", desc: "Any other journey? We are here to help.", href: "/quote-request" },
];

const testimonials = [
  { initial: "L", name: "Lisa M.", service: "Heathrow Airport Transfer", text: "Excellent service from start to finish. Driver was on time, friendly and the car was spotless. Highly recommend." },
  { initial: "M", name: "Mark T.", service: "School Run Service", text: "We use Lakeside Taxis for school runs. Always reliable and great communication. Couldn't ask for more." },
  { initial: "J", name: "James R.", service: "Corporate Account", text: "Professional, punctual and great prices. Our go-to taxi company for all business travel across Essex." },
];

const airports = [
  { name: "Heathrow", code: "LHR", href: "/airport-transfers/heathrow" },
  { name: "Gatwick", code: "LGW", href: "/airport-transfers/gatwick" },
  { name: "Stansted", code: "STN", href: "/airport-transfers/stansted" },
  { name: "Luton", code: "LTN", href: "/airport-transfers/luton" },
  { name: "London City", code: "LCY", href: "/airport-transfers/london-city" },
  { name: "Southend", code: "SEN", href: "/airport-transfers/southend" },
];

export default function Home() {
  return (
    <Layout>
      <Helmet>
        <title>Lakeside &amp; Purfleet Taxis Ltd | Thurrock's Trusted Taxi Company</title>
        <meta name="description" content="Thurrock's trusted local taxi company for over 30 years. Local taxis, airport transfers and corporate travel across Grays, Purfleet, Lakeside and all of Thurrock, Essex." />
        <meta property="og:title" content="Lakeside & Purfleet Taxis Ltd | Thurrock's Trusted Taxi Company" />
        <meta property="og:description" content="Thurrock's trusted local taxi company for over 30 years. Local taxis, airport transfers and corporate travel across Essex." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TaxiService",
          "name": "Lakeside & Purfleet Taxis Ltd",
          "telephone": "01375383878",
          "email": "info@lakesidetaxi.co.uk",
          "areaServed": "Thurrock, Essex",
          "url": "https://lakesidetaxi.co.uk",
          "address": { "@type": "PostalAddress", "addressLocality": "Thurrock", "addressRegion": "Essex", "addressCountry": "GB" },
          "priceRange": "££",
          "openingHours": "Mo-Su 00:00-23:59"
        })}</script>
      </Helmet>

      <div className="hp">

        {/* ── HERO ── */}
        <section className="hp-hero" data-testid="hero-section" data-section="hero">
          <div className="hp-inner hp-hero-grid">

            {/* Left: copy */}
            <div className="hp-hero-copy-block" data-testid="hero-copy">
              <div className="hp-eyebrow">Serving Thurrock Since 1990</div>
              <h1>
                Thurrock's
                <span>Trusted Taxi</span>
                Company
              </h1>
              <div className="hp-script">Since 1990</div>
              <p className="hp-hero-copy">
                Local taxis, airport transfers, school runs and business travel across Grays, Purfleet,
                Lakeside, Chafford Hundred, Tilbury and wider Thurrock.
              </p>
              <div className="hp-coverage">
                <span>Grays</span>
                <span>Purfleet</span>
                <span>Chafford Hundred</span>
                <span>Tilbury</span>
                <span>Aveley</span>
                <span>West Thurrock</span>
                <span>Stanford-le-Hope</span>
              </div>
              <div className="hp-hero-actions">
                <Link href="/quote-request" className="hp-btn hp-btn-primary" data-testid="hero-quote-btn">
                  Request a Quote →
                </Link>
                <a href={WA_HREF} className="hp-btn hp-btn-green" data-testid="hero-whatsapp-btn">
                  WhatsApp Us
                </a>
                <a href={PHONE_HREF} className="hp-btn hp-btn-outline" data-testid="hero-call-btn">
                  01375 383878
                </a>
              </div>
              <div className="hp-micro-proof">
                <span><strong>⚡</strong> We reply within 2 hours</span>
                <span><strong>✓</strong> No payment required</span>
                <span><strong>✓</strong> No app required</span>
              </div>
            </div>

            {/* Right: existing booking form */}
            <div data-testid="hero-form">
              <div style={{
                background: "color-mix(in srgb, hsl(var(--foreground)) 90%, transparent)",
                border: "1px solid color-mix(in srgb, hsl(var(--card)) 18%, transparent)",
                borderRadius: 22,
                padding: 34,
                boxShadow: "0 26px 80px color-mix(in srgb, hsl(var(--foreground)) 70%, transparent)",
              }}>
                <h2 style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "hsl(var(--primary))",
                  fontSize: 28,
                  lineHeight: 1,
                  margin: "0 0 8px",
                  textTransform: "uppercase",
                  fontWeight: 900,
                }}>
                  Get Your Taxi Quote
                </h2>
                <p style={{
                  color: "color-mix(in srgb, hsl(var(--card)) 78%, transparent)",
                  margin: "0 0 20px",
                  lineHeight: 1.5,
                  fontSize: 14,
                }}>
                  Reply within 2 hours. No payment required. No obligation.
                </p>
                <BookingForm compact />
              </div>
              <p style={{ textAlign: "center", fontSize: 12, color: "color-mix(in srgb, hsl(var(--card)) 40%, transparent)", marginTop: 10 }}>
                No payment · No obligation · Trusted local service since 1990
              </p>
            </div>

          </div>

          {/* Trust strip */}
          <div className="hp-trust-strip">
            <div className="hp-inner hp-trust-grid">
              {[
                { icon: "🛡", strong: "30+ Years", sub: "Serving Thurrock" },
                { icon: "✈", strong: "Airport Transfer", sub: "Specialists" },
                { icon: "🏢", strong: "Corporate Accounts", sub: "Available" },
                { icon: "✓", strong: "Fully Licensed", sub: "& Insured" },
                { icon: "👥", strong: "Local Thurrock", sub: "Drivers" },
              ].map((item) => (
                <div className="hp-trust-item" key={item.strong}>
                  <div className="hp-trust-icon">{item.icon}</div>
                  <div>
                    <strong>{item.strong}</strong>
                    <span>{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="hp-light" data-testid="services-section" data-section="services">
          <div className="hp-inner">
            <div className="hp-kicker">Every Journey, Covered</div>
            <h2 className="hp-section-title">Our Services</h2>
            <div className="hp-services-grid">
              {services.map((s) => (
                <Link key={s.href} href={s.href} className="hp-service-card" data-testid={`service-card-${s.href.split("/").pop()}`}>
                  <div className="hp-service-image">{s.icon}</div>
                  <div className="hp-service-body">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="hp-center-cta">
              <Link href="/quote-request" className="hp-btn hp-btn-primary" data-testid="services-cta-btn">
                Request a Quote for Any Journey →
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="hp-dark" data-testid="why-section" data-section="why-choose-us">
          <div className="hp-inner hp-why-grid">
            <div>
              <div className="hp-kicker" style={{ textAlign: "left" }}>Local People. Local Service.</div>
              <h2 className="hp-why-title">Why Thurrock <span>Chooses Us</span></h2>
              <ul className="hp-check-list">
                <li>Over 30 years of trusted local service</li>
                <li>Fully licensed, insured and compliant</li>
                <li>Professional drivers and clean vehicles</li>
                <li>Local taxis, airport transfers and business travel</li>
                <li>Price confirmed before you travel</li>
                <li>We reply to quote requests within 2 hours</li>
              </ul>
            </div>
            <div className="hp-contact-cards">
              <div className="hp-contact-card">
                <div className="hp-icon">📄</div>
                <h3>Get a Quote</h3>
                <p>Send your journey details and we will get back to you.</p>
                <Link href="/quote-request" className="hp-btn hp-btn-primary">Request Quote</Link>
              </div>
              <div className="hp-contact-card">
                <div className="hp-icon">🟢</div>
                <h3>WhatsApp Us</h3>
                <p>The quickest way to get a fast response.</p>
                <a href={WA_HREF} className="hp-btn hp-btn-green">Chat on WhatsApp</a>
              </div>
              <div className="hp-contact-card">
                <div className="hp-icon">📞</div>
                <h3>Call Us</h3>
                <p>Speak directly with our friendly team.</p>
                <a href={PHONE_HREF} className="hp-btn hp-btn-outline">01375 383878</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="hp-light" data-testid="testimonials-section" data-section="testimonials">
          <div className="hp-inner">
            <div className="hp-kicker">Trusted by Customers Across Thurrock</div>
            <h2 className="hp-section-title">What Our Customers Say</h2>
            <div className="hp-testimonial-grid">
              {testimonials.map((t, i) => (
                <article className="hp-testimonial-card" key={i} data-testid={`testimonial-${i}`}>
                  <div className="hp-stars">★★★★★</div>
                  <p>{t.text}</p>
                  <div className="hp-person">
                    <div className="hp-avatar">{t.initial}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.service}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="hp-center-cta" style={{ marginTop: 42 }}>
              <Link href="/quote-request" className="hp-btn hp-btn-primary" data-testid="testimonials-quote-btn">
                Request a Quote →
              </Link>
              <a href={WA_HREF} className="hp-btn hp-btn-green" style={{ marginLeft: 14 }}>
                WhatsApp for a Quick Quote
              </a>
            </div>
          </div>
        </section>

        {/* ── AIRPORT TRANSFERS ── */}
        <section className="hp-dark" data-testid="airports-section" data-section="airport-transfers">
          <div className="hp-inner">
            <div className="hp-airport-grid">
              <div className="hp-airport-image" />
              <div>
                <h2 className="hp-airport-title">
                  Airport Transfers <span>From Thurrock</span>
                </h2>
                <p style={{ color: "color-mix(in srgb, hsl(var(--card)) 80%, transparent)", lineHeight: 1.6 }}>
                  Reliable airport transfers from Grays, Purfleet, Lakeside and wider Thurrock to all major UK airports.
                </p>
                <ul className="hp-airport-list">
                  <li>Heathrow, Gatwick, Stansted, Luton, London City and Southend</li>
                  <li>Meet and greet available</li>
                  <li>Flight monitoring for delays</li>
                  <li>Fixed price confirmed before travel</li>
                  <li>24/7 airport transfer service</li>
                </ul>
                <div className="hp-airport-buttons">
                  {airports.map((a) => (
                    <Link key={a.href} href={a.href} className="hp-airport-pill" data-testid={`airport-pill-${a.code.toLowerCase()}`}>
                      {a.name}<br />{a.code}
                    </Link>
                  ))}
                </div>
                <div style={{ marginTop: 28 }}>
                  <Link href="/quote-request" className="hp-btn hp-btn-primary" data-testid="airports-cta-btn">
                    Get Airport Transfer Quote →
                  </Link>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="hp-final-cta" data-section="final-cta">
              <div>
                <h2>Need a Taxi in Thurrock?</h2>
                <p>Fast response. Friendly service. Always here for you.</p>
              </div>
              <div className="hp-final-actions">
                <a href={WA_HREF} className="hp-btn hp-btn-green">WhatsApp Us</a>
                <a href={PHONE_HREF} className="hp-btn hp-btn-outline">01375 383878</a>
                <Link href="/quote-request" className="hp-btn hp-btn-outline">Request a Quote</Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
