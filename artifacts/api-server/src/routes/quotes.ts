import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { eq } from "drizzle-orm";
import { db, leadsTable, quotesTable } from "@workspace/db";
import { CreateQuoteBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { quoteRefRateLimit } from "../middlewares/quoteRefRateLimit";
import { createPaymentLink } from "../lib/square";

const router: IRouter = Router();

const quoteIpRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

function generateRef(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `LPT-${num}`;
}

function serializeQuote(q: typeof quotesTable.$inferSelect) {
  return {
    id: q.id,
    quoteRef: q.quoteRef,
    leadId: q.leadId,
    status: q.status,
    customerName: q.customerName,
    customerEmail: q.customerEmail,
    customerMobile: q.customerMobile,
    pickupLocation: q.pickupLocation,
    destination: q.destination,
    viaStops: q.viaStops,
    journeyDate: q.journeyDate,
    journeyTime: q.journeyTime,
    returnRequired: q.returnRequired,
    returnDate: q.returnDate,
    returnTime: q.returnTime,
    passengers: q.passengers,
    journeyType: q.journeyType,
    price: q.price,
    priceNotes: q.priceNotes,
    paymentCash: q.paymentCash,
    paymentCard: q.paymentCard,
    paymentBankTransfer: q.paymentBankTransfer,
    bankSortCode: q.bankSortCode,
    bankAccountNumber: q.bankAccountNumber,
    bankAccountName: q.bankAccountName,
    validUntil: q.validUntil,
    adminMessage: q.adminMessage,
    acceptedAt: q.acceptedAt ? q.acceptedAt.toISOString() : null,
    paidAt: q.paidAt ? q.paidAt.toISOString() : null,
    squarePaymentLinkUrl: q.squarePaymentLinkUrl,
    createdAt: q.createdAt.toISOString(),
  };
}

// Free-text price ("£95", "95.50", "95") -> minor currency units (pence).
// Returns null if it can't be parsed into a positive amount.
function parsePriceToMinorUnits(price: string): number | null {
  const cleaned = price.replace(/[^0-9.]/g, "");
  const value = parseFloat(cleaned);
  if (isNaN(value) || value <= 0) return null;
  return Math.round(value * 100);
}

// Shared by the admin "Mark Payment Received" action and the Square webhook
// (once payment is confirmed by either path) — one place that moves a quote
// to "paid" and cascades the lead to "booked", so the two paths can never
// drift out of sync with each other.
export async function markQuotePaid(quote: typeof quotesTable.$inferSelect) {
  const [updated] = await db.update(quotesTable)
    .set({ status: "paid", paidAt: new Date() })
    .where(eq(quotesTable.id, quote.id))
    .returning();

  await db.update(leadsTable)
    .set({ status: "booked" })
    .where(eq(leadsTable.id, quote.leadId));

  return updated;
}

router.post("/admin/leads/:id/quote", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const leadId = parseInt(rawId, 10);
  if (isNaN(leadId)) { res.status(400).json({ error: "Invalid lead ID" }); return; }

  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, leadId));
  if (!lead) { res.status(404).json({ error: "Lead not found" }); return; }

  const parsed = CreateQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const body = parsed.data;

  let quoteRef = generateRef();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await db.select().from(quotesTable).where(eq(quotesTable.quoteRef, quoteRef));
    if (existing.length === 0) break;
    quoteRef = generateRef();
    attempts++;
  }

  const [quote] = await db.insert(quotesTable).values({
    quoteRef,
    leadId,
    customerName: body.customerName ?? lead.fullName,
    customerEmail: body.customerEmail ?? lead.email,
    customerMobile: body.customerMobile ?? lead.mobile,
    pickupLocation: body.pickupLocation ?? lead.pickupLocation,
    destination: body.destination ?? lead.destination,
    viaStops: body.viaStops ?? lead.viaStops ?? null,
    journeyDate: body.journeyDate ?? lead.journeyDate,
    journeyTime: body.journeyTime ?? lead.journeyTime,
    returnRequired: body.returnRequired ?? (lead.returnRequired ? "yes" : "no"),
    returnDate: body.returnDate ?? lead.returnDate ?? null,
    returnTime: body.returnTime ?? lead.returnTime ?? null,
    passengers: body.passengers ?? lead.passengers,
    journeyType: body.journeyType ?? lead.journeyType,
    price: body.price,
    priceNotes: body.priceNotes ?? null,
    paymentCash: body.paymentCash ?? "yes",
    paymentCard: body.paymentCard ?? "no",
    paymentBankTransfer: body.paymentBankTransfer ?? "no",
    bankSortCode: body.bankSortCode ?? null,
    bankAccountNumber: body.bankAccountNumber ?? null,
    bankAccountName: body.bankAccountName ?? null,
    validUntil: body.validUntil,
    adminMessage: body.adminMessage ?? null,
  }).returning();

  await db.update(leadsTable)
    .set({ status: "quoted", quotedPrice: body.price })
    .where(eq(leadsTable.id, leadId));

  res.status(201).json(serializeQuote(quote));
});

router.get("/admin/leads/:id/quote", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const leadId = parseInt(rawId, 10);
  if (isNaN(leadId)) { res.status(400).json({ error: "Invalid lead ID" }); return; }

  const [quote] = await db.select().from(quotesTable)
    .where(eq(quotesTable.leadId, leadId))
    .orderBy(quotesTable.createdAt)
    .limit(1);

  if (!quote) { res.status(404).json({ error: "No quote found for this lead" }); return; }

  res.json(serializeQuote(quote));
});

router.get("/quotes/:ref", quoteIpRateLimit, quoteRefRateLimit, async (req, res): Promise<void> => {
  const ref = Array.isArray(req.params.ref) ? req.params.ref[0] : req.params.ref;
  const [quote] = await db.select().from(quotesTable).where(eq(quotesTable.quoteRef, ref));
  if (!quote) { res.status(404).json({ error: "Quote not found" }); return; }
  res.json(serializeQuote(quote));
});

router.post("/quotes/:ref/accept", quoteIpRateLimit, quoteRefRateLimit, async (req, res): Promise<void> => {
  const ref = Array.isArray(req.params.ref) ? req.params.ref[0] : req.params.ref;
  const [quote] = await db.select().from(quotesTable).where(eq(quotesTable.quoteRef, ref));
  if (!quote) { res.status(404).json({ error: "Quote not found" }); return; }
  if (quote.status !== "pending") {
    res.status(400).json({ error: `Quote is already ${quote.status}` });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  if (quote.validUntil < today) {
    await db.update(quotesTable).set({ status: "expired" }).where(eq(quotesTable.quoteRef, ref));
    res.status(400).json({ error: "This quote has expired" });
    return;
  }

  const [updated] = await db.update(quotesTable)
    .set({ status: "accepted", acceptedAt: new Date() })
    .where(eq(quotesTable.quoteRef, ref))
    .returning();

  // Accepting confirms intent to proceed, not payment — the lead stays
  // "quoted" until payment is actually received (see markQuotePaid), whether
  // that's an admin manually confirming cash/bank transfer or a completed
  // Square payment.

  res.json(serializeQuote(updated));
});

router.patch("/admin/leads/:id/quote/mark-paid", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const leadId = parseInt(rawId, 10);
  if (isNaN(leadId)) { res.status(400).json({ error: "Invalid lead ID" }); return; }

  const [quote] = await db.select().from(quotesTable)
    .where(eq(quotesTable.leadId, leadId))
    .orderBy(quotesTable.createdAt)
    .limit(1);

  if (!quote) { res.status(404).json({ error: "No quote found for this lead" }); return; }

  if (quote.status !== "accepted") {
    res.status(400).json({ error: `Quote must be accepted before it can be marked paid (currently ${quote.status})` });
    return;
  }

  const updated = await markQuotePaid(quote);
  res.json(serializeQuote(updated));
});

router.post("/admin/leads/:id/quote/:quoteId/payment-link", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawQuoteId = Array.isArray(req.params.quoteId) ? req.params.quoteId[0] : req.params.quoteId;
  const leadId = parseInt(rawId, 10);
  const quoteId = parseInt(rawQuoteId, 10);
  if (isNaN(leadId) || isNaN(quoteId)) { res.status(400).json({ error: "Invalid lead or quote ID" }); return; }

  const [quote] = await db.select().from(quotesTable).where(eq(quotesTable.id, quoteId));
  if (!quote || quote.leadId !== leadId) { res.status(404).json({ error: "Quote not found for this lead" }); return; }

  if (quote.status === "expired" || quote.status === "cancelled" || quote.status === "paid") {
    res.status(400).json({ error: `Cannot create a payment link for a quote that is ${quote.status}` });
    return;
  }

  const minorUnits = parsePriceToMinorUnits(quote.price);
  if (minorUnits === null) {
    res.status(400).json({ error: `Quote price "${quote.price}" could not be parsed into a payment amount` });
    return;
  }

  const link = await createPaymentLink({
    name: `Taxi booking ${quote.quoteRef}`,
    priceMinorUnits: minorUnits,
    description: `Lakeside & Purfleet Taxis — quote ${quote.quoteRef}`,
  });

  if (!link) {
    res.status(502).json({ error: "Square is not configured, or the payment link could not be created. Check server logs." });
    return;
  }

  const [updated] = await db.update(quotesTable)
    .set({
      squarePaymentLinkUrl: link.url,
      squareOrderId: link.orderId,
      squareCheckoutId: link.id,
    })
    .where(eq(quotesTable.id, quoteId))
    .returning();

  res.json(serializeQuote(updated));
});

export default router;
