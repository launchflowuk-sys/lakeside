import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";

export default function QuoteRequest() {
  return (
    <Layout>
      <Helmet>
        <title>Request a Quote | Lakeside & Purfleet Taxis Ltd</title>
        <meta name="description" content="Send your journey details to Lakeside & Purfleet Taxis. Our team will confirm availability and pricing. No payment, no instant booking." />
      </Helmet>

      {/* ── Hero ── */}
      <section style={{
        background: "hsl(220 25% 6%)",
        padding: "72px 0 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(-45deg, transparent, transparent 56px, rgba(255,209,0,0.022) 56px, rgba(255,209,0,0.022) 57px)",
          pointerEvents: "none",
        }} />
        <div style={{ width: "min(1180px, calc(100% - 40px))", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span style={{
            fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", color: "#ffd100",
            display: "block", marginBottom: 12,
          }}>
            No payment required
          </span>
          <h1 style={{
            fontFamily: "'Barlow Condensed', Poppins, sans-serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.02em",
            color: "#ffffff", textTransform: "uppercase", margin: "0 0 16px",
          }}>
            Request a <span style={{ color: "#ffd100" }}>Quote</span>
          </h1>
          <p style={{
            fontFamily: "Poppins, sans-serif", fontSize: "1rem", lineHeight: 1.7,
            color: "rgba(255,255,255,0.55)", maxWidth: 520, margin: 0,
          }}>
            Send us your journey details. Our team will confirm availability and pricing directly — no payment, no instant booking, no automated systems.
          </p>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div style={{ background: "#ffd100" }}>
        <div style={{ width: "min(1180px, calc(100% - 40px))", margin: "0 auto", display: "flex" }}>
          {[
            { icon: "💷", title: "Fixed price", sub: "Confirmed before travel" },
            { icon: "📞", title: "We call you back", sub: "Usually within the hour" },
            { icon: "🚫", title: "No payment online", sub: "Pay on the day" },
            { icon: "✅", title: "No obligation", sub: "Just a quote request" },
          ].map((t) => (
            <div key={t.title} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 12,
              padding: "18px 20px", borderRight: "1px solid rgba(0,0,0,0.1)",
            }}>
              <span style={{ fontSize: "1.3rem" }}>{t.icon}</span>
              <div>
                <strong style={{ display: "block", fontFamily: "Poppins,sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#0a0a0a" }}>{t.title}</strong>
                <span style={{ fontFamily: "Poppins,sans-serif", fontSize: "0.68rem", color: "rgba(0,0,0,0.5)" }}>{t.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form ── */}
      <div style={{ background: "#0a0a0a", padding: "64px 0 80px" }}>
        <div style={{
          width: "min(1180px, calc(100% - 40px))", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start",
        }}>

          {/* Left: form */}
          <div style={{
            background: "#0f1623", border: "1px solid #1f2937",
            borderRadius: 12, padding: "32px 28px",
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.4rem",
              fontWeight: 900, color: "#ffffff", textTransform: "uppercase",
              letterSpacing: "-0.01em", marginBottom: 4,
            }}>
              Your journey details
            </div>
            <div style={{
              fontFamily: "Poppins, sans-serif", fontSize: "0.75rem",
              color: "rgba(255,255,255,0.38)", marginBottom: 24,
              paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              Fill in as much detail as you can — the more we know, the faster we can confirm your quote.
            </div>
            <BookingForm />
          </div>

          {/* Right: info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: 10, padding: "24px 22px",
            }}>
              <div style={{
                fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffd100", marginBottom: 8,
              }}>
                What happens next
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { n: "1", t: "We review your details", d: "Our team looks at your journey and checks driver availability." },
                  { n: "2", t: "We send you a fixed price", d: "We'll call or message you back with a confirmed price." },
                  { n: "3", t: "You confirm the booking", d: "Once you're happy with the price, your journey is set." },
                  { n: "4", t: "We collect you on the day", d: "Your driver arrives on time at your door." },
                ].map((s) => (
                  <div key={s.n} style={{ display: "flex", gap: 14 }}>
                    <span style={{
                      width: 28, height: 28, background: "#ffd100", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", fontWeight: 800,
                      color: "#0a0a0a", flexShrink: 0,
                    }}>{s.n}</span>
                    <div>
                      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.82rem", fontWeight: 700, color: "#ffffff", marginBottom: 3 }}>{s.t}</div>
                      <div style={{ fontFamily: "Poppins, sans-serif", fontSize: "0.73rem", lineHeight: 1.5, color: "rgba(255,255,255,0.38)" }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: 10, padding: "20px 22px",
            }}>
              <div style={{
                fontFamily: "Poppins, sans-serif", fontSize: "0.68rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffd100", marginBottom: 12,
              }}>
                Prefer to call?
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="tel:01375383878" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "rgba(255,209,0,0.1)", border: "1px solid rgba(255,209,0,0.2)",
                  borderRadius: 6, padding: "11px 16px", textDecoration: "none",
                  fontFamily: "Poppins, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#ffd100",
                }}>
                  📞 01375 383878
                </a>
                <a href="https://wa.me/447879956275" target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)",
                  borderRadius: 6, padding: "11px 16px", textDecoration: "none",
                  fontFamily: "Poppins, sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#25D366",
                }}>
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
