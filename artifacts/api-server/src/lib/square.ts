import { randomUUID } from "node:crypto";
import { SquareClient, SquareEnvironment, SquareError, type Square } from "square";
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

/**
 * Public origin of the customer-facing site, used to build the URL Square
 * sends the buyer back to once they've paid.
 *
 * Resolution order matters here, because getting it wrong sends a paying
 * customer to a dead host — worse than leaving them on Square's receipt:
 *
 *   1. SITE_URL, when the operator has set it explicitly.
 *   2. The Origin of the request that asked for the link. Payment links are
 *      only ever created from the admin panel, which is served by this same
 *      app on the same origin as the customer site — so whatever host the
 *      site is actually reachable on, this matches it with no configuration.
 *   3. The live domain, as a last resort for a request with no Origin header.
 *
 * Trailing slashes are stripped so callers can always join a leading-slash
 * path.
 */
const FALLBACK_SITE_URL = "https://lakesidetaxi.co.uk";

function normaliseOrigin(value: string): string {
  return value.replace(/\/+$/, "");
}

export function siteUrl(path: string, requestOrigin?: string | null): string {
  const configured = process.env.SITE_URL?.trim();
  const base = configured
    ? normaliseOrigin(configured)
    : requestOrigin && /^https?:\/\//.test(requestOrigin)
      ? normaliseOrigin(requestOrigin)
      : FALLBACK_SITE_URL;

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function getSquareClient(): SquareClient | null {
  if (!SQUARE_ACCESS_TOKEN) return null;
  if (!_client) {
    _client = new SquareClient({ token: SQUARE_ACCESS_TOKEN, environment: SQUARE_ENVIRONMENT });
  }
  return _client;
}

/**
 * Square wants E.164. UK numbers are stored here as the customer typed them
 * ("07879 956275", "+44 7879 956275", "01375 383878"), so convert the common
 * shapes and return null for anything else — a malformed number would fail
 * the whole payment-link call, which is far worse than an unfilled field.
 */
function toE164(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (/^\+\d{10,15}$/.test(digits)) return digits;
  if (/^0\d{9,10}$/.test(digits)) return `+44${digits.slice(1)}`;
  if (/^44\d{9,10}$/.test(digits)) return `+${digits}`;
  return null;
}

/** "Sarah Jane Whitfield" -> first "Sarah", last "Jane Whitfield". */
function splitName(full: string): { firstName?: string; lastName?: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
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
  /**
   * Where Square sends the buyer after a successful payment. Without this,
   * Square strands them on its own hosted receipt page with no way back to
   * the site and no sight of what happens next. Square appends its own
   * query params (checkoutId, orderId, transactionId, referenceId) to
   * whatever URL is given here.
   */
  redirectUrl?: string;
  /**
   * Buyer details already known from the quote, so Square's checkout arrives
   * filled in rather than asking the customer to type their name and email a
   * second time. All fields optional — anything missing or unparseable is
   * left out rather than sent as an empty string, which Square rejects.
   */
  prefill?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
}): Promise<CreatedPaymentLink | null> {
  const client = getSquareClient();
  if (!client || !SQUARE_LOCATION_ID) {
    logger.warn("Square not configured — skipping payment link creation");
    return null;
  }

  const buyerPhone = opts.prefill?.phone ? toE164(opts.prefill.phone) : null;
  const buyerName = opts.prefill?.name ? splitName(opts.prefill.name) : {};
  const prePopulatedData: Square.PrePopulatedData = {
    ...(opts.prefill?.email ? { buyerEmail: opts.prefill.email } : {}),
    ...(buyerPhone ? { buyerPhoneNumber: buyerPhone } : {}),
    ...(buyerName.firstName
      ? {
          buyerAddress: {
            firstName: buyerName.firstName,
            ...(buyerName.lastName ? { lastName: buyerName.lastName } : {}),
            country: "GB",
          },
        }
      : {}),
  };

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
      ...(opts.redirectUrl
        ? { checkoutOptions: { redirectUrl: opts.redirectUrl, askForShippingAddress: false } }
        : {}),
      ...(Object.keys(prePopulatedData).length > 0 ? { prePopulatedData } : {}),
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
