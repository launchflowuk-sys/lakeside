import { useEffect, useRef } from "react";

/**
 * One-shot scroll reveal for the homepage.
 *
 * Content renders VISIBLE by default. The hidden pre-reveal state is applied
 * here, in the effect — only after we've confirmed IntersectionObserver exists
 * and the visitor hasn't asked for reduced motion. So crawlers, no-JS visitors
 * and reduced-motion users always receive the fully rendered page, and nothing
 * can strand a section at opacity 0 (which is exactly what happened to the
 * reviews heading before this guard existed).
 */
/**
 * `threshold` is 0 on purpose. The homepage observes whole section containers,
 * and the services grid alone is ~1600px tall — taller than most phone
 * viewports. A percentage threshold on an element taller than the viewport is
 * unreliable (it can cap below the threshold entirely), which left two
 * sections stranded at opacity 0. Firing on first pixel is height-independent.
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") return;

    // Arm only now that the observer is guaranteed to run.
    el.classList.add("hp-reveal--armed");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hp-reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
