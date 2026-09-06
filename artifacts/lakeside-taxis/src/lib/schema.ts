// Shared schema.org JSON-LD builders for Lakeside & Purfleet Taxis Ltd.
// Business details here must stay in sync with the Google Business Profile —
// mismatches between GBP and on-page schema reduce AI/local-pack citation
// confidence (see SEO audit, 2026-07-18).

const BUSINESS_NAME = "Lakeside & Purfleet Taxis Ltd";
const BUSINESS_URL = "https://lakesidetaxi.co.uk";
const BUSINESS_TEL = "01375383878";
const BUSINESS_EMAIL = "info@lakesidetaxi.co.uk";

const businessAddress = {
  "@type": "PostalAddress",
  addressLocality: "Thurrock",
  addressRegion: "Essex",
  postalCode: "RM17",
  addressCountry: "GB",
};

const businessGeo = {
  "@type": "GeoCoordinates",
  latitude: 51.4875,
  longitude: 0.3564,
};

interface LocalBusinessOptions {
  path: string;
  aggregateRating?: { ratingValue: number; reviewCount: number };
}

export function buildLocalBusinessSchema({ path, aggregateRating }: LocalBusinessOptions) {
  return {
    "@type": "LocalBusiness",
    "@id": `${BUSINESS_URL}${path}#business`,
    name: BUSINESS_NAME,
    telephone: BUSINESS_TEL,
    email: BUSINESS_EMAIL,
    url: BUSINESS_URL,
    address: businessAddress,
    geo: businessGeo,
    openingHours: "Mo-Su 00:00-23:59",
    priceRange: "££",
    ...(aggregateRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
          },
        }
      : {}),
  };
}

interface AreaServiceOptions {
  areaName: string;
  areaSlug: string;
  postcode?: string;
}

export function buildAreaServiceSchema({ areaName, areaSlug, postcode }: AreaServiceOptions) {
  const path = `/areas/${areaSlug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TaxiService",
        "@id": `${BUSINESS_URL}${path}#service`,
        name: `Taxis in ${areaName} — ${BUSINESS_NAME}`,
        description: `Local taxi service in ${areaName}, Thurrock, Essex${postcode ? ` (${postcode})` : ""}. Airport transfers, school runs and corporate travel. Fixed prices, 24/7.`,
        provider: buildLocalBusinessSchema({ path }),
        areaServed: {
          "@type": "Place",
          name: areaName,
        },
        serviceType: "Local Taxi Service",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BUSINESS_URL}/` },
          { "@type": "ListItem", position: 2, name: "Areas Covered", item: `${BUSINESS_URL}/areas-covered` },
          { "@type": "ListItem", position: 3, name: areaName, item: `${BUSINESS_URL}${path}` },
        ],
      },
    ],
  };
}

interface AirportServiceOptions {
  airportName: string;
  airportSlug: string;
  price?: string;
}

export function buildAirportServiceSchema({ airportName, airportSlug, price }: AirportServiceOptions) {
  const path = `/airport-transfers/${airportSlug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TaxiService",
        "@id": `${BUSINESS_URL}${path}#service`,
        name: `${airportName} Airport Transfers — ${BUSINESS_NAME}`,
        description: `Fixed-price taxi transfers to and from ${airportName} Airport from Thurrock and Essex. Flight tracking, meet and greet, 24/7 service.`,
        provider: buildLocalBusinessSchema({ path }),
        areaServed: {
          "@type": "Place",
          name: airportName,
        },
        serviceType: "Airport Transfer",
        ...(price
          ? {
              offers: {
                "@type": "Offer",
                priceCurrency: "GBP",
                price,
                description: `Fixed-price taxi transfer to and from ${airportName} Airport from Thurrock, Essex.`,
                itemOffered: {
                  "@type": "Service",
                  name: `${airportName} Airport Transfer`,
                },
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BUSINESS_URL}/` },
          { "@type": "ListItem", position: 2, name: "Airport Transfers", item: `${BUSINESS_URL}/airport-transfers` },
          { "@type": "ListItem", position: 3, name: `${airportName} Airport`, item: `${BUSINESS_URL}${path}` },
        ],
      },
    ],
  };
}

export function buildFaqSchema(faqs: { q: string; a: string }[], path: string) {
  return {
    "@type": "FAQPage",
    "@id": `${BUSINESS_URL}${path}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

/* ── Blog ──────────────────────────────────────────────────────────────────
   The posts are advice pieces about journeys we actually run, so each one
   carries BlogPosting plus its own FAQPage. Publisher is the business itself,
   not a separate Organization node — there is only one entity here.
   ────────────────────────────────────────────────────────────────────────── */

interface BlogPostingOptions {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  published: string;
  category: string;
  faqs?: { q: string; a: string }[];
}

export function buildBlogPostingSchema({
  slug,
  title,
  description,
  published,
  category,
  faqs,
}: BlogPostingOptions) {
  const path = `/blog/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${BUSINESS_URL}${path}#post`,
        headline: title,
        description,
        datePublished: published,
        dateModified: published,
        articleSection: category,
        inLanguage: "en-GB",
        mainEntityOfPage: { "@type": "WebPage", "@id": `${BUSINESS_URL}${path}` },
        image: `${BUSINESS_URL}/opengraph.jpg`,
        author: { "@type": "Organization", name: BUSINESS_NAME, url: BUSINESS_URL },
        publisher: buildLocalBusinessSchema({ path }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BUSINESS_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BUSINESS_URL}/blog` },
          { "@type": "ListItem", position: 3, name: title, item: `${BUSINESS_URL}${path}` },
        ],
      },
      ...(faqs && faqs.length ? [buildFaqSchema(faqs, path)] : []),
    ],
  };
}

interface BlogIndexOptions {
  posts: { slug: string; title: string; excerpt: string; published: string }[];
}

export function buildBlogIndexSchema({ posts }: BlogIndexOptions) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${BUSINESS_URL}/blog#blog`,
        name: `${BUSINESS_NAME} — Travel advice`,
        description:
          "Practical travel advice from a Thurrock taxi firm: airport timing, cruise terminal transfers, school runs and getting around Essex.",
        url: `${BUSINESS_URL}/blog`,
        inLanguage: "en-GB",
        publisher: buildLocalBusinessSchema({ path: "/blog" }),
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          "@id": `${BUSINESS_URL}/blog/${p.slug}#post`,
          headline: p.title,
          description: p.excerpt,
          datePublished: p.published,
          url: `${BUSINESS_URL}/blog/${p.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BUSINESS_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BUSINESS_URL}/blog` },
        ],
      },
    ],
  };
}

export { BUSINESS_NAME, BUSINESS_URL, BUSINESS_TEL, BUSINESS_EMAIL };
