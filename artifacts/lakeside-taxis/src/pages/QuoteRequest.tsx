import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import { BUSINESS_URL } from "@/lib/schema";
import { useReveal } from "@/hooks/useReveal";
import {
  IconCheck,
  IconChevronRight,
  IconClock,
  IconPhone,
  IconPound,
  IconShield,
  IconWhatsApp,
} from "@/components/icons/Icons";
import "./quote-request.css";

const TEL = "tel:01375383878";
const TEL_DISPLAY = "01375 383878";
const WA = "https://wa.me/447879956275";

const reassurances = [
  {
    Icon: IconPound,
    title: "Fixed price",
    sub: "Agreed before you travel, never metered",
  },
  {
    Icon: IconPhone,
    title: "A person calls you back",
    sub: "Usually within the hour",
  },
  {
    Icon: IconShield,
    title: "No payment online",
    sub: "Nothing to pay to get a price",
  },
  {
    Icon: IconCheck,
    title: "No obligation",
    sub: "It's a quote, not a booking",
  },
];

const steps = [
  {
    n: "1",
    t: "We read your details",
    d: "A member of our team checks the route and driver availability for your time.",
  },
  {
    n: "2",
    t: "We send you a fixed price",
    d: "We call or message back with a price that won't change on the day.",
  },
  {
    n: "3",
    t: "You decide",
    d: "Happy with it? Confirm and the job is booked. If not, nothing happens.",
  },
  {
    n: "4",
    t: "We collect you",
    d: "Your driver arrives at the door at the agreed time, including at 4am.",
  },
];

export default function QuoteRequest() {
  const title = "Request a Quote | Lakeside & Purfleet Taxis Ltd";
  const metaDesc =
    "Send your journey details to Lakeside & Purfleet Taxis. We'll come back with a fixed price, usually within the hour. No payment online, no account, no obligation.";
  const canonicalUrl = `${BUSINESS_URL}/quote-request`;
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${BUSINESS_URL}/opengraph.jpg`} />
      </Helmet>

      <div className="qr" ref={scope}>
        {/* ── Hero ── */}
        <section className="qr-hero">
          <div className="ls-shell">
            <nav className="qr-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">Request a quote</span>
            </nav>

            <div className="qr-hero-badges ls-reveal">
              <span className="ls-pill ls-pill-on-ink">No payment required</span>
              <span className="ls-pill ls-pill-on-ink">No account needed</span>
            </div>

            <h1 className="qr-hero-title ls-reveal">
              Request a <span>quote</span>
            </h1>

            <p className="qr-hero-lede ls-reveal">
              Tell us the journey and we'll come back with a fixed price, usually
              within the hour. Every quote is worked out by a person here in
              Thurrock — not an app, and not a surge algorithm.
            </p>
          </div>
        </section>

        {/* ── Form + supporting detail ──
            The form is deliberately not reveal-animated: it is the task, and a
            task surface should be ready the moment it is on screen. */}
        <div className="qr-body">
          <div className="ls-shell">
            <div className="qr-layout">
              <div className="qr-form-card">
                <div className="qr-form-head">
                  <h2 className="qr-form-title">Your journey details</h2>
                  <p className="qr-form-sub">
                    Fill in as much as you can — the more we know, the faster we
                    can come back with a firm price.
                  </p>
                </div>
                <BookingForm />
              </div>

              <aside className="qr-aside">
                <div className="qr-aside-card">
                  <span className="qr-aside-label">What happens next</span>
                  <div className="qr-steps">
                    {steps.map(({ n, t, d }) => (
                      <div className="qr-step" key={n}>
                        <span className="qr-step-num" aria-hidden="true">
                          {n}
                        </span>
                        <div>
                          <p className="qr-step-title">{t}</p>
                          <p className="qr-step-desc">{d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="qr-aside-card">
                  <span className="qr-aside-label">Rather not fill in a form?</span>
                  <div className="qr-contacts">
                    <a href={TEL} className="ls-btn ls-btn-ink ls-btn-block">
                      <IconPhone size={17} />
                      {TEL_DISPLAY}
                    </a>
                    <a
                      href={WA}
                      className="ls-btn ls-btn-quiet ls-btn-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconWhatsApp size={17} />
                      WhatsApp us
                    </a>
                  </div>
                  <p className="qr-aside-note">
                    We answer the phone ourselves, 24 hours a day, every day of
                    the year.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ── Reassurance band ── */}
        <div className="qr-band">
          <div className="ls-shell">
            <div className="qr-band-grid ls-stagger">
              {reassurances.map(({ Icon, title: t, sub }) => (
                <div className="qr-band-item ls-reveal" key={t}>
                  <Icon size={21} className="qr-band-icon" />
                  <span className="qr-band-text">
                    <strong>{t}</strong>
                    <span>{sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Closing CTA ── */}
        <section className="qr-cta">
          <div className="ls-shell">
            <h2 className="qr-cta-title ls-reveal">Need it sorted right now?</h2>
            <p className="qr-cta-sub ls-reveal">
              If you're travelling in the next couple of hours, calling is
              quicker. A local firm serving Thurrock since 1990.
            </p>
            <div className="qr-cta-actions ls-reveal">
              <a href={TEL} className="ls-btn ls-btn-primary ls-btn-lg">
                <IconPhone size={18} />
                {TEL_DISPLAY}
              </a>
              <a
                href={WA}
                className="ls-btn ls-btn-on-ink ls-btn-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWhatsApp size={18} />
                WhatsApp
              </a>
            </div>
            <p className="qr-cta-note ls-reveal">
              <IconClock size={15} />
              Lines open 24 hours, every day of the year
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
