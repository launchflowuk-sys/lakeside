import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconBackpack,
  IconBriefcase,
  IconCar,
  IconChevronRight,
  IconPhone,
  IconPin,
  IconPlane,
  IconShip,
  IconWhatsApp,
} from "@/components/icons/Icons";
import "./seo-pages.css";

const TEL = "tel:01375383878";
const TEL_DISPLAY = "01375 383878";
const WA = "https://wa.me/447879956275";

/**
 * 404.
 *
 * Someone who followed a dead link is usually still trying to book a taxi, so
 * this page's job is to put the phone number and the quote form one tap away —
 * not to apologise. It carries the site's own furniture (header, footer, mobile
 * bar) so the visitor is never stranded on a bare page.
 *
 * noindex because a client-rendered SPA answers every unknown url with a 200;
 * without it Google would happily index every typo as a real page.
 */

const POPULAR = [
  { href: "/local-taxis", label: "Local taxis", Icon: IconCar },
  { href: "/airport-transfers", label: "Airport transfers", Icon: IconPlane },
  { href: "/tilbury-cruise-terminal", label: "Cruise terminal", Icon: IconShip },
  { href: "/school-runs", label: "School runs", Icon: IconBackpack },
  { href: "/corporate-accounts", label: "Corporate accounts", Icon: IconBriefcase },
  { href: "/areas-covered", label: "Areas we cover", Icon: IconPin },
];

export default function NotFound() {
  const scope = useReveal<HTMLDivElement>();

  return (
    <Layout>
      <Helmet>
        <title>Page not found | Lakeside &amp; Purfleet Taxis Ltd</title>
        <meta
          name="description"
          content="That page could not be found. Call 01375 383878 or request a quote for taxis across Thurrock and Essex."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="sp sp-short" ref={scope}>
        <section className="sp-hero">
          <div className="ls-shell">
            <nav className="sp-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">Page not found</span>
            </nav>

            <div className="sp-hero-badges ls-reveal">
              <span className="ls-pill ls-pill-on-ink">Error 404</span>
            </div>

            <h1 className="sp-hero-title ls-reveal">
              That page <span>isn't here</span>
            </h1>

            <p className="sp-hero-lede ls-reveal">
              The link may be out of date, or the address slightly off. Nothing is
              wrong with your booking — and if you were about to arrange a journey,
              the quickest route is still a phone call.
            </p>

            <div className="sp-hero-actions ls-reveal">
              <Link href="/quote-request" className="ls-btn ls-btn-primary ls-btn-lg">
                Get a quote
                <IconArrowRight size={18} />
              </Link>
              <a
                href={WA}
                className="ls-btn ls-btn-whatsapp ls-btn-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWhatsApp size={18} />
                WhatsApp
              </a>
              <a href={TEL} className="ls-btn ls-btn-on-ink ls-btn-lg">
                <IconPhone size={18} />
                {TEL_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        <div className="sp-body">
          <div className="ls-shell">
            <h2 className="ls-h2 ls-reveal">Try one of these instead</h2>
            <div className="sp-nearby ls-reveal" style={{ marginTop: "var(--ls-gap)" }}>
              <div className="sp-nearby-links">
                {POPULAR.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className="sp-nearby-link">
                    <Icon size={15} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="sp-cta">
          <div className="ls-shell">
            <h2 className="sp-cta-title ls-reveal">Still need a taxi?</h2>
            <p className="sp-cta-sub ls-reveal">
              Fixed prices agreed before you travel, 24 hours a day across Thurrock
              and Essex.
            </p>
            <div className="sp-cta-actions ls-reveal">
              <Link href="/" className="ls-btn ls-btn-primary ls-btn-lg">
                Back to the homepage
                <IconArrowRight size={18} />
              </Link>
              <a href={TEL} className="ls-btn ls-btn-on-ink ls-btn-lg">
                <IconPhone size={18} />
                {TEL_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
