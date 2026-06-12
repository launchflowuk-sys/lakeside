import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import "./about.css";

const TEL = "tel:01375383878";
const WA = "https://wa.me/447879956275";

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>About Us | Lakeside & Purfleet Taxis Ltd | Thurrock Since 1990</title>
        <meta name="description" content="Thurrock's trusted local taxi company since 1990. A family-run business based in Grays and Purfleet, serving the whole of Thurrock, Essex." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-inner">
          <span className="ab-hero-badge">Est. 1990 · Thurrock, Essex</span>
          <h1>
            About<br /><span>Lakeside &amp; Purfleet Taxis</span>
          </h1>
          <p className="ab-hero-desc">
            Thurrock's trusted local taxi company for over 30 years. Family run, locally based, and built on doing the job right.
          </p>
        </div>
      </section>

      {/* ── Trust numbers strip ── */}
      <div className="ab-trust">
        <div className="ab-trust-inner">
          {[
            { num: "30+", label: "Years serving Thurrock", sub: "Trading since 1990" },
            { num: "9", label: "Areas covered", sub: "Across Thurrock & Essex" },
            { num: "6", label: "Airports served", sub: "Heathrow to Southend" },
            { num: "24/7", label: "Always available", sub: "365 days a year" },
          ].map((item) => (
            <div className="ab-trust-item" key={item.label}>
              <div className="ab-trust-num">{item.num}</div>
              <div className="ab-trust-label">
                <strong>{item.label}</strong>
                <span>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="ab-body">
        <div className="ab-inner">

          {/* Story */}
          <div className="ab-story">
            <div>
              <span className="ab-kicker">Our story</span>
              <h2 className="ab-h2">A proper local taxi company — not a platform</h2>
              <div className="ab-prose">
                <p>
                  Lakeside &amp; Purfleet Taxis Ltd has been serving the people of Thurrock since 1990. What started as a small local operation has grown into one of the most trusted taxi services in Essex — built on reliability, local knowledge and straightforward service.
                </p>
                <p>
                  We are a family-run business. We know Thurrock, Grays, Purfleet, Lakeside and the surrounding communities because we live here too. Our drivers aren't just drivers — they're local people who take pride in their work and in their community.
                </p>
                <p>
                  We don't do apps or online payments. We believe in direct communication — a real person you can call, WhatsApp or email. When you book with us, you're dealing with us directly, not a faceless platform.
                </p>
                <p>
                  Over three decades, thousands of Thurrock families have trusted us with their airport runs, school routes, hospital appointments and everyday journeys. That trust is something we take seriously every single day.
                </p>
              </div>
            </div>
            <div className="ab-stats">
              {[
                {
                  icon: "🏠",
                  value: "Family",
                  label: "Family-run business",
                  sub: "Owner-operated since 1990, no third-party platforms",
                },
                {
                  icon: "🗺️",
                  value: "Local",
                  label: "Thurrock-based drivers",
                  sub: "Our drivers live here — they know every road and shortcut",
                },
                {
                  icon: "💷",
                  value: "Fixed",
                  label: "Fixed price every time",
                  sub: "Your fare is agreed before the journey — no meter surprises",
                },
              ].map((s) => (
                <div className="ab-stat-card" key={s.label}>
                  <div className="ab-stat-icon">{s.icon}</div>
                  <div className="ab-stat-value">{s.value}</div>
                  <div className="ab-stat-label">{s.label}</div>
                  <div className="ab-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-divider" />

          {/* Values */}
          <span className="ab-kicker">What we stand for</span>
          <h2 className="ab-h2">Five things we never compromise on</h2>
          <div className="ab-values-grid">
            {[
              {
                icon: "⏱️",
                title: "Reliability",
                desc: "We are there when we say we will be. Every time. If something changes, we call you — not the other way round.",
              },
              {
                icon: "💷",
                title: "Transparency",
                desc: "You always know what you'll pay before you travel. No meters, no surge pricing, no hidden extras at drop-off.",
              },
              {
                icon: "🗺️",
                title: "Local knowledge",
                desc: "We know these roads, not just the sat-nav route. Thurrock shortcuts, school run timing, traffic hotspots — all of it.",
              },
              {
                icon: "📞",
                title: "Direct service",
                desc: "You deal with us, not a third party. Call, WhatsApp or email — a real person picks up, every time.",
              },
              {
                icon: "🤝",
                title: "Community",
                desc: "We've been part of Thurrock for over 30 years. We sponsor local events, support local schools and care about this place.",
              },
              {
                icon: "🚗",
                title: "Quality vehicles",
                desc: "Clean, comfortable, well-maintained cars. We take pride in the standard of our fleet — it reflects on us.",
              },
            ].map((v) => (
              <div className="ab-value-card" key={v.title}>
                <div className="ab-value-icon">{v.icon}</div>
                <div className="ab-value-title">{v.title}</div>
                <div className="ab-value-desc">{v.desc}</div>
              </div>
            ))}
          </div>

          <div className="ab-team-note">
            <p>
              <strong>Want to work with us?</strong> We occasionally take on new local drivers who share our standards. If you're based in Thurrock and want to discuss joining the team, give us a call on <strong>01375 383878</strong> or send us a message on <strong>WhatsApp: 07879 956275</strong>.
            </p>
          </div>

        </div>
      </div>

      {/* ── CTA ── */}
      <section className="ab-cta">
        <div className="ab-inner">
          <h2>Ready to book with us?</h2>
          <p>Local, reliable, fixed price. Available 24/7 across Thurrock and Essex.</p>
          <div className="ab-cta-actions">
            <Link href="/quote-request" className="ab-cta-btn-dark">
              Request a Quote →
            </Link>
            <a href={TEL} className="ab-cta-btn-outline">
              📞 01375 383878
            </a>
            <a href={WA} className="ab-cta-btn-outline" target="_blank" rel="noopener noreferrer">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
