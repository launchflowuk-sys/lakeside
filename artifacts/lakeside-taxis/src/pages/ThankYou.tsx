import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import "./thank-you.css";

const steps = [
  { n: "1", t: "Team reviews your details", d: "We look at your journey request and check driver availability for your date and time." },
  { n: "2", t: "We contact you with a price", d: "A member of our team will call or message you back with a confirmed fixed price." },
  { n: "3", t: "You confirm the booking", d: "Once you're happy with the quote, your booking is confirmed and your driver is assigned." },
  { n: "4", t: "We collect you on the day", d: "Your driver arrives at your door at the agreed time. Pay on the day — no upfront payment needed." },
];

export default function ThankYou() {
  return (
    <Layout>
      <Helmet>
        <title>Booking Request Received | Lakeside & Purfleet Taxis</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="ty-wrap">
        <div className="ty-inner" data-testid="thank-you-page">

          <div className="ty-card">
            <div className="ty-icon">
              <CheckCircle2 size={32} strokeWidth={2} />
            </div>
            <span className="ty-eyebrow">Request received</span>
            <h1 className="ty-title">
              We&apos;ve got your <span>request</span>
            </h1>
            <p className="ty-body">
              Thank you. Your booking request has been sent to Lakeside &amp; Purfleet Taxis. Our team will contact you shortly to confirm availability and give you a fixed price.
            </p>
            <div className="ty-notice">
              Your booking is <strong>not confirmed</strong> until our team gets in touch with you.
            </div>
            <div className="ty-actions">
              <a href="tel:01375383878" data-testid="thankyou-call-btn" className="ty-btn ty-btn-primary">
                <Phone size={16} /> 01375 383878
              </a>
              <a
                href="https://wa.me/447879956275"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="thankyou-whatsapp-btn"
                className="ty-btn ty-btn-green"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
              <Link href="/" className="ty-btn ty-btn-outline">
                <ArrowLeft size={16} /> Back to home
              </Link>
            </div>
          </div>

          <div className="ty-next">
            <div className="ty-next-title">What happens next</div>
            <div className="ty-steps">
              {steps.map((s) => (
                <div className="ty-step" key={s.n}>
                  <span className="ty-step-num">{s.n}</span>
                  <div>
                    <div className="ty-step-title">{s.t}</div>
                    <div className="ty-step-desc">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ty-next-footer">
              Need an urgent response? Call us directly on <a href="tel:01375383878">01375 383878</a> — we&apos;re available 24/7.
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
