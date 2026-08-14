import { useEffect, useRef } from "react";

/**
 * Arms the one authored scroll moment for a page.
 *
 * Content renders VISIBLE by default. The hidden pre-reveal state lives behind
 * `[data-reveal="armed"]` on <html>, which is only ever set here — after we've
 * confirmed IntersectionObserver exists and the visitor hasn't asked for
 * reduced motion. So crawlers, no-JS visitors and reduced-motion users always
 * receive the fully rendered page, and nothing can strand content at opacity 0.
 *
 * Returns a ref for the scope container; every `.ls-reveal` inside it is
 * observed once and revealed as it enters view.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const scope = ref.current;
    if (!scope) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") return;

    const root = document.documentElement;
    root.dataset.reveal = "armed";

    const targets = Array.from(scope.querySelectorAll<HTMLElement>(".ls-reveal"));

    // Anything already in view on load reveals immediately rather than waiting
    // for a scroll that may never come on a short page.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => observer.observe(el));

    // Safety net: if anything is still unrevealed after the page settles,
    // show it. A decorative animation must never be able to hide content.
    const failsafe = window.setTimeout(() => {
      targets.forEach((el) => el.classList.add("is-revealed"));
    }, 2600);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [threshold]);

  return ref;
}
