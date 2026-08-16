/**
 * Admin deletion calls.
 *
 * Hand-written for the same reason as the driver application client: these
 * endpoints are not in the OpenAPI spec, and adding them would mean
 * regenerating every existing hook in the client for one feature.
 */

/** Path segment under /api/admin — must match the server's TABLES list. */
export type DeletableEntity =
  | "leads"
  | "corporate-applications"
  | "driver-applications"
  | "payment-links";

/** Matches MAX_BULK on the server. */
export const MAX_BULK_DELETE = 200;

async function send(url: string, init: RequestInit): Promise<Response> {
  const response = await fetch(url, init);
  if (!response.ok) {
    let message = `Delete failed (${response.status})`;
    try {
      const body = await response.json();
      if (body && typeof body.error === "string") message = body.error;
    } catch {
      // Keep the status-based message.
    }
    throw new Error(message);
  }
  return response;
}

export function deleteAdminRecord(entity: DeletableEntity, id: number): Promise<Response> {
  return send(`/api/admin/${entity}/${id}`, { method: "DELETE" });
}

export async function bulkDeleteAdminRecords(
  entity: DeletableEntity,
  ids: number[],
): Promise<number> {
  const response = await send(`/api/admin/${entity}/bulk-delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  const body = (await response.json()) as { deleted?: number };
  return body.deleted ?? ids.length;
}

/**
 * What the confirmation dialog warns about, per entity. Deleting a record with
 * consequences beyond its own row should say so before the click, not after.
 */
export const DELETE_CONSEQUENCE: Record<DeletableEntity, string | null> = {
  leads: "Any quotes and email replies attached to these leads will be deleted too.",
  "corporate-applications": null,
  "driver-applications":
    "Every document uploaded with these applications will be permanently erased from the server.",
  "payment-links":
    "This only removes our record of the link. It does not cancel the link in Square, and it does not refund anything already paid.",
};
