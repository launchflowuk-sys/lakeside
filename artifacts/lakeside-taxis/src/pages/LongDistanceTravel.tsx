import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./inner-page.css";

const WA = "https://wa.me/447879956275";
const TEL = "tel:01375383878";

const destinations = [
  "London", "Birmingham", "Manchester", "Brighton", "Cambridge",
  "Oxford", "Southampton", "Bristol", "Leeds", "Edinburgh",
];

export default function LongDistanceTravel() {
  return (
    <Layout>
      <Helmet>
        <title>Long Distance Taxi from Thurrock & Essex | UK-Wide Travel | Lakeside Taxis</title>
        <meta name="description" content="Long distance taxi journeys from Thurrock and Essex to anywhere in the UK. Fixed prices, comfortable vehicles, professional drivers. Call for a quote today." />
      </Helmet>
      <div className="ip">

        {/* ── HERO ── */}
        <section className="ip-hero" style={{ "--hero-image": "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80')" } as React.CSSProperties}>
          <div className="ip-inner ip-hero-inner">
            <div className="ip-eyebrow">Long Distance Travel · UK-Wide From Thurrock</div>
            <h1>Go Further <span>With Confidence</span></h1>
            <p className="ip-hero-copy">
              UK-wide long distance journeys from Thurrock and Essex. Fixed price agreed upfront, comfortable vehicles, and a driver who knows how to make a long journey easy.
            </p>
            <div className="ip-hero-actions">
              <Link href="/quote-request" className="ip-btn ip-btn-primary">Get a Distance Quote →</Link>
              <a href={WA} className="ip-btn ip-btn-green">WhatsApp Us</a>
              <a href={TEL} className="ip-btn ip-btn-outline-light">01375 383878</a>
            </div>
            <div className="ip-micro">
              <span><strong>✓</strong> Fixed price agreed before travel</span>
              <span><strong>✓</strong> Comfortable, spacious vehicles</span>
              <span><strong>✓</strong> Any UK destination</span>
            </div>
          </div>
          <div className="ip-trust-strip">
            <div className="ip-inner ip-trust-grid">
              {[
                { icon: "🛣️", strong: "UK-Wide", sub: "Any destination, any distance" },
                { icon: "💷", strong: "Fixed Price", sub: "No meter, no surprises" },
                { icon: "🚘", strong: "Spacious Vehicles", sub: "Comfortable for long trips" },
                { icon: "👤", strong: "Professional Drivers", sub: "Experienced and reliable" },
              ].map(t => (
                <div className="ip-trust-item" key={t.strong}>
                  <div className="ip-trust-icon">{t.icon}</div>
                  <div><strong>{t.strong}</strong><span>{t.sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY LONG DISTANCE ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-kicker ip-kicker-center">Why Book With Us</div>
            <h2 className="ip-section-title ip-section-title-center">The Better Way <span>To Travel Far</span></h2>
            <p className="ip-section-sub ip-section-sub-center ip-section-sub-light">
              Trains are expensive. Driving is tiring. A private taxi lets you travel comfortably, door to door, at a price you agree before you leave.
            </p>
            <div className="ip-cards-3">
              {[
                { icon: "💷", title: "Fixed Price, Agreed Up Front", desc: "No meters running. No toll surprises added at the end. One clear price before you set off." },
                { icon: "🚪", title: "True Door to Door", desc: "Picked up from your home and dropped at your exact destination — no stations, no transfers." },
                { icon: "😴", title: "Comfortable for Long Trips", desc: "Spacious, clean vehicles. You can relax, sleep, or work while we handle the driving." },
                { icon: "🧳", title: "Plenty of Luggage Space", desc: "Heading somewhere for a week? We have vehicles with ample boot space for all your bags." },
                { icon: "⏱", title: "No Timetables", desc: "Leave when you want. No rushing to make a train. Your journey, your schedule." },
                { icon: "📞", title: "Easy to Book", desc: "Call or WhatsApp us with your destination and date. We'll give you a quote and confirm your driver." },
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

        {/* ── DESTINATIONS ── */}
        <section className="ip-dark">
          <div className="ip-inner ip-two-col">
            <div>
              <div className="ip-kicker">Popular Destinations</div>
              <h2 className="ip-section-title">We'll Take You <span>Anywhere in the UK</span></h2>
              <p className="ip-section-sub ip-section-sub-dark">
                From a day trip to London to a week in Edinburgh — we quote for any distance, any destination.
              </p>
              <div className="ip-area-pills">
                {destinations.map(d => (
                  <span key={d} className="ip-area-pill-dark">{d}</span>
                ))}
              </div>
              <p style={{ color: "color-mix(in srgb, hsl(var(--card)) 55%, transparent)", fontSize: 14, marginBottom: 24, marginTop: 4 }}>
                Don't see your destination? Just ask — if it's in the UK, we'll quote for it.
              </p>
              <Link href="/quote-request" className="ip-btn ip-btn-primary">Get a Distance Quote →</Link>
            </div>
            <ul className="ip-check-list ip-check-list-dark" style={{ alignSelf: "center" }}>
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
            <div className="ip-kicker ip-kicker-center">How to Book</div>
            <h2 className="ip-section-title ip-section-title-center">Three Easy <span>Steps</span></h2>
            <div className="ip-cards-3">
              {[
                { icon: "1️⃣", title: "Tell Us Where You're Going", desc: "Share your pickup address, destination, date and number of passengers — call, WhatsApp or use our quote form." },
                { icon: "2️⃣", title: "We Confirm Your Fixed Price", desc: "We'll come back to you with a clear fixed price. No obligation — just a straightforward quote." },
                { icon: "3️⃣", title: "We Pick You Up", desc: "On the day, your driver arrives at your door at the agreed time and takes you all the way there." },
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

        {/* ── CTA ── */}
        <section className="ip-light">
          <div className="ip-inner">
            <div className="ip-cta-banner">
              <div>
                <h2>Going Somewhere Far?</h2>
                <p>Tell us your destination and we'll come back with a fixed price — no obligation.</p>
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
                  { icon: "✈️", title: "Airport Transfers", desc: "All major London airports.", href: "/airport-transfers" },
                  { icon: "🚕", title: "Local Taxis", desc: "Anywhere in Thurrock.", href: "/local-taxis" },
                  { icon: "💼", title: "Corporate Travel", desc: "Business accounts available.", href: "/corporate-accounts" },
                  { icon: "🎒", title: "School Runs", desc: "Safe and reliable.", href: "/school-runs" },
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
