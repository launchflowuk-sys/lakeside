---
name: Lead capture email isolation
description: Why side-effect emails after a DB insert must never be allowed to throw uncaught
---

In a lead-generation flow (or any "save then notify" endpoint), the DB write must
be treated as the source of truth. Any side effect that runs after the write
(sending confirmation/notification emails, webhooks, etc.) must be wrapped in
its own try/catch so a failure there cannot prevent the success response from
being sent.

**Why:** if a global error handler exists and a post-insert side effect throws,
Express will route it to that handler and return an error response — even
though the record was already persisted. This produces the confusing
"user saw an error / but admin later reports data missing" or, worse,
"user saw success but nothing showed up" reports when combined with retries,
stale deploys, or duplicate instances behind a load balancer. Isolating side
effects removes one whole class of these ambiguous bug reports.

**How to apply:** structure handlers as `insert → try { side effects } catch { log, don't rethrow } → respond`.
Never put side effects before the response inside the same unguarded try block as the insert.
