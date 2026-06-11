---
name: coolify-deployment
description: Deploy a pnpm monorepo to Coolify using Docker Compose. Use when setting up, debugging, or updating Coolify deployments for this project. Contains all hard-won rules from real deployment failures.
---

# Coolify Deployment

This project deploys to Coolify (self-hosted) via Docker Compose. Two services: `frontend` (nginx serving the Vite build) and `api` (Node.js Express bundle). There is also a `db` (PostgreSQL) service.

Coolify repo: `https://github.com/launchflowuk-sys/lakeside.git` (push from Replit Shell tab — git credentials don't work from agent bash).

## The 4 Rules (learned the hard way)

### 1. Always use `node:24-slim`, never `node:24-alpine`

`pnpm-workspace.yaml` strips musl-libc platform binaries from esbuild, rollup, and `@tailwindcss/oxide` to keep the repo lean. Alpine Linux uses musl — those binaries won't install and Vite's build silently fails.

```dockerfile
FROM node:24-slim AS builder   ✅
FROM node:24-alpine AS builder  ❌
```

The nginx serving stage (`nginx:1.27-alpine`) is fine — it doesn't use Node native modules.

### 2. Copy `tsconfig.base.json` in both Dockerfiles

Vite 7 strictly resolves every `tsconfig.json` `extends` chain at build time. The root `tsconfig.base.json` sits two levels above each artifact (`../../tsconfig.base.json`) and is not inside `lib/` or `artifacts/`. It must be copied explicitly.

```dockerfile
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
```

Without this, Vite throws:
```
[vite:build-html] failed to resolve "extends":"../../tsconfig.base.json"
```

### 3. No host port bindings — use Coolify's network

Coolify's Traefik proxy owns ports 80, 443, and 8080 on the host. Any `ports:` binding in docker-compose.yml will collide.

**Wrong:**
```yaml
ports:
  - "80:80"    # ❌ Traefik owns this
  - "8080:80"  # ❌ Also taken
```

**Right:**
```yaml
expose:
  - "80"
networks:
  - coolify
```

And at the bottom of docker-compose.yml declare the network as external:
```yaml
networks:
  coolify:
    external: true
```

In Coolify's UI, set the **frontend service port to 80** so Traefik knows where to proxy.

The `api` and `db` services communicate over the default compose network — they don't need to join the `coolify` network.

### 4. pnpm version in Dockerfiles must match the lockfile

The lockfile format is tied to the pnpm major version. pnpm@9 cannot read a pnpm@10 lockfile and `pnpm install --frozen-lockfile` will fail immediately.

Check the lockfile header:
```
lockfileVersion: '9.0'   →  use pnpm@10
lockfileVersion: '6.0'   →  use pnpm@9
```

```dockerfile
RUN corepack enable && corepack prepare pnpm@10 --activate
```

## Debugging Workflow

When a Coolify deploy fails, download the **full log file** (there is a download button in the Coolify UI). The truncated on-screen view cuts off the actual error. Errors appear in this order:

| Stage | Likely cause |
|-------|-------------|
| `pnpm install --frozen-lockfile` | Wrong pnpm major version |
| `pnpm ... run build` (Vite) | Missing `tsconfig.base.json`, or musl binary missing (Alpine) |
| Container Starting → port conflict | Host port binding clashing with Coolify Traefik |
| Container Starting → network error | `coolify` network not declared as external |

## Current docker-compose.yml structure

```yaml
services:
  frontend:
    build: { context: ., dockerfile: Dockerfile.frontend }
    expose: ["80"]
    networks: [coolify]
    depends_on: { api: { condition: service_started } }
    restart: unless-stopped

  api:
    build: { context: ., dockerfile: Dockerfile.api }
    environment: { DATABASE_URL, SESSION_SECRET, PORT: "8080", ... }
    depends_on: { db: { condition: service_healthy } }
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  coolify:
    external: true
```

## Deploying a change

1. Make code changes in Replit
2. From the **Replit Shell tab** run: `git push origin main`
   (Agent bash can't push — GitHub credentials only work in the Shell tab)
3. In Coolify, click **Redeploy**
4. If it fails, download the full log and look for the first red line after a `#NN` build step
