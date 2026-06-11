# Lakeside & Purfleet Taxis Ltd

Lead-generation taxi website for Lakeside & Purfleet Taxis Ltd (Thurrock, Essex, UK). Public multi-page frontend for enquiry capture + admin backend for lead management. No live booking or payment — enquiry capture and manual follow-up only.

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
- DB: PostgreSQL + Drizzle ORM (tables: `leads`, `admin_users`, `lead_replies`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Email: nodemailer (SMTP, optional — set env vars to enable)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — DB schema (leads, admin_users, lead_replies)
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

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Default admin login: `admin@lakesidetaxis.co.uk` / `admin123` — **change before going live**
- Email notifications require SMTP env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`
- API proxy path is `/api` — frontend uses relative URLs through the shared Replit proxy
- Session cookies use `sameSite: "lax"` in dev, `"strict"` in production
- Phone numbers and business details are placeholders (01375 000000, 07700 000000, info@lakesidetaxis.co.uk) — replace before going live

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
