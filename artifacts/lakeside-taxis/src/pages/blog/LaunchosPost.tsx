import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/BookingForm";
import NotFound from "@/pages/not-found";
import BlogCover from "./BlogCover";
import { formatPostDate } from "./posts";
import { useLaunchosPosts, type LaunchosPost } from "./launchos";
import { buildBlogPostingSchema, BUSINESS_URL } from "@/lib/schema";
import { IconArrowRight, IconChevronRight, IconPhone, IconWhatsApp } from "@/components/icons/Icons";
import "../seo-pages.css";
import "../blog.css";
import "./launchos-blog.css";

/*
 * A LaunchOS post, in the same frame as the hand-written guides (BlogPost.tsx).
 * No `ls-reveal` here: these arrive after the page's reveal observer has armed,
 * and an unobserved reveal element would sit hidden until the failsafe.
 */

const TEL = "tel:01375383878";
const WA = "https://wa.me/447879956275";
const CATEGORY = "Travel advice";

/** Index card for a LaunchOS post — PostCard's markup, with the post's own image. */
export function LaunchosCard({ post, lead = false }: { post: LaunchosPost; lead?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className={`bl-card${lead ? " bl-card-lead" : ""}`} aria-label={post.title}>
      <div className="bl-card-media">
        {post.imageUrl
          ? <img src={post.imageUrl} alt="" loading="lazy" className="bl-card-cover" />
          : <BlogCover variant="airport" className="bl-card-cover" />}
      </div>
      <div className="bl-card-body">
        <div className="bl-card-meta">
          <span className="ls-pill ls-pill-yellow">{CATEGORY}</span>
          <time dateTime={post.published}>{formatPostDate(post.published)}</time>
          <span className="bl-dot" aria-hidden="true" />
          <span>{post.readMinutes} min read</span>
        </div>
        <h2 className="bl-card-title">{post.title}</h2>
        <p className="bl-card-excerpt">{post.excerpt}</p>
        <span className="bl-card-go">
          Read the guide
          <IconArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export default function LaunchosPostPage({ slug }: { slug: string }) {
  const { data: posts, isLoading } = useLaunchosPosts();
  const post = posts?.find((p) => p.slug === slug.toLowerCase());

  if (isLoading) return <Layout><div className="bl lb-loading" aria-busy="true" /></Layout>;
  if (!post) return <NotFound />;

  const canonicalUrl = `${BUSINESS_URL}/blog/${post.slug}`;
  const metaTitle = `${post.title} | Lakeside & Purfleet Taxis`;
  const schema = buildBlogPostingSchema({
    slug: post.slug,
    title: post.title,
    description: post.excerpt,
    published: post.published,
    category: CATEGORY,
  });

  return (
    <Layout>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
        <meta property="article:published_time" content={post.published} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="bl">
        <section className="bl-hero">
          <div className="ls-shell">
            <nav className="bl-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <IconChevronRight size={13} />
              <Link href="/blog">Blog</Link>
              <IconChevronRight size={13} />
              <span aria-current="page">{CATEGORY}</span>
            </nav>
            <h1 className="bl-hero-title">{post.title}</h1>
            <div className="bp-meta">
              <time dateTime={post.published}>{formatPostDate(post.published)}</time>
              <span className="bl-dot" aria-hidden="true" />
              <span>{post.readMinutes} min read</span>
              <span className="bl-dot" aria-hidden="true" />
              <span>Lakeside &amp; Purfleet Taxis</span>
            </div>
          </div>
        </section>

        <div className="bp-cover-wrap">
          <div className="ls-shell">
            {post.imageUrl
              ? <img src={post.imageUrl} alt="" className="bp-cover lb-cover-img" />
              : <BlogCover variant="airport" className="bp-cover" />}
          </div>
        </div>

        <div className="bp-body">
          <div className="ls-shell ls-shell-wide">
            <div className="bp-layout">
              <article className="bp-content">
                <div className="lb-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
                <Link href="/blog" className="bl-more-link lb-back">
                  All guides
                  <IconArrowRight size={16} />
                </Link>
              </article>

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
                    <a href={WA} className="ls-btn ls-btn-whatsapp" target="_blank" rel="noopener noreferrer">
                      <IconWhatsApp size={17} />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
