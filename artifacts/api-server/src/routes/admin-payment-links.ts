import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { db, adhocPaymentLinksTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import { createPaymentLink } from "../lib/square";
import { sendPaymentLinkEmail } from "../lib/email";

const router: IRouter = Router();

const paymentLinkRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const CreatePaymentLinkBody = z.object({
  // Pence, not pounds — the admin form converts before sending, same
  // convention Square itself uses, avoids free-text price parsing.
  amount: z.number().int().positive(),
  description: z.string().min(1),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
});

function serializeAdhocPaymentLink(l: typeof adhocPaymentLinksTable.$inferSelect) {
  return {
    id: l.id,
    status: l.status,
    amount: l.amount,
    description: l.description,
    customerName: l.customerName,
    customerEmail: l.customerEmail,
    squarePaymentLinkUrl: l.squarePaymentLinkUrl,
    createdBy: l.createdBy,
    createdAt: l.createdAt.toISOString(),
  };
}

function formatPence(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

router.get("/admin/payment-links", requireAdmin, async (_req, res): Promise<void> => {
  const links = await db.select().from(adhocPaymentLinksTable).orderBy(desc(adhocPaymentLinksTable.createdAt));
  res.json({ paymentLinks: links.map(serializeAdhocPaymentLink) });
});

router.post("/admin/payment-links", requireAdmin, paymentLinkRateLimit, async (req, res): Promise<void> => {
  const parsed = CreatePaymentLinkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const body = parsed.data;

  const link = await createPaymentLink({
    name: body.description,
    priceMinorUnits: body.amount,
    description: body.description,
  });

  if (!link) {
    res.status(502).json({ error: "Square is not configured, or the payment link could not be created. Check server logs." });
    return;
  }

  const [created] = await db.insert(adhocPaymentLinksTable).values({
    amount: body.amount,
    description: body.description,
    customerName: body.customerName ?? null,
    customerEmail: body.customerEmail ?? null,
    squarePaymentLinkUrl: link.url,
    squareOrderId: link.orderId,
    createdBy: req.session.adminUserEmail ?? "admin",
  }).returning();

  if (body.customerEmail) {
    try {
      await sendPaymentLinkEmail({
        to: body.customerEmail,
        customerName: body.customerName,
        description: body.description,
        amountFormatted: formatPence(body.amount),
        paymentLinkUrl: link.url,
      });
    } catch (err) {
      req.log.error({ err }, "Failed to send payment link email");
    }
  }

  res.status(201).json(serializeAdhocPaymentLink(created));
});

export default router;
