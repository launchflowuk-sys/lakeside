# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: residents of Thurrock, Essex — Grays, Purfleet, Chafford Hundred, Tilbury, South Ockendon, Aveley, West Thurrock, Stanford-le-Hope, Corringham — who need a taxi and are choosing a firm, usually on a phone.

Three recurring situations:

1. **Airport departure planning.** Booking days or weeks ahead for a Heathrow, Gatwick, Stansted, Luton, London City or Southend transfer, often at an antisocial hour. The visitor is comparing firms and wants a price they can trust and a firm that will actually turn up at 3am.
2. **Everyday local journey.** Station run, appointment, shopping, night out. High frequency, low deliberation, almost always mobile.
3. **Recurring/organisational booking.** School runs on a fixed weekly schedule, or a business opening a corporate account with monthly billing.

Most arrivals are organic search landing directly on a town page (`/areas/<town>`) or an airport page (`/airport-transfers/<airport>`) — not on the homepage. These pages are the front door and must convert on their own.

## Product Purpose

Lakeside & Purfleet Taxis Ltd is a licensed private-hire firm in Thurrock. The website exists to turn a searching local into a confirmed booking, primarily by capturing a quote request that staff price and confirm personally.

Success = a completed quote request. Phone (01375 383878) and WhatsApp (+44 7879 956275) are supporting routes, not the primary target.

## Positioning

A local firm with actual local knowledge, fixed prices agreed before travel, and no app or account required — reachable by phone or WhatsApp like a person, not a platform. The competition is Uber/Bolt (app-only, surge-priced, non-local) and national booking aggregators (no local drivers, no accountability).

The mechanism a competitor cannot truthfully copy: a Thurrock firm trading since 1990 whose drivers know the specific roads, with every fare agreed by a human before the journey rather than metered or surged.

## Operating Context

- **Airport transfer prices are published** — a fixed price per airport (Heathrow £105, Gatwick £80, Stansted £70, Luton £100, London City £55, Southend £50) appears on the homepage, the airport index and the six airport pages. Confirmed by the owner (14 Aug 2026) as intended and correct. These are headline prices for the most-compared journey; publishing them is a deliberate competitive choice against Uber/Bolt surge pricing.
- **Every other journey is priced individually.** There is no fare calculator and no instant quote: local, school run, corporate, long-distance and cruise transfers are all confirmed personally by staff, usually within the hour, via callback or message. This is deliberate, not a gap to design around.
- Visitors arrive mid-task and often mid-journey — on mobile, on data, sometimes in a hurry or at night.
- The public site feeds an internal admin dashboard: leads, booked jobs, corporate applications, payment links, settings. A quote request becomes a lead an operator prices and sends a payment link for.
- Public surface: home, about, contact, 6 service pages (local taxis, airport transfers, corporate accounts, school runs, long-distance, Tilbury cruise terminal), 9 town pages, 6 airport pages, areas-covered index, quote request, thank-you, quote view, and three legal pages.

## Capabilities and Constraints

- React + Vite + Tailwind v4 + wouter routing; per-page CSS files alongside a token layer in `src/index.css`. Deployed via GitHub → Coolify.
- Every town and airport page carries canonical URLs, OpenGraph tags and JSON-LD structured data. **URLs and structured data must survive any redesign** — these pages earn the traffic.
- The booking form (`BookingForm`) has a `compact` variant used in page sidebars and a full variant on the quote-request page. It is the conversion target sitewide.
- Mobile PageSpeed is a live concern; a previous regression from oversized images and duplicate font loading was fixed on 18 Jul 2026 and must not be reintroduced.
- Published airport prices only; no fare calculator, no instant quoting, no live tracking, no account system, no native app.

## Brand Commitments

- Name: **Lakeside & Purfleet Taxis Ltd**. Phone 01375 383878. WhatsApp +44 7879 956275.
- Existing brand colour is a taxi yellow (`hsl(45 97% 52%)` / `#ffd100`) against near-white and dark navy. Yellow is a genuine brand asset; its current *application* (3px accent stripes on card edges) is not.
- Voice: plain, direct British English. Practical, not salesy. No hype.
- **User-pinned visual direction (14 Aug 2026): "Apple style" — cards and animations.** Recorded as binding. Interpretation belongs to the design layer, not this file.

## Evidence on Hand

Confirmed true by the owner (14 Aug 2026), safe to build on:

- **Trading since 1990** — 30+ years serving Thurrock.
- **Flight monitoring and meet-and-greet** on airport transfers — genuinely offered.
- **Named corporate clients: Thurrock Council and Inchcape.** Confirmed genuine by the owner (14 Aug 2026). These are real, checkable accounts and the strongest trust asset the firm has — a council and a plc chose them. Safe to name on the corporate pages.
- **Published airport prices** — the six fixed fares above are real and honoured.

Explicitly false — must be removed, not merely hidden:

- **The `AggregateRating` star rating in the structured data is fabricated.** Confirmed by the owner (14 Aug 2026): the business has **no aggregate rating and only three reviews in total**. The JSON-LD `AggregateRating` block must be deleted from `src/lib/schema.ts` and every page emitting it. Fabricated review markup is a Google manual-action risk on exactly the pages that earn the traffic. It must never appear as a visual element either.

- **Ten fabricated 5-star reviews are hardcoded as `FALLBACK_REVIEWS` in `src/pages/Home.tsx`** with invented author names, and render as the component's initial state for every visitor. A hardcoded "5.0" score and five filled stars display whenever no live aggregate loads. All invented.

**Owner decision (14 Aug 2026): reviews come live from Google via `/api/reviews`, with no fallback.** `FALLBACK_REVIEWS` and the hardcoded 5.0/5-star display are deleted. When the API returns nothing, the reviews section does not render at all. `AggregateRating` JSON-LD emits only when a real aggregate is returned by that API — never from static values.

Consumer social proof is genuinely thin: three reviews, no aggregate rating, no testimonials, no case studies, no press coverage, no driver photographs, no fleet photography. **The design must not lean on review counts, star ratings, or "trusted by thousands" claims, and must look complete with the reviews section absent.**

Corporate proof is the exception and is strong: **Thurrock Council and Inchcape are real, named accounts** (confirmed 14 Aug 2026). A council and a plc are worth more to a business visitor than any number of consumer reviews, and unlike a star rating they can be verified. Name them on corporate-facing surfaces; do not stretch them into a general "trusted by" claim on consumer pages, where they mean little to someone booking a school run.

Trust is otherwise carried by verifiable facts — trading since 1990, local coverage, published airport prices, fixed-price-before-travel, flight monitoring, meet-and-greet, 24/7 — never by invented social proof.

## Product Principles

1. **The landing page is the town page.** Every town and airport page must independently establish who this firm is, why it's trustworthy, and how to book — it cannot lean on the homepage.
2. **A quote request is the win.** Design decisions resolve in favour of the form being reachable, obvious and low-friction, without hiding the phone and WhatsApp routes.
3. **Human confirmation is the feature.** "We'll call you back with a fixed price" is a trust asset, not an apology for having no pricing engine.
4. **Local is the whole claim.** Specificity about Thurrock places, roads and routes is the substance; generic taxi-industry language dilutes it.
5. **Rankings are revenue.** Structural SEO — URLs, canonicals, structured data, crawlable content — is a hard constraint on visual work, not a later cleanup.

## Accessibility & Inclusion

No formal standard established by the owner. Product-driven baseline: the site is used one-handed, on mobile, outdoors and at night, often by older residents — so tap targets, contrast against bright and dark ambient light, and real text (not text baked into images) are functional requirements, not compliance box-ticking.
