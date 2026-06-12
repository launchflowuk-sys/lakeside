import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import "./quote-request.css";

const trustItems = [
  { icon: "💷", title: "Fixed price", sub: "Confirmed before travel" },
  { icon: "📞", title: "We call you back", sub: "Usually within the hour" },
  { icon: "🚫", title: "No payment online", sub: "Pay on the day" },
  { icon: "✅", title: "No obligation", sub: "Just a quote request" },
];

const steps = [
  { n: "1", t: "We review your details", d: "Our team looks at your journey and checks driver availability." },
  { n: "2", t: "We send you a fixed price", d: "We'll call or message you back with a confirmed price." },
  { n: "3", t: "You confirm the booking", d: "Once you're happy with the price, your journey is set." },
  { n: "4", t: "We collect you on the day", d: "Your driver arrives on time at your door." },
];

export default function QuoteRequest() {
  return (
    <Layout>
      <Helmet>
        <title>Request a Quote | Lakeside &amp; Purfleet Taxis Ltd</title>
        <meta name="description" content="Send your journey details to Lakeside & Purfleet Taxis. Our team will confirm availability and pricing. No payment, no instant booking." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="qr-hero">
        <div className="qr-inner">
          <span className="qr-eyebrow">No payment required</span>
          <h1 className="qr-h1">Request a <span>Quote</span></h1>
          <p className="qr-hero-sub">
            Send us your journey details. Our team will confirm availability and pricing directly — no payment, no instant booking, no automated systems.
          </p>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="qr-trust">
        <div className="qr-trust-inner">
          {trustItems.map((t) => (
            <div key={t.title} className="qr-trust-item">
              <span className="qr-trust-icon">{t.icon}</span>
              <div>
                <strong className="qr-trust-title">{t.title}</strong>
                <span className="qr-trust-sub">{t.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form + Sidebar ── */}
      <div className="qr-body">
        <div className="qr-body-inner">

          {/* Form */}
          <div className="qr-form-card">
            <div className="qr-form-title">Your journey details</div>
            <p className="qr-form-sub">Fill in as much detail as you can — the more we know, the faster we can confirm your quote.</p>
            <BookingForm />
          </div>

          {/* Sidebar */}
          <div className="qr-sidebar">
            <div className="qr-sidebar-card">
              <span className="qr-sidebar-label">What happens next</span>
              <div className="qr-steps">
                {steps.map((s) => (
                  <div key={s.n} className="qr-step">
                    <span className="qr-step-num">{s.n}</span>
                    <div>
                      <p className="qr-step-title">{s.t}</p>
                      <p className="qr-step-desc">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="qr-sidebar-card">
              <span className="qr-sidebar-label">Prefer to call?</span>
              <div className="qr-contact-btns">
                <a href="tel:01375383878" className="qr-contact-btn qr-contact-btn-phone">
                  📞 01375 383878
                </a>
                <a href="https://wa.me/447879956275" target="_blank" rel="noopener noreferrer" className="qr-contact-btn qr-contact-btn-whatsapp">
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
