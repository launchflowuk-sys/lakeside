import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import PostCard from "./PostCard";
import { POSTS_BY_DATE } from "./posts";
import { useLaunchosPosts } from "./launchos";
import { LaunchosCard } from "./LaunchosPost";
import { buildBlogIndexSchema, BUSINESS_URL } from "@/lib/schema";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconChevronRight,
  IconClock,
  IconPhone,
  IconPin,
  IconWhatsApp,
} from "@/components/icons/Icons";
import "../blog.css";

const TEL = "tel:01375383878";
const TEL_DISPLAY = "01375 383878";
const WA = "https://wa.me/447879956275";

const TITLE = "Travel Advice & Local Guides | Lakeside & Purfleet Taxis Ltd";
const META_DESC =
  "Practical travel advice from a Thurrock taxi firm — airport transfer timing, Tilbury cruise terminal transfers, school runs and getting around Essex. Written by the people who drive the routes.";

export default function BlogIndex() {
  const scope = useReveal<HTMLDivElement>();
  const canonicalUrl = `${BUSINESS_URL}/blog`;
  const { data: remote = [] } = useLaunchosPosts();
  // Hand-written guides and LaunchOS posts, newest first after the lead. A
  // hand-written guide keeps its slug if LaunchOS ever publishes the same one.
  // The lead stays the newest hand-written guide: LaunchOS posts arrive after
  // the reveal observer has run, and promoting one would re-render the old
  // lead's className and drop its "is-revealed" state, hiding it.
  const taken = new Set(POSTS_BY_DATE.map((p) => p.slug));
  const local = POSTS_BY_DATE.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, published: p.published, local: p, remote: null }));
  const fromLaunchos = remote
    .filter((p) => !taken.has(p.slug))
    .map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, published: p.published, local: null, remote: p }));
  const [lead, ...rest] = [
    ...local.slice(0, 1),
    ...[...local.slice(1), ...fromLaunchos].sort((a, b) => b.published.localeCompare(a.published)),
  ];
  const all = lead ? [lead, ...rest] : rest;
  const card = (entry: (typeof all)[number], isLead = false) =>
    entry.local
      ? <PostCard key={entry.slug} post={entry.local} lead={isLead} />
      : entry.remote && <LaunchosCard key={entry.slug} post={entry.remote} lead={isLead} />;

  const schema = buildBlogIndexSchema({
    posts: all.map(({ slug, title, excerpt, published }) => ({ slug, title, excerpt, published })),
  });

  return (
    <Layout>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={META_DESC} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={META_DESC} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="bl" ref={scope}>
        {/* ── Hero ── */}
        <section className="bl-hero">
          <div className="ls-shell">
            <nav className="bl-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">Blog</span>
            </nav>

            <div className="bl-hero-badges ls-reveal">
              <span className="ls-pill ls-pill-on-ink">
                <IconPin size={15} />
                Thurrock, Essex
              </span>
              <span className="ls-pill ls-pill-on-ink">
                <IconClock size={15} />
                {all.length} guides
              </span>
            </div>

            <h1 className="bl-hero-title ls-reveal">
              Travel advice from <span>the driver's seat</span>
            </h1>

            <p className="bl-hero-lede ls-reveal">
              Straight answers to the questions we get asked on the phone every week —
              airport timings, cruise terminal transfers and school runs, written by the
              people who actually drive the routes.
            </p>
          </div>
        </section>

        {/* ── Posts ── */}
        <div className="bl-body">
          <div className="ls-shell">
            <div className="bl-grid ls-stagger">
              {lead && card(lead, true)}
              {rest.map((entry) => card(entry))}
            </div>
          </div>
        </div>

        {/* ── Closing CTA ── */}
        <section className="bl-cta">
          <div className="ls-shell">
            <h2 className="bl-cta-title ls-reveal">Need a taxi, not an article?</h2>
            <p className="bl-cta-sub ls-reveal">
              Fixed prices agreed before you travel, 24 hours a day across Thurrock and
              Essex. Tell us the journey and we'll come back with a price.
            </p>
            <div className="bl-cta-actions ls-reveal">
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
      </div>
    </Layout>
  );
}
