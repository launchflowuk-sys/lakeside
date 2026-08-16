import type { ReactNode } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { IconMessage } from "@/components/icons/Icons";
import "./legal.css";

export interface LegalSection {
  /** Anchor target; also what the "On this page" nav links to. */
  id: string;
  heading: string;
  content: ReactNode;
}

interface RelatedLink {
  href: string;
  label: string;
}

interface LegalPageProps {
  title: string;
  metaDescription: string;
  canonicalPath: string;
  /**
   * A frozen date string, e.g. "16 August 2026" — never a computed value.
   * These pages previously derived this from `new Date()` at render time, so
   * they claimed to have been revised today on every single day, which makes
   * the revision date meaningless as a record of when the terms last changed.
   */
  updated: string;
  intro?: ReactNode;
  sections: LegalSection[];
  related: RelatedLink[];
}

export default function LegalPage({
  title,
  metaDescription,
  canonicalPath,
  updated,
  intro,
  sections,
  related,
}: LegalPageProps) {
  // Built as one string: react-helmet-async only renders <title> when it has a
  // single text child, so interpolating alongside literal text silently yields
  // an empty document title.
  const documentTitle = `${title} | Lakeside & Purfleet Taxis Ltd`;

  return (
    <Layout>
      <Helmet>
        <title>{documentTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`https://lakesidetaxi.co.uk${canonicalPath}`} />
      </Helmet>

      <section className="lg-hero">
        <div className="lg-inner">
          <nav className="lg-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{title}</span>
          </nav>
          <span className="lg-hero-tag">Legal</span>
          <h1>{title}</h1>
          <p className="lg-hero-meta">
            <strong>Lakeside &amp; Purfleet Taxis Ltd</strong> &middot; Last updated: {updated}
          </p>
        </div>
      </section>

      <div className="lg-body">
        <div className="lg-inner">
          <div className="lg-doc">
            <div className="lg-content">
              {intro && <div className="lg-intro">{intro}</div>}

              {sections.map((section, index) => (
                <div className="lg-section" id={section.id} key={section.id}>
                  <span className="lg-section-num">Section {index + 1}</span>
                  <h2>{section.heading}</h2>
                  {section.content}
                </div>
              ))}

              <div className="lg-contact-note">
                <span className="lg-contact-note-icon">
                  <IconMessage size={18} />
                </span>
                <div className="lg-contact-note-text">
                  <strong>Our other legal documents</strong>
                  <p>
                    {related.map((link, i) => (
                      <span key={link.href}>
                        {i > 0 && (i === related.length - 1 ? " and " : ", ")}
                        <Link href={link.href}>{link.label}</Link>
                      </span>
                    ))}
                    .
                  </p>
                </div>
              </div>
            </div>

            <aside className="lg-sidenav">
              <span className="lg-sidenav-title">On this page</span>
              <nav className="lg-sidenav-links">
                {sections.map((section) => (
                  <a key={section.id} className="lg-sidenav-link" href={`#${section.id}`}>
                    {section.heading}
                  </a>
                ))}
              </nav>
              <div className="lg-sidenav-divider" />
              <span className="lg-sidenav-title">Other legal pages</span>
              <div className="lg-sidenav-other">
                {related.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
