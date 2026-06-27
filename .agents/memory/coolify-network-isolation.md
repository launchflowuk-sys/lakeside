---
name: Coolify network isolation
description: All Docker Compose services must be in the same named network or they cannot reach each other.
---

In Coolify's Docker Compose deployments, any service that explicitly sets `networks: [coolify]` is placed ONLY in that network — not in the default compose network. Services with NO `networks` key land in the project's default network only. These two networks are isolated; containers in one cannot reach containers in the other.

**Why:** The frontend nginx used `proxy_pass http://api:8080` but `api` was in a different network, so every proxied request silently returned 404. The Docker healthcheck (`wget localhost:8080/api/healthz`) still passed because it used localhost, masking the network split for hours.

**How to apply:** Every service in the compose file — frontend, api, db — must explicitly declare `networks: - coolify`. Do not rely on Docker Compose's implicit default network when an external named network is in use.
