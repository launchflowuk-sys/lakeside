import { randomUUID } from "node:crypto";
import { SquareClient, SquareEnvironment, SquareError } from "square";
import { logger } from "./logger";

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;
const SQUARE_ENVIRONMENT =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;

let _client: SquareClient | null = null;

export function isSquareConfigured(): boolean {
  return !!(SQUARE_ACCESS_TOKEN && SQUARE_LOCATION_ID);
}

function getSquareClient(): SquareClient | null {
  if (!SQUARE_ACCESS_TOKEN) return null;
  if (!_client) {
    _client = new SquareClient({ token: SQUARE_ACCESS_TOKEN, environment: SQUARE_ENVIRONMENT });
  }
  return _client;
}

export interface CreatedPaymentLink {
  id: string;
  url: string;
  orderId: string | null;
}

/**
 * Creates a Square-hosted Quick Pay checkout link for a fixed amount.
 * priceMinorUnits is in the smallest currency unit (pence for GBP).
 * Returns null if Square isn't configured or the API call fails — callers
 * decide how to surface that (this never throws for the "not configured"
 * case, since payment links are an optional feature).
 */
export async function createPaymentLink(opts: {
  name: string;
  priceMinorUnits: number;
  description?: string;
}): Promise<CreatedPaymentLink | null> {
  const client = getSquareClient();
  if (!client || !SQUARE_LOCATION_ID) {
    logger.warn("Square not configured — skipping payment link creation");
    return null;
  }

  try {
    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      description: opts.description,
      quickPay: {
        name: opts.name,
        priceMoney: {
          amount: BigInt(opts.priceMinorUnits),
          currency: "GBP",
        },
        locationId: SQUARE_LOCATION_ID,
      },
    });

    const link = response.paymentLink;
    if (!link?.url || !link.id) {
      logger.error({ response }, "Square payment link creation returned no usable link");
      return null;
    }

    return { id: link.id, url: link.url, orderId: link.orderId ?? null };
  } catch (err) {
    if (err instanceof SquareError) {
      logger.error({ err: err.message, statusCode: err.statusCode }, "Square API error creating payment link");
    } else {
      logger.error({ err }, "Unexpected error creating Square payment link");
    }
    return null;
  }
}

export { SQUARE_LOCATION_ID };
