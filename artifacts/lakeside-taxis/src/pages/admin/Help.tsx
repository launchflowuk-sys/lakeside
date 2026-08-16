import { useState, useMemo, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Search, X, Info, AlertTriangle, ChevronRight } from "lucide-react";
import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  type HelpArticle,
  type HelpBlock,
} from "@/lib/adminHelpContent";

/** Every word in an article, so search matches body text and not just titles. */
function searchableText(article: HelpArticle): string {
  const blockText = article.blocks
    .map((b) => {
      switch (b.type) {
        case "p":
        case "note":
        case "warn":
          return b.text;
        case "steps":
        case "list":
          return b.items.join(" ");
        case "rows":
          return b.items.map(([term, def]) => `${term} ${def}`).join(" ");
      }
    })
    .join(" ");

  return `${article.title} ${article.summary} ${article.keywords.join(" ")} ${blockText}`.toLowerCase();
}

const INDEX = HELP_ARTICLES.map((article) => ({
  article,
  haystack: searchableText(article),
}));

function Blocks({ blocks }: { blocks: HelpBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">
                {block.text}
              </p>
            );

          case "steps":
            return (
              <ol key={i} className="mb-4 space-y-2">
                {block.items.map((item, n) => (
                  <li key={n} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="flex-none w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold grid place-items-center mt-0.5">
                      {n + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            );

          case "list":
            return (
              <ul key={i} className="mb-4 space-y-1.5">
                {block.items.map((item, n) => (
                  <li key={n} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <span className="flex-none w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "rows":
            return (
              <div key={i} className="mb-4 rounded-lg border border-border overflow-hidden">
                {block.items.map(([term, def], n) => (
                  <div
                    key={n}
                    className="grid grid-cols-1 sm:grid-cols-[minmax(140px,200px)_1fr] gap-1 sm:gap-4 px-4 py-3 border-b border-border/60 last:border-0 bg-card"
                  >
                    <span className="text-sm font-semibold text-foreground">{term}</span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{def}</span>
                  </div>
                ))}
              </div>
            );

          case "note":
            return (
              <div
                key={i}
                className="flex gap-3 mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3"
              >
                <Info className="h-4 w-4 text-primary flex-none mt-0.5" />
                <p className="text-sm text-foreground/90 leading-relaxed">{block.text}</p>
              </div>
            );

          case "warn":
            return (
              <div
                key={i}
                className="flex gap-3 mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3"
              >
                <AlertTriangle className="h-4 w-4 text-destructive flex-none mt-0.5" />
                <p className="text-sm text-foreground/90 leading-relaxed">{block.text}</p>
              </div>
            );
        }
      })}
    </>
  );
}

export default function AdminHelp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  // <article> elements, so HTMLElement rather than HTMLDivElement.
  const articleRefs = useRef<Record<string, HTMLElement | null>>({});

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    return INDEX.filter(({ article, haystack }) => {
      if (category !== "all" && article.category !== category) return false;
      if (!trimmed) return true;
      // Every word must appear somewhere, so extra words narrow rather than
      // widen the result — "driver documents" should not return every article
      // that merely mentions a driver.
      return trimmed.split(/\s+/).every((word) => haystack.includes(word));
    }).map((entry) => entry.article);
  }, [trimmed, category]);

  const grouped = useMemo(() => {
    return HELP_CATEGORIES.map((cat) => ({
      category: cat,
      articles: results.filter((a) => a.category === cat),
    })).filter((g) => g.articles.length > 0);
  }, [results]);

  // Open the article named in the URL hash, so links from elsewhere land in
  // the right place rather than at the top of a long page.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const node = articleRefs.current[id];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <AdminLayout>
      <Helmet>
        <title>Help | Lakeside Taxis Admin</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-foreground">HELP</h1>
        <p className="text-muted-foreground text-sm mt-1">
          How the dashboard works, and what to do day to day
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help — try “payment link”, “delete”, “password”"
          className="pl-9 pr-9"
          data-testid="help-search"
          aria-label="Search help articles"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...HELP_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {cat === "all" ? "Everything" : cat}
          </button>
        ))}
      </div>

      {/* Quick jump — only useful when browsing, not when searching */}
      {!trimmed && category === "all" && (
        <div className="mb-8 rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            New here? Start with these
          </p>
          <div className="flex flex-col gap-1.5">
            {["overview", "booking-workflow", "lead-statuses"].map((id) => {
              const article = HELP_ARTICLES.find((a) => a.id === id);
              if (!article) return null;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => articleRefs.current[id]?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  {article.title}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div className="rounded-lg border border-border bg-card px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing found for “{query}”.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Try a simpler word, or clear the search to browse everything.
          </p>
        </div>
      ) : (
        <>
          {trimmed && (
            <p className="text-xs text-muted-foreground mb-4" data-testid="help-result-count">
              {results.length} {results.length === 1 ? "article" : "articles"} matching “{query}”
            </p>
          )}

          <div className="space-y-10">
            {grouped.map((group) => (
              <section key={group.category}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  {group.category}
                </h2>
                <div className="space-y-4">
                  {group.articles.map((article) => (
                    <article
                      key={article.id}
                      id={article.id}
                      ref={(node) => {
                        articleRefs.current[article.id] = node;
                      }}
                      data-testid="help-article"
                      className="rounded-lg border border-border bg-card p-5 scroll-mt-24"
                    >
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground/80 mb-4">{article.summary}</p>
                      <Blocks blocks={article.blocks} />
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
