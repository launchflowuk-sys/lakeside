import { type Request, type Response, type NextFunction } from "express";

const WINDOW_MS = 60_000;
const MAX_PER_REF = 5;

const refHits = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [ref, entry] of refHits) {
    if (entry.resetAt <= now) refHits.delete(ref);
  }
}, 5 * 60_000).unref();

/**
 * Caps lookups of a single quote ref to MAX_PER_REF per WINDOW_MS, across all
 * source IPs. Complements per-IP rate limiting: a botnet spreading requests
 * for one known/guessed ref across many IPs would otherwise bypass an
 * IP-keyed limiter entirely.
 */
export function quoteRefRateLimit(req: Request, res: Response, next: NextFunction): void {
  const ref = Array.isArray(req.params.ref) ? req.params.ref[0] : req.params.ref;
  const now = Date.now();
  const entry = refHits.get(ref);

  if (!entry || entry.resetAt <= now) {
    refHits.set(ref, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (entry.count >= MAX_PER_REF) {
    res.status(429).json({ error: "Too many requests for this quote. Please try again later." });
    return;
  }

  entry.count++;
  next();
}
