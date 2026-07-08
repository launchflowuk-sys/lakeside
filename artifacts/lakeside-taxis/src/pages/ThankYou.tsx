import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./thank-you.css";

export default function ThankYou() {
  return (
    <Layout>
      <Helmet>
        <title>Booking Request Received | Lakeside & Purfleet Taxis</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="ty-wrap">
        <div className="ty-grid" data-testid="thank-you-page">

          {/* Left */}
          <div>
            <div style={{
              width: 72, height: 72, background: "rgba(255,209,0,0.1)",
              border: "2px solid rgba(255,209,0,0.3)", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", marginBottom: 28,
            }}>
              ✓
            </div>
            <span style={{
              fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffd100",
              display: "block", marginBottom: 12,
            }}>
              Request received
            </span>
            <h1 style={{
              fontFamily: "'Barlow Condensed', Poppins, sans-serif",
              fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)",
              fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.02em",
              color: "#ffffff", textTransform: "uppercase", margin: "0 0 20px",
            }}>
              We've got your<br /><span style={{ color: "#ffd100" }}>request</span>
            </h1>
            <p style={{
              fontFamily: "Poppins, sans-serif", fontSize: "1rem", lineHeight: 1.75,
              color: "rgba(255,255,255,0.58)", maxWidth: 500, margin: "0 0 32px",
            }}>
              Thank you. Your booking request has been sent to Lakeside &amp; Purfleet Taxis. Our team will contact you shortly to confirm availability and give you a fixed price.
            </p>
            <p style={{
              fontFamily: "Poppins, sans-serif", fontSize: "0.8rem",
              color: "rgba(255,255,255,0.3)", marginBottom: 28,
            }}>
              Your booking is <strong style={{ color: "rgba(255,255,255,0.5)" }}>not confirmed</strong> until our team gets in touch with you.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="tel:01375383878" data-testid="thankyou-call-btn" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,209,0,0.1)", border: "1px solid rgba(255,209,0,0.25)",
                borderRadius: 4, padding: "12px 22px", textDecoration: "none",
                fontFamily: "Poppins, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#ffd100",
              }}>
                📞 01375 383878
              </a>
              <a href="https://wa.me/447879956275" target="_blank" rel="noopener noreferrer"
                data-testid="thankyou-whatsapp-btn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)",
                  borderRadius: 4, padding: "12px 22px", textDecoration: "none",
                  fontFamily: "Poppins, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#25D366",
                }}>
                💬 WhatsApp Us
              </a>
              <Link href="/" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 4, padding: "12px 22px", textDecoration: "none",
                fontFamily: "Poppins, sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.45)",
              }}>
                ← Back to home
              </Link>
            </div>
          </div>

          {/* Right: what happens next */}
          <div style={{
            background: "#0f1623", border: "1px solid #1f2937",
            borderRadius: 12, padding: "32px 28px",
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.2rem",
              fontWeight: 900, color: "#ffffff", textTransform: "uppercase",
              letterSpacing: "-0.01em", marginBottom: 24,
              paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              What happens next
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { n: "1", t: "Team reviews your details", d: "We look at your journey request and check driver availability for your date and time." },
                { n: "2", t: "We contact you with a price", d: "A member of our team will call or message you back with a confirmed fixed price." },
                { n: "3", t: "You confirm the booking", d: "Once you're happy with the quote, your booking is confirmed and your driver is assigned." },
                { n: "4", t: "We collect you on the day", d: "Your driver arrives at your door at the agreed time. Pay on the day — no upfront payment needed." },
              ].map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 16 }}>
                  <span style={{
                    width: 32, height: 32, background: "#ffd100", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", fontWeight: 800,
                    color: "#0a0a0a", flexShrink: 0, marginTop: 2,
                  }}>{s.n}</span>
                  <div>
                    <div style={{
                      fontFamily: "Poppins, sans-serif", fontSize: "0.85rem",
                      fontWeight: 700, color: "#ffffff", marginBottom: 4,
                    }}>{s.t}</div>
                    <div style={{
                      fontFamily: "Poppins, sans-serif", fontSize: "0.75rem",
                      lineHeight: 1.55, color: "rgba(255,255,255,0.38)",
                    }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)",
              fontFamily: "Poppins, sans-serif", fontSize: "0.75rem",
              color: "rgba(255,255,255,0.3)", lineHeight: 1.6,
            }}>
              Need an urgent response? Call us directly on <a href="tel:01375383878" style={{ color: "#ffd100", textDecoration: "none" }}>01375 383878</a> — we're available 24/7.
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
