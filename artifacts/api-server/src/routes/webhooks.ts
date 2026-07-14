import { Router, type IRouter, type Request } from "express";
import rateLimit from "express-rate-limit";
import { eq } from "drizzle-orm";
import { WebhooksHelper } from "square";
import { db, quotesTable } from "@workspace/db";
import { markQuotePaid } from "./quotes";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Webhook traffic comes from Square's own servers, not end users, and Square
// retries deliveries that don't get a fast 200 — a low per-IP limit like the
// customer-facing routes use would risk throttling legitimate retries.
const webhookRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests." },
});

const SQUARE_WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
const SQUARE_WEBHOOK_NOTIFICATION_URL = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;

// Square's webhook payloads are raw REST JSON (snake_case), not the SDK's
// camelCase response types — this is what Square actually sends over the wire.
interface SquareWebhookEvent {
  type: string;
  data?: {
    type?: string;
    object?: {
      payment?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
  };
}

// The raw body is stashed by express.json()'s verify callback in app.ts —
// scoped locally here rather than a global Express.Request augmentation,
// which didn't resolve reliably across this pnpm workspace's module graph.
interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

router.post("/webhooks/square", webhookRateLimit, async (req: RequestWithRawBody, res): Promise<void> => {
  if (!SQUARE_WEBHOOK_SIGNATURE_KEY || !SQUARE_WEBHOOK_NOTIFICATION_URL) {
    logger.error("Square webhook received but signature key / notification URL not configured — rejecting");
    res.status(503).json({ error: "Webhook not configured" });
    return;
  }

  const signatureHeader = req.headers["x-square-hmacsha256-signature"];
  if (!req.rawBody || typeof signatureHeader !== "string") {
    res.status(400).json({ error: "Missing signature or body" });
    return;
  }

  const isValid = await WebhooksHelper.verifySignature({
    requestBody: req.rawBody.toString("utf8"),
    signatureHeader,
    signatureKey: SQUARE_WEBHOOK_SIGNATURE_KEY,
    notificationUrl: SQUARE_WEBHOOK_NOTIFICATION_URL,
  });

  if (!isValid) {
    logger.warn("Square webhook signature verification failed — rejecting");
    res.status(403).json({ error: "Invalid signature" });
    return;
  }

  const event = req.body as SquareWebhookEvent;

  // Acknowledge everything we don't act on immediately, so Square doesn't
  // treat it as a failed delivery and keep retrying.
  if (event.type !== "payment.updated") {
    res.status(200).json({ received: true });
    return;
  }

  const payment = event.data?.object?.payment;
  if (!payment || payment.status !== "COMPLETED" || !payment.order_id) {
    res.status(200).json({ received: true });
    return;
  }

  const [quote] = await db.select().from(quotesTable).where(eq(quotesTable.squareOrderId, payment.order_id));

  if (!quote) {
    // Not necessarily an error — could be an ad-hoc payment link (unrelated
    // to any quote) or an order this app didn't create. Acknowledge either way.
    res.status(200).json({ received: true });
    return;
  }

  if (quote.status === "pending" || quote.status === "accepted") {
    // Paying online can happen without ever clicking "Accept This Quote" —
    // a completed payment is itself an implicit acceptance.
    if (!quote.acceptedAt) {
      await db.update(quotesTable).set({ acceptedAt: new Date() }).where(eq(quotesTable.id, quote.id));
    }
    await markQuotePaid(quote);
    logger.info({ quoteRef: quote.quoteRef, orderId: payment.order_id }, "Quote marked paid via Square webhook");
  } else {
    logger.warn({ quoteRef: quote.quoteRef, status: quote.status }, "Square webhook payment completed but quote already past accepted/pending — skipping");
  }

  res.status(200).json({ received: true });
});

export default router;
