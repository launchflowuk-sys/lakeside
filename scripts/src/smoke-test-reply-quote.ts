/**
 * Smoke test: admin reply form + quote flow
 *
 * Verifies the following criteria end-to-end:
 *   1. Admin can send a reply (subject, message, optional quoted price) — no 500
 *   2. Reply appears in the replies list for the lead
 *   3. Lead status becomes "quoted" when a reply includes a quoted price
 *   4. A formal quote can be created (POST /admin/leads/:id/quote)
 *   5. Customer can accept the quote (POST /quotes/:ref/accept)
 *   6. acceptedAt is stamped; lead status becomes "booked"
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run smoke:reply-quote
 *
 * Requires the API server to be running and DATABASE_URL to be set.
 */

const BASE = process.env.API_BASE_URL ?? "http://localhost:80";

async function post(path: string, body: unknown, cookie?: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  return res;
}

async function get(path: string, cookie?: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
  });
  return res;
}

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`  FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`  PASS: ${msg}`);
}

async function run() {
  console.log("=== Smoke test: reply form + quote flow ===\n");

  // --- Step 1: create a test lead (public endpoint) ---
  console.log("1. Creating test lead...");
  const leadRes = await post("/api/leads", {
    journeyType: "local",
    pickupLocation: "Grays, Essex",
    destination: "Lakeside Shopping Centre",
    journeyDate: "2026-08-01",
    journeyTime: "10:00",
    returnRequired: false,
    passengers: 2,
    childSeatsRequired: false,
    fullName: "Smoke Test Customer",
    mobile: "07700900001",
    email: "smoketest@example.com",
    preferredContactMethod: "email",
  });
  assert(leadRes.status === 201, `POST /api/leads → 201 (got ${leadRes.status})`);
  const lead = (await leadRes.json()) as { id: number };
  const leadId = lead.id;
  console.log(`   Lead ID: ${leadId}\n`);

  // --- Step 2: admin login ---
  console.log("2. Admin login...");
  const loginRes = await post("/api/admin/auth/login", {
    email: "admin@lakesidetaxi.co.uk",
    password: "admin123",
  });
  assert(loginRes.status === 200, `POST /api/admin/auth/login → 200 (got ${loginRes.status})`);
  const setCookie = loginRes.headers.get("set-cookie") ?? "";
  const sessionCookie = setCookie.split(";")[0];
  assert(!!sessionCookie, "Session cookie received");
  console.log();

  // --- Step 3: reply WITHOUT quoted price ---
  console.log("3. Sending reply without quoted price...");
  const reply1Res = await post(
    `/api/admin/leads/${leadId}/reply`,
    { subject: "Re: Your enquiry", message: "Thank you for contacting us.", quotedPrice: null },
    sessionCookie
  );
  assert(reply1Res.status === 200, `POST /api/admin/leads/${leadId}/reply → 200 (got ${reply1Res.status})`);
  const reply1 = (await reply1Res.json()) as { id: number; subject: string };
  assert(reply1.subject === "Re: Your enquiry", "Reply subject matches");
  console.log();

  // --- Step 4: verify reply appears in thread ---
  console.log("4. Verifying reply appears in thread...");
  const repliesRes = await get(`/api/admin/leads/${leadId}/replies`, sessionCookie);
  assert(repliesRes.status === 200, `GET /api/admin/leads/${leadId}/replies → 200 (got ${repliesRes.status})`);
  const replies = (await repliesRes.json()) as { id: number }[];
  assert(replies.length >= 1, "At least one reply in thread");
  console.log();

  // --- Step 5: reply WITH quoted price → lead becomes "quoted" ---
  console.log("5. Sending reply WITH quoted price (should flip status to 'quoted')...");
  const reply2Res = await post(
    `/api/admin/leads/${leadId}/reply`,
    { subject: "Your taxi quote — £45", message: "Your price is £45.", quotedPrice: "£45" },
    sessionCookie
  );
  assert(reply2Res.status === 200, `POST /api/admin/leads/${leadId}/reply (with price) → 200 (got ${reply2Res.status})`);
  const reply2 = (await reply2Res.json()) as { quotedPrice: string | null };
  assert(reply2.quotedPrice === "£45", "Reply quotedPrice stored correctly");

  const leadAfterQuotedRes = await get(`/api/admin/leads/${leadId}`, sessionCookie);
  const leadAfterQuoted = (await leadAfterQuotedRes.json()) as { status: string; quotedPrice: string };
  assert(leadAfterQuoted.status === "quoted", `Lead status is "quoted" (got "${leadAfterQuoted.status}")`);
  assert(leadAfterQuoted.quotedPrice === "£45", `Lead quotedPrice is "£45" (got "${leadAfterQuoted.quotedPrice}")`);
  console.log();

  // --- Step 6: create formal customer quote ---
  console.log("6. Creating formal customer quote...");
  const quoteRes = await post(
    `/api/admin/leads/${leadId}/quote`,
    {
      price: "£45",
      validUntil: "2026-12-31",
      customerName: "Smoke Test Customer",
      customerEmail: "smoketest@example.com",
      customerMobile: "07700900001",
      pickupLocation: "Grays, Essex",
      destination: "Lakeside Shopping Centre",
      journeyDate: "2026-08-01",
      journeyTime: "10:00",
      returnRequired: "no",
      passengers: 2,
      journeyType: "local",
      paymentCash: "yes",
      paymentCard: "no",
      paymentBankTransfer: "no",
    },
    sessionCookie
  );
  assert(quoteRes.status === 201, `POST /api/admin/leads/${leadId}/quote → 201 (got ${quoteRes.status})`);
  const quote = (await quoteRes.json()) as { quoteRef: string; status: string; acceptedAt: string | null };
  assert(/^LPT-\d{4}$/.test(quote.quoteRef), `quoteRef matches LPT-XXXX format (got "${quote.quoteRef}")`);
  assert(quote.status === "pending", `Quote status is "pending" (got "${quote.status}")`);
  assert(quote.acceptedAt === null, "acceptedAt is null before acceptance");
  const quoteRef = quote.quoteRef;
  console.log(`   Quote ref: ${quoteRef}\n`);

  // --- Step 7: customer accepts the quote ---
  console.log("7. Customer accepting the quote...");
  const acceptRes = await post(`/api/quotes/${quoteRef}/accept`, {});
  assert(acceptRes.status === 200, `POST /api/quotes/${quoteRef}/accept → 200 (got ${acceptRes.status})`);
  const accepted = (await acceptRes.json()) as { status: string; acceptedAt: string | null };
  assert(accepted.status === "accepted", `Quote status is "accepted" (got "${accepted.status}")`);
  assert(accepted.acceptedAt !== null, "acceptedAt is stamped after acceptance");
  console.log();

  // --- Step 8: lead status is now "booked" ---
  console.log("8. Verifying lead status is now 'booked'...");
  const finalLeadRes = await get(`/api/admin/leads/${leadId}`, sessionCookie);
  const finalLead = (await finalLeadRes.json()) as { status: string };
  assert(finalLead.status === "booked", `Lead status is "booked" (got "${finalLead.status}")`);
  console.log();

  console.log("=== All checks passed ✓ ===");
}

run().catch((err) => {
  console.error("Smoke test error:", err);
  process.exit(1);
});
