import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useState, useEffect, useRef } from "react";
import {
  IconArrowRight,
  IconCar,
  IconCheck,
  IconClock,
  IconMessage,
  IconPhone,
  IconPin,
  IconPound,
  IconShield,
  IconUsers,
  IconWhatsApp,
} from "@/components/icons/Icons";
import BookingForm from "@/components/BookingForm";
import Layout from "@/components/layout/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { buildLocalBusinessSchema } from "@/lib/schema";
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

/**
 * Reviews come live from Google via /api/reviews. There is deliberately NO
 * fallback content: if the API returns nothing, this section does not render
 * at all. Previously ten invented reviews and a hardcoded 5.0 rating shipped
 * as the default state — fabricated consumer reviews are a banned practice
 * under the DMCC Act 2024, and fabricated AggregateRating markup is a Google
 * manual-action risk. Both are gone. Never reintroduce a static fallback here.
 */
function GoogleReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aggregate, setAggregate] = useState<{ rating: number; count: number } | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data: { reviews?: Review[]; rating?: number; userRatingsTotal?: number }) => {
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          // Feature 4- and 5-star reviews only. Each one shown is a real,
          // unedited Google review — we're choosing which genuine reviews to
          // feature, not writing them. Never relax this into inventing any.
          setReviews(data.reviews.filter((r) => r.rating >= 4));
        }
        // The aggregate stays exactly as Google reports it, across ALL
        // reviews including the ones not featured above. Recomputing it from
        // the filtered set would be a fabricated rating.
        if (data.rating && data.userRatingsTotal) {
          setAggregate({ rating: data.rating, count: data.userRatingsTotal });
        }
      })
      .catch(() => {/* no reviews, no section */});
  }, []);

  // Nothing real to show — render nothing rather than inventing proof.
  // The gate lives here, in the parent, so ReviewsContent MOUNTS FRESH once
  // data arrives. Returning null from inside the section would leave its
  // scroll-reveal ref unattached on first render, and the observer would
  // never run — stranding the heading at opacity 0.
  if (reviews.length === 0) return null;

  return <ReviewsContent reviews={reviews} aggregate={aggregate} />;
}

function ReviewsContent({
  reviews,
  aggregate,
}: {
  reviews: Review[];
  aggregate: { rating: number; count: number } | null;
}) {
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section className="hp-light hp-reviews-section" data-testid="testimonials-section" data-section="reviews">
      {aggregate && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            ...buildLocalBusinessSchema({
              path: "/",
              aggregateRating: { ratingValue: aggregate.rating, reviewCount: aggregate.count },
            }),
          })}</script>
        </Helmet>
      )}
      <div ref={headerRef} className="hp-inner hp-reviews-header hp-reveal">
        <h2 className="hp-section-title">What our customers say</h2>
        {aggregate && (
          <div className="hp-reviews-rating-badge">
            <GoogleIcon />
            <span className="hp-reviews-score">{aggregate.rating.toFixed(1)}</span>
            <StarRating rating={Math.round(aggregate.rating)} />
            <span className="hp-reviews-count">
              {aggregate.count === 1 ? "1 Google review" : `${aggregate.count} Google reviews`}
            </span>
          </div>
        )}
      </div>
      <ReviewsMarquee reviews={reviews} />
    </section>
  );
}

const WHY_FEATURES = [
  "Over 30 years of trusted local service",
  "Fully licensed, insured and compliant",
  "Professional drivers and clean vehicles",
  "Local taxis, airport transfers and business travel",
  "Price confirmed before you travel",
  "We reply to quote requests within 2 hours",
];

// Every value here must be independently verifiable. A hardcoded "5★ Google
// Rating" previously sat in this list — the business has no aggregate rating
// and three reviews in total, so it was fabricated social proof of exactly the
// kind the owner ordered removed on 14 Aug 2026. Ratings only ever come from
// the live Google API, never from a constant.
const WHY_STATS = [
  { value: "30+", label: "Years Serving Thurrock" },
  { value: "24/7", label: "Day & Night Service" },
  { value: "6", label: "Airport Routes" },
  { value: "9", label: "Thurrock Towns Covered" },
];

function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hp-why--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hp-dark hp-why-section"
      data-testid="why-section"
      data-section="why-choose-us"
    >
      {/* background glow */}
      <div className="hp-why-glow" aria-hidden="true" />

      <div className="hp-inner">
        {/* Header */}
        <div className="hp-why-hd">
          <div className="hp-kicker">Local People. Local Service.</div>
          <h2 className="hp-why-title">
            Why Thurrock <span>Chooses Us</span>
          </h2>
        </div>

        {/* Stats row */}
        <div className="hp-why-stats">
          {WHY_STATS.map((s, i) => (
            <div key={s.label} className="hp-why-stat" style={{ "--i": i } as React.CSSProperties}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Body: features + CTA cards */}
        <div className="hp-why-body">
          {/* Feature list */}
          <ul className="hp-why-features">
            {WHY_FEATURES.map((f, i) => (
              <li key={f} style={{ "--i": i } as React.CSSProperties}>
                <span className="hp-why-check" aria-hidden="true"><IconCheck size={15} /></span>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA cards */}
          <div className="hp-why-cards">
            <div className="hp-why-card hp-why-card--yellow" style={{ "--i": 0 } as React.CSSProperties}>
              <div className="hp-why-card-accent" />
              <div className="hp-why-card-icon hp-why-card-icon--yellow"><IconPound size={24} /></div>
              <h3>Get a quote</h3>
              <p>Send your journey details and we'll reply within 2 hours.</p>
              <Link href="/quote-request" className="hp-why-card-btn hp-why-card-btn--yellow">
                Request a quote
                <IconArrowRight size={17} />
              </Link>
            </div>
            <div className="hp-why-card hp-why-card--green" style={{ "--i": 1 } as React.CSSProperties}>
              <div className="hp-why-card-accent" />
              <div className="hp-why-card-icon hp-why-card-icon--green"><IconMessage size={24} /></div>
              <h3>WhatsApp us</h3>
              <p>The quickest way to get a fast response from our team.</p>
              <a href={WA_HREF} className="hp-why-card-btn hp-why-card-btn--green" target="_blank" rel="noopener noreferrer">
                WhatsApp us
                <IconArrowRight size={17} />
              </a>
            </div>
            <div className="hp-why-card hp-why-card--phone" style={{ "--i": 2 } as React.CSSProperties}>
              <div className="hp-why-card-accent" />
              <div className="hp-why-card-icon"><IconPhone size={24} /></div>
              <h3>Call us direct</h3>
              <p>Speak with our friendly team any time, day or night.</p>
              <a href={PHONE_HREF} className="hp-why-card-btn hp-why-card-btn--outline">
                01375 383878
                <IconArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const airports = [
  { name: "Heathrow", code: "LHR", price: "£105", href: "/airport-transfers/heathrow" },
  { name: "Gatwick", code: "LGW", price: "£80", href: "/airport-transfers/gatwick" },
  { name: "Stansted", code: "STN", price: "£70", href: "/airport-transfers/stansted" },
  { name: "Luton", code: "LTN", price: "£100", href: "/airport-transfers/luton" },
  { name: "London City", code: "LCY", price: "£55", href: "/airport-transfers/london-city" },
  { name: "Southend", code: "SEN", price: "£50", href: "/airport-transfers/southend" },
];

export default function Home() {
  const servicesHeaderRef = useScrollReveal<HTMLDivElement>();
  const servicesGridRef = useScrollReveal<HTMLDivElement>();
  const airportContentRef = useScrollReveal<HTMLDivElement>();

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
        <section
          className="hp-hero"
          data-testid="hero-section"
          data-section="hero"
          style={{ "--hp-hero-photo": "url('/images/hero-bg.webp')" } as React.CSSProperties}
        >
          <div className="hp-inner hp-hero-grid">
            {/* Left: the claim. Right: the form. Two columns rather than one
                stack, so the form sits beside the headline instead of being
                pushed a screen and a half down the page. */}
            <div className="hp-hero-copy-col">
              {/* Factual badge only. A "#1 rated" or starred badge here would be
                  an invented ranking on a firm with no aggregate rating. */}
              <div className="hp-eyebrow"><IconCar size={15} /> Local private hire since 1990</div>
              <h1 className="hp-hero-title">
                <span className="hp-hero-title-l1">
                  Thurrock's <span className="hp-hero-title-accent">most trusted</span>
                </span>
                <span className="hp-hero-title-l2">taxi service</span>
              </h1>
              {/* Carries the terms people actually search — the towns by name,
                  the six airports, and the services — in plain sentences
                  rather than a keyword list. Every claim here is verifiable:
                  the towns are the nine area pages, the airports are the six
                  transfer pages, and the 1990 date is the owner's. */}
              <p className="hp-hero-copy">
                Fast, reliable local taxis across Grays, Purfleet, Lakeside,
                Chafford Hundred, Tilbury and West Thurrock. Fixed-price airport
                transfers to Heathrow, Gatwick, Stansted, Luton, London City and
                Southend, plus school runs, Tilbury cruise terminal transfers and
                corporate accounts. Every fare is agreed with a person before you
                travel — a Thurrock private hire firm trading since 1990, on the
                road 24 hours a day, every day of the year.
              </p>

              <ul className="hp-hero-points">
                {[
                  "Reply within 2 hours with a clear, fixed price",
                  "No upfront payment and no booking fee",
                  "Serving Thurrock and surrounding areas since 1990",
                ].map((p) => (
                  <li key={p}>
                    <span className="hp-hero-tick" aria-hidden="true"><IconCheck size={13} /></span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="hp-hero-actions">
                <a href={PHONE_HREF} className="hp-hero-btn hp-hero-btn-primary">
                  <IconPhone size={18} />
                  01375 383878
                </a>
                <a
                  href={WA_HREF}
                  className="hp-hero-btn hp-hero-btn-whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconWhatsApp size={18} />
                  WhatsApp us
                </a>
              </div>

              <span className="hp-coverage-label">Serving local areas</span>
              <div className="hp-coverage">
                {["Grays", "Purfleet", "Tilbury", "Aveley", "West Thurrock"].map((area) => (
                  <span key={area}><IconPin size={12} /> {area}</span>
                ))}
              </div>

              {/* Carries the accent into the left column so the yellow isn't
                  stranded in the headline and the CTA button. */}
              <div className="hp-hero-strip">
                {[
                  { Icon: IconClock, label: "24/7", sub: "Every day of the year" },
                  { Icon: IconPound, label: "Fixed price", sub: "Agreed before you travel" },
                  { Icon: IconShield, label: "Licensed", sub: "Private hire, fully insured" },
                ].map(({ Icon, label, sub }) => (
                  <div className="hp-hero-strip-item" key={label}>
                    <span className="hp-hero-strip-icon"><Icon size={17} /></span>
                    <span className="hp-hero-strip-text">
                      <strong>{label}</strong>
                      <span>{sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hp-hero-form-col">
              <div className="hp-hero-form-card" data-testid="hero-form">
                <h2>Get your taxi quote</h2>
                <p>Reply within 2 hours. No payment required. No obligation.</p>
                <BookingForm compact />
              </div>
              <p className="hp-hero-form-note">
                No payment · No obligation · Trusted local service since 1990
              </p>
            </div>
          </div>

          {/* Trust strip */}
          <div className="hp-trust-strip">
            <div className="hp-inner hp-trust-grid">
              {[
                { icon: IconClock, strong: "Quick response", sub: "We'll reply within 2 hours" },
                { icon: IconShield, strong: "No obligation", sub: "Request a quote, no pressure" },
                { icon: IconUsers, strong: "Local experts", sub: "30+ years serving Thurrock" },
                { icon: null, strong: "24/7 service", sub: "Available when you need us" },
              ].map((item) => (
                <div className="hp-trust-item" key={item.strong}>
                  <div className="hp-trust-icon">
                    {item.icon ? <item.icon size={20} /> : <span className="hp-trust-247">24/7</span>}
                  </div>
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
            <div ref={servicesHeaderRef} className="hp-reveal">
              <div className="hp-kicker">Every Journey, Covered</div>
              <h2 className="hp-section-title">Our Services</h2>
            </div>
            <div ref={servicesGridRef} className="hp-services-grid hp-reveal">
              {services.map((s) => (
                <Link key={s.href} href={s.href} className="hp-service-card" data-testid={`service-card-${s.href.split("/").pop()}`}>
                  {/* A real <img> rather than a CSS background so it can be
                      lazy-loaded — as backgrounds these five tiles pulled
                      ~260kB on first paint for content below the fold. */}
                  <div className="hp-service-photo">
                    <img
                      src={s.bg}
                      alt=""
                      className="hp-service-img"
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={400}
                    />
                    <div className="hp-service-overlay">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                      <span className="hp-service-cta">Learn more <IconArrowRight size={16} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="hp-center-cta">
              <Link href="/quote-request" className="hp-btn hp-btn-primary" data-testid="services-cta-btn">
                Request a quote for any journey
                <IconArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <WhySection />

        {/* ── GOOGLE REVIEWS ── */}
        <GoogleReviewsSection />

        {/* ── AIRPORT TRANSFERS ── */}
        <section className="hp-dark" data-testid="airports-section" data-section="airport-transfers">
          <div className="hp-inner">
            <div className="hp-airport-layout">
              <div className="hp-airport-image-col">
                <img
                  src="/images/airport-tile-sm.webp"
                  alt="Airport Transfers from Thurrock — Lakeside Taxis"
                  className="hp-airport-tile-img"
                  width={900}
                  height={1034}
                  loading="lazy"
                />
              </div>
              <div ref={airportContentRef} className="hp-airport-content-col hp-reveal">
                <div className="hp-kicker">Fixed Prices From Thurrock</div>
                <h2 className="hp-airport-title">Airport Transfers <span>From Thurrock</span></h2>
                <p className="hp-airport-sub">Fixed prices confirmed before travel. Flight tracking on return pickups. 24/7 service.</p>
                <div className="hp-airport-cards">
                  {airports.map((a) => (
                    <Link key={a.href} href={a.href} className="hp-airport-card" data-testid={`airport-pill-${a.code.toLowerCase()}`}>
                      <div className="hp-airport-card-top">
                        <span className="hp-airport-card-name">{a.name}</span>
                        <span className="hp-airport-card-code">{a.code}</span>
                      </div>
                      <div className="hp-airport-card-price">{a.price}</div>
                      <div className="hp-airport-card-label">fixed price</div>
                    </Link>
                  ))}
                </div>
                <Link href="/airport-transfers" className="hp-btn hp-btn-primary hp-airport-all-btn" data-testid="airports-cta-btn">
                  View all airports &amp; prices
                  <IconArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Final CTA */}
            <div className="hp-final-cta" data-section="final-cta">
              <div>
                <h2>Need a Taxi in Thurrock?</h2>
                <p>Fast response. Friendly service. Always here for you.</p>
              </div>
              <div className="hp-final-actions">
                <Link href="/quote-request" className="hp-btn hp-btn-primary">
                  Request a quote
                  <IconArrowRight size={18} />
                </Link>
                <a href={PHONE_HREF} className="hp-btn hp-btn-outline">
                  <IconPhone size={18} />
                  01375 383878
                </a>
                <a href={WA_HREF} className="hp-btn hp-btn-outline" target="_blank" rel="noopener noreferrer">
                  <IconMessage size={18} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
