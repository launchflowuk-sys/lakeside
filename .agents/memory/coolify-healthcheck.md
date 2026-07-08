---
name: Coolify healthcheck pitfall
description: Neither nginx:alpine NOR node:24-slim include wget/curl — a failing healthcheck causes dual-container split-brain, not just traffic loss.
---

# Coolify healthcheck pitfall

## The rule
Never use `wget` or `curl` in healthchecks without first verifying the base image includes them. Both `nginx:alpine` and `node:24-slim` lack both tools. A failing healthcheck causes Docker to mark the container unhealthy — Coolify then keeps the OLD container running alongside the new one (dual-container split-brain). All resulting symptoms look like code bugs.

**Symptoms of dual-container split-brain:**
- Same endpoint returns different status codes on consecutive requests (e.g. 401 then 200, 404 then 200)
- Sessions appear to save then immediately drop (requests to old container have no session)
- Random 401/403/404/500 errors that disappear on retry
- Failing requests don't appear in the NEW container's API logs (they hit the old container)
- nginx logs show e.g. `/api/admin/stats → 404` but API logs show it as `aborted` — two different containers handling two different requests to the same endpoint

**Why:** Coolify/Traefik load-balances across all running containers for a service. When the new container's healthcheck fails, Docker marks it unhealthy, and Coolify does not cut over — both old (working healthcheck or no healthcheck) and new (unhealthy) containers receive traffic indefinitely.

**How to apply:**
- `nginx:alpine` frontend — remove the healthcheck entirely; nginx starting is sufficient signal.
- `node:24-slim` API — use node itself (always present) in the healthcheck:
  ```yaml
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:8080/api/healthz', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]
  ```
- `postgres:16-alpine` DB — `pg_isready` is built in, safe to use.
