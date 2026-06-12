import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, leadsTable, quotesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

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
    createdAt: q.createdAt.toISOString(),
  };
}

router.post("/admin/leads/:id/quote", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const leadId = parseInt(rawId, 10);
  if (isNaN(leadId)) { res.status(400).json({ error: "Invalid lead ID" }); return; }

  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, leadId));
  if (!lead) { res.status(404).json({ error: "Lead not found" }); return; }

  const body = req.body;
  if (!body.price || !body.validUntil) {
    res.status(400).json({ error: "price and validUntil are required" });
    return;
  }

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

router.get("/quotes/:ref", async (req, res): Promise<void> => {
  const ref = Array.isArray(req.params.ref) ? req.params.ref[0] : req.params.ref;
  const [quote] = await db.select().from(quotesTable).where(eq(quotesTable.quoteRef, ref));
  if (!quote) { res.status(404).json({ error: "Quote not found" }); return; }
  res.json(serializeQuote(quote));
});

router.post("/quotes/:ref/accept", async (req, res): Promise<void> => {
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

  await db.update(leadsTable)
    .set({ status: "booked" })
    .where(eq(leadsTable.id, quote.leadId));

  res.json(serializeQuote(updated));
});

export default router;
