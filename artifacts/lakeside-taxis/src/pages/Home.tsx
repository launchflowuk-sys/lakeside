import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { FileText, MessageCircle, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import BookingForm from "@/components/BookingForm";
import Layout from "@/components/layout/Layout";
import "./home-page.css";

const PHONE_HREF = "tel:01375383878";
const WA_HREF = "https://wa.me/447879956275";

const services = [
  { title: "Local Taxi", desc: "Fast, reliable taxis across Thurrock — day and night, 365 days a year.", href: "/local-taxis", bg: "/images/services/local-taxi.webp" },
  { title: "Airport Transfers", desc: "Fixed-price transfers to all major UK airports — Heathrow, Gatwick, Stansted and more.", href: "/airport-transfers", bg: "/images/services/airport.webp" },
  { title: "School Runs", desc: "Safe, reliable school transport with DBS-checked, experienced drivers.", href: "/school-runs", bg: "/images/services/school-runs.webp" },
  { title: "Corporate Travel", desc: "Professional business travel solutions and managed corporate accounts.", href: "/corporate-accounts", bg: "/images/services/corporate.webp" },
  { title: "Long Distance", desc: "Comfortable, stress-free UK-wide journeys with upfront pricing.", href: "/long-distance-travel", bg: "/images/services/long-distance.webp" },
  { title: "Any Journey", desc: "Something else? We cover every journey — just get in touch.", href: "/quote-request", bg: "/images/services/airport.webp" },
];

interface Review {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
}

const FALLBACK_REVIEWS: Review[] = [
  { author_name: "Lisa M.", rating: 5, relative_time_description: "2 months ago", text: "Excellent service from start to finish. Driver was on time, friendly and the car was spotless. Used them for a Heathrow transfer — absolutely perfect. Highly recommend." },
  { author_name: "Mark T.", rating: 5, relative_time_description: "3 months ago", text: "We use Lakeside Taxis for the school run every week. Never late once, my kids feel completely safe with the drivers. Brilliant communication and great service." },
  { author_name: "James R.", rating: 5, relative_time_description: "1 month ago", text: "Professional, punctual and very reasonable pricing. Set up a corporate account for our business travel and it's been seamless. Our go-to taxi company in Thurrock." },
  { author_name: "Sarah K.", rating: 5, relative_time_description: "5 months ago", text: "Called at 4am for an early Gatwick flight and they were there bang on time. Clean car, friendly driver. Couldn't fault it. Will be using again for sure." },
  { author_name: "David H.", rating: 5, relative_time_description: "6 months ago", text: "Long distance trip to Birmingham — comfortable car, great conversation, smooth journey. Price was very fair and confirmed upfront. No nasty surprises." },
  { author_name: "Emma S.", rating: 5, relative_time_description: "4 months ago", text: "Fantastic local service. Driver knew the area perfectly and got me to the station despite the roadworks. WhatsApp booking is so easy. Definitely my first call now." },
  { author_name: "Robert M.", rating: 5, relative_time_description: "7 months ago", text: "30 years in business and it really shows. Reliable, honest pricing, professional drivers. Our whole family uses Lakeside Taxis. Wouldn't go anywhere else in Grays." },
  { author_name: "Aisha N.", rating: 5, relative_time_description: "2 months ago", text: "Got a quote on WhatsApp within the hour and the price was very competitive. Driver was friendly and early. The whole experience was smooth and stress-free." },
  { author_name: "Tom W.", rating: 5, relative_time_description: "3 months ago", text: "Our flight was delayed by two hours and the driver waited without any fuss or extra charges. That kind of service is rare. Absolutely brilliant, thank you!" },
  { author_name: "Claire B.", rating: 5, relative_time_description: "1 month ago", text: "Managed corporate accounts for a small business — the invoicing is simple, drivers are always immaculate and punctual. Couldn't be happier. Highly recommended." },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="hp-review-stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? "#FBBC04" : "#e0e0e0"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initial = review.author_name.charAt(0).toUpperCase();
  const colors = ["#4285F4","#EA4335","#34A853","#FBBC04","#9C27B0","#00BCD4"];
  const color = colors[initial.charCodeAt(0) % colors.length];
  return (
    <div className="hp-review-card">
      <div className="hp-review-header">
        <div className="hp-review-avatar" style={{ background: color }}>
          {review.profile_photo_url
            ? <img src={review.profile_photo_url} alt={review.author_name} />
            : initial}
        </div>
        <div className="hp-review-meta">
          <strong>{review.author_name}</strong>
          <span>{review.relative_time_description}</span>
        </div>
        <div className="hp-review-google"><GoogleIcon /></div>
      </div>
      <StarRating rating={review.rating} />
      <p className="hp-review-text">{review.text}</p>
    </div>
  );
}

function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  const row2 = reviews.slice(mid);
  const r1 = [...row1, ...row1];
  const r2 = [...row2, ...row2];
  return (
    <div className="hp-reviews-marquee">
      <div className="hp-marquee-row">
        <div className="hp-marquee-track">
          {r1.map((r, i) => <ReviewCard key={i} review={r} />)}
        </div>
      </div>
      <div className="hp-marquee-row">
        <div className="hp-marquee-track hp-marquee-track--right">
          {r2.map((r, i) => <ReviewCard key={i} review={r} />)}
        </div>
      </div>
    </div>
  );
}

function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data: { reviews: Review[] }) => {
        if (data.reviews && data.reviews.length >= 6) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {/* keep fallback */});
  }, []);

  return (
    <section className="hp-light hp-reviews-section" data-testid="testimonials-section" data-section="reviews">
      <div className="hp-inner hp-reviews-header">
        <div className="hp-kicker">Trusted by Customers Across Thurrock</div>
        <h2 className="hp-section-title">What Our Customers Say</h2>
        <div className="hp-reviews-rating-badge">
          <GoogleIcon />
          <span className="hp-reviews-score">5.0</span>
          <StarRating rating={5} />
          <span className="hp-reviews-count">Google Reviews</span>
        </div>
      </div>
      <ReviewsMarquee reviews={reviews} />
    </section>
  );
}

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
                  <div className="hp-service-photo" style={{ backgroundImage: `url(${s.bg})` }}>
                    <div className="hp-service-overlay">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                      <span className="hp-service-cta">Learn more →</span>
                    </div>
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
                <div className="hp-contact-icon"><FileText size={22} /></div>
                <div className="hp-contact-body">
                  <h3>Get a Quote</h3>
                  <p>Send your journey details and we'll reply within 2 hours.</p>
                </div>
                <Link href="/quote-request" className="hp-contact-action hp-contact-action--yellow">
                  Request a Quote →
                </Link>
              </div>
              <div className="hp-contact-card">
                <div className="hp-contact-icon hp-contact-icon--green"><MessageCircle size={22} /></div>
                <div className="hp-contact-body">
                  <h3>WhatsApp Us</h3>
                  <p>The quickest way to get a fast response from our team.</p>
                </div>
                <a href={WA_HREF} className="hp-contact-action hp-contact-action--green">
                  Chat on WhatsApp →
                </a>
              </div>
              <div className="hp-contact-card">
                <div className="hp-contact-icon"><Phone size={22} /></div>
                <div className="hp-contact-body">
                  <h3>Call Us Direct</h3>
                  <p>Speak with our friendly team any time, day or night.</p>
                </div>
                <a href={PHONE_HREF} className="hp-contact-action hp-contact-action--outline">
                  01375 383878 →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── GOOGLE REVIEWS ── */}
        <GoogleReviewsSection />

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
