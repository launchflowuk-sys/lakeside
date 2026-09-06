import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import NotFound from "@/pages/not-found";
import BlogCover from "./BlogCover";
import PostCard from "./PostCard";
import { formatPostDate, getPost, POSTS_BY_DATE } from "./posts";
import { buildBlogPostingSchema, BUSINESS_URL } from "@/lib/schema";
import { useReveal } from "@/hooks/useReveal";
import {
  IconArrowRight,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconPhone,
  IconWhatsApp,
} from "@/components/icons/Icons";
// The sticky quote card is the same object the town and airport pages use, so
// it keeps their styles rather than growing a second copy under a bl- prefix.
import "../seo-pages.css";
import "../blog.css";

const TEL = "tel:01375383878";
const TEL_DISPLAY = "01375 383878";
const WA = "https://wa.me/447879956275";

interface BlogPostProps {
  slug: string;
}

export default function BlogPost({ slug }: BlogPostProps) {
  const post = getPost(slug);
  const scope = useReveal<HTMLDivElement>();

  // Hooks run before this branch so the order stays stable across slugs.
  if (!post) return <NotFound />;

  const canonicalUrl = `${BUSINESS_URL}/blog/${post.slug}`;
  const schema = buildBlogPostingSchema({
    slug: post.slug,
    title: post.title,
    description: post.metaDescription,
    published: post.published,
    category: post.category,
    faqs: post.faq,
  });

  const morePosts = POSTS_BY_DATE.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <Layout>
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published} />
        <meta property="article:section" content={post.category} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="bl" ref={scope}>
        {/* ── Hero ── */}
        <section className="bl-hero">
          <div className="ls-shell">
            <nav className="bl-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <IconChevronRight size={13} />
              <Link href="/blog">Blog</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">{post.category}</span>
            </nav>

            <div className="bl-hero-badges ls-reveal">
              <span className="ls-pill ls-pill-yellow">{post.category}</span>
            </div>

            <h1 className="bl-hero-title ls-reveal">{post.title}</h1>

            <p className="bl-hero-lede ls-reveal">{post.lede}</p>

            <div className="bp-meta ls-reveal">
              <time dateTime={post.published}>{formatPostDate(post.published)}</time>
              <span className="bl-dot" aria-hidden="true" />
              <span>{post.readMinutes} min read</span>
              <span className="bl-dot" aria-hidden="true" />
              <span>Lakeside &amp; Purfleet Taxis</span>
            </div>
          </div>
        </section>

        {/* ── Cover ── */}
        <div className="bp-cover-wrap">
          <div className="ls-shell">
            <BlogCover variant={post.cover} className="bp-cover" />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="bp-body">
          <div className="ls-shell ls-shell-wide">
            <div className="bp-layout">
              <article className="bp-content">
                {/* Short answer — the page should be useful before the scroll. */}
                <div className="bp-key ls-reveal">
                  <span className="bp-key-label">
                    <IconClock size={18} />
                    The short answer
                  </span>
                  <ul className="bp-key-list">
                    {post.keyPoints.map((point) => (
                      <li key={point}>
                        <IconCheck size={18} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {post.sections.map((section) => (
                  <section className="bp-section ls-reveal" key={section.heading}>
                    <h2>{section.heading}</h2>
                    {section.body.map((para) => (
                      <p key={para.slice(0, 48)}>{para}</p>
                    ))}

                    {section.list && (
                      <div className="bp-points">
                        {section.list.map((item) => (
                          <div className="bp-point" key={item.title}>
                            <IconCheck size={18} />
                            <span className="bp-point-text">
                              <strong>{item.title}</strong>
                              <span>{item.text}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.note && (
                      <div className="bp-note">
                        <strong>{section.note.title}</strong>
                        <p>{section.note.text}</p>
                      </div>
                    )}
                  </section>
                ))}

                {/* ── FAQ ── */}
                <section className="bp-section ls-reveal">
                  <h2>Common questions</h2>
                  <div className="bp-faq">
                    {post.faq.map((item) => (
                      <div className="bp-faq-item" key={item.q}>
                        <h3 className="bp-faq-q">{item.q}</h3>
                        <p className="bp-faq-a">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Related ── */}
                <div className="bp-related ls-reveal">
                  <span className="bp-related-label">Related pages</span>
                  <div className="bp-related-grid">
                    {post.related.map((link) => (
                      <Link key={link.href} href={link.href} className="bp-related-card">
                        <span className="bp-related-name">
                          {link.label}
                          <IconArrowRight size={15} />
                        </span>
                        <span className="bp-related-desc">{link.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </article>

              {/* ── Quote card ── */}
              <aside className="bp-form-col">
                <div className="sp-form-card">
                  <h2 className="sp-form-title">Get a quote</h2>
                  <p className="sp-form-sub">
                    Tell us the journey and we'll come back with a fixed price, usually
                    within the hour. No payment taken online.
                  </p>
                  <BookingForm compact />
                  <div className="sp-form-divider">or reach us directly</div>
                  <div className="sp-form-contacts">
                    <a href={TEL} className="ls-btn ls-btn-quiet">
                      <IconPhone size={17} />
                      Call
                    </a>
                    <a
                      href={WA}
                      className="ls-btn ls-btn-whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconWhatsApp size={17} />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ── More posts ── */}
        {morePosts.length > 0 && (
          <section className="bl-more">
            <div className="ls-shell">
              <div className="bl-more-head">
                <h2 className="ls-h2 ls-reveal">More from the blog</h2>
                <Link href="/blog" className="bl-more-link">
                  All guides
                  <IconArrowRight size={16} />
                </Link>
              </div>
              <div className="bl-grid ls-stagger">
                {morePosts.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Closing CTA ── */}
        <section className="bl-cta">
          <div className="ls-shell">
            <h2 className="bl-cta-title ls-reveal">Ready to book the journey?</h2>
            <p className="bl-cta-sub ls-reveal">
              Fixed prices agreed before you travel, 24 hours a day across Thurrock and
              Essex.
            </p>
            <div className="bl-cta-actions ls-reveal">
              <Link href="/quote-request" className="ls-btn ls-btn-primary ls-btn-lg">
                Request a quote
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
