import { useQuery } from "@tanstack/react-query";

/**
 * Posts written and published in LaunchOS, shown alongside the hand-written
 * guides in posts.ts.
 *
 * LaunchOS serves a site's published posts from a public, read-only, CORS-open
 * endpoint addressed by domain, so the browser asks for the domain it is on
 * (`?host=` from window.location) — nothing here names a domain, so the site
 * keeps working when its canonical domain changes. Any failure (404 = no blog,
 * timeout, bad JSON) is an empty list: the hand-written guides still render.
 */

const API = import.meta.env?.VITE_LAUNCHOS_BLOG_API || "https://os.launchflow.co.uk/api/public/blog";
const TIMEOUT_MS = 5000;
const STALE_MS = 5 * 60 * 1000;
const EXCERPT_CHARS = 160;
const WORDS_PER_MINUTE = 200;

export interface LaunchosPost {
  slug: string;
  title: string;
  /** Sanitised by LaunchOS before it is served. */
  html: string;
  imageUrl: string | null;
  /** YYYY-MM-DD, the same shape posts.ts uses. */
  published: string;
  excerpt: string;
  readMinutes: number;
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function toPost(raw: unknown): LaunchosPost | null {
  const o = raw as Record<string, unknown> | null;
  if (!o || typeof o.slug !== "string" || typeof o.title !== "string"
    || typeof o.html !== "string" || typeof o.publishedAt !== "string") return null;
  const text = plainText(o.html);
  const cut = text.slice(0, EXCERPT_CHARS);
  const space = cut.lastIndexOf(" ");
  return {
    slug: o.slug,
    title: o.title,
    html: o.html,
    imageUrl: typeof o.imageUrl === "string" && o.imageUrl ? o.imageUrl : null,
    published: o.publishedAt.slice(0, 10),
    excerpt: text.length <= EXCERPT_CHARS ? text : `${(space > 0 ? cut.slice(0, space) : cut).trim()}…`,
    readMinutes: Math.max(1, Math.round(text.split(" ").length / WORDS_PER_MINUTE)),
  };
}

async function fetchPosts(): Promise<LaunchosPost[]> {
  try {
    const host = window.location.hostname.replace(/^www\./, "");
    const res = await fetch(`${API}?host=${encodeURIComponent(host)}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return [];
    const body = (await res.json()) as { data?: { posts?: unknown[] } };
    const posts = Array.isArray(body?.data?.posts) ? body.data.posts : [];
    return posts.map(toPost).filter((p): p is LaunchosPost => p !== null);
  } catch {
    // Deliberately quiet: an unreachable LaunchOS means "no extra posts", and
    // the visitor still gets the hand-written guides.
    return [];
  }
}

/** Every LaunchOS post for this domain, newest first. Cached for five minutes. */
export function useLaunchosPosts() {
  return useQuery({ queryKey: ["launchos-blog"], queryFn: fetchPosts, staleTime: STALE_MS, retry: false });
}
