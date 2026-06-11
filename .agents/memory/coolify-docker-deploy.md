---
name: Coolify Docker Compose deployment
description: Hard-won lessons deploying a pnpm monorepo to Coolify with two Docker services
---

## Rules

1. **Use `node:24-slim`, never `node:24-alpine`.**
   pnpm-workspace.yaml overrides exclude all musl variants of esbuild, rollup, and @tailwindcss/oxide. Alpine uses musl — build tools silently fail.
   **Why:** `pnpm-workspace.yaml` strips platform binaries to keep the repo lean; musl overrides are excluded because the dev environment is glibc.

2. **Copy `tsconfig.base.json` in both Dockerfiles.**
   Vite 7 strictly resolves every `tsconfig.json` `extends` chain. The root `tsconfig.base.json` is not inside `lib/` or any artifact directory, so it must be copied explicitly.
   `COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./`
   **Why:** Vite 7 changed behaviour — previously it silently skipped unresolvable extends, now it throws.

3. **Do NOT use host `ports:` bindings for public-facing services.**
   Coolify's Traefik proxy owns ports 80 and 443 (and often 8080) on the host. Use `expose:` + `networks: coolify` (declared as `external: true`) so Traefik can route internally.
   In Coolify UI, set the service port to 80 for the frontend.
   **Why:** Any `ports: "X:Y"` binding fights Coolify's own Traefik container.

4. **pnpm version in Dockerfiles must match the lockfile.**
   Use `corepack prepare pnpm@10 --activate`. The lockfile format is tied to the major version — pnpm@9 cannot read a pnpm@10 lockfile.
