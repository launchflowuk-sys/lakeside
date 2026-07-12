# Lakeside & Purfleet Taxis Ltd

**No Replit dependencies. This project lives on the owner's own server — deployed via GitHub → Coolify, not Replit.** Replit is used only as the development environment; production runs in Docker Compose on a self-hosted server with its own PostgreSQL database (see "Production deployment" below).

Lead-generation taxi website for Lakeside & Purfleet Taxis Ltd (Thurrock, Essex, UK). Public multi-page frontend for enquiry capture + admin backend for lead management. No live booking or payment — enquiry capture and manual follow-up only.

## Production deployment

- **Pipeline**: push to GitHub (`launchflowuk-sys/lakeside`, main branch) → Coolify auto-builds and redeploys from `docker-compose.yml`.
- **Services**: `frontend` (nginx serving the built React app, proxies `/api` to `api`), `api` (Express, port 8080), `db` (Postgres 16).
- **Data persistence**: Postgres data is a host bind mount (`/var/lib/lakeside/postgres:/var/lib/postgresql/data`), NOT a named Docker volume — this survives every redeploy. Only manually deleting that folder on the server would wipe data.
- **Migrations**: run automatically on API container startup (`runMigrations()` in `artifacts/api-server/src/lib/migrate.ts`). Every migration statement must be safe to re-run on both fresh and existing databases (fresh DB on first deploy, already-migrated DB on every redeploy after).
- **No Replit services in production**: no `@replit/*` runtime packages, no Replit auth/db/storage. Only harmless `// @replit` code comments remain in some shadcn UI components — not dependencies.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/lakeside-taxis run dev` — run the frontend (port 22561)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (wouter routing, TanStack Query, react-helm-async, Tailwind CSS)
- API: Express 5 + express-session (admin auth), bcryptjs (password hashing)
- DB: PostgreSQL + Drizzle ORM (tables: `leads`, `admin_users`, `lead_replies`, `corporate_applications`, `quotes`, `admin_sessions`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Email: nodemailer (SMTP, optional — set env vars to enable)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — DB schema (leads, admin_users, lead_replies, corporate_applications, quotes; `admin_sessions` is created directly in `migrate.ts`, not part of the Drizzle schema)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/generated/` — generated React Query hooks and Zod schemas
- `artifacts/lakeside-taxis/src/` — React frontend
  - `pages/` — all public pages + admin pages
  - `pages/areas/` — 9 SEO area pages (Grays, Purfleet, etc.)
  - `pages/airports/` — 6 airport transfer SEO pages (Heathrow, Gatwick, etc.)
  - `pages/admin/` — admin panel (Login, Dashboard, Leads, LeadDetail, Booked, Settings)
  - `pages/legal/` — Privacy Policy, Terms, Cookie Policy
  - `components/layout/` — Header, Footer, MobileBar, Layout
  - `components/admin/AdminLayout.tsx` — sidebar admin shell
  - `components/BookingForm.tsx` — 5-step multi-step booking/quote form
- `artifacts/api-server/src/routes/` — API routes (leads, admin-auth, admin-leads, admin-stats)

## Architecture decisions

- No live booking or payment — all enquiries are manual-follow-up only
- Session-based admin auth (express-session + bcryptjs) — no JWT complexity
- Email via nodemailer is optional — SMTP env vars enable it; site works without them
- OpenAPI-first API design — all types flow from the spec through codegen
- Dark brand theme (black/yellow/white) — taxi yellow as primary, Barlow Condensed for display headings

## Product

- Public: Homepage, 5 service pages, 6 airport SEO pages, 9 area SEO pages, quote request form (5-step), thank-you, about, contact, 3 legal pages (30+ pages total)
- Admin: Session-authenticated admin panel with lead list/filter, lead detail (status, notes, quoted price, assigned driver), email reply to customer, stats dashboard, booked jobs view

## User preferences

- **No Replit dependencies** — no `@replit/*` packages or Replit-specific services in any artifact. Self-hosted deployment on Coolify; database is own PostgreSQL via `DATABASE_URL`.

## Gotchas

- Admin login is seeded from the `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables on every server boot — there is no default credential baked into the code
- Email notifications require SMTP env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`
- API proxy path is `/api` — frontend uses relative URLs through the shared Replit proxy
- Session cookies always use `sameSite: "lax"` (dev and production)
- Phone: 01375 383878 | WhatsApp: 07879 956275 (wa.me/447879956275) | Email: info@lakesidetaxi.co.uk — set globally via `src/lib/constants.ts`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
