import { Router, type IRouter } from "express";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  leadsTable,
  corporateApplicationsTable,
  driverApplicationsTable,
  adhocPaymentLinksTable,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import { removeApplicationFiles } from "../lib/uploads";

/**
 * Every destructive admin operation lives here rather than being spread across
 * the four entity routers. Deletion is the one thing on this dashboard that
 * cannot be undone, so it is worth being able to read all of it in one place.
 *
 * Single-record deletes for corporate and driver applications already exist in
 * their own routers and are deliberately not repeated here — Express matches
 * the first route registered, so a duplicate would silently shadow one of them.
 */

const router: IRouter = Router();

/** Capped so one request cannot try to remove the entire table by accident. */
const MAX_BULK = 200;

const BulkBody = z.object({
  ids: z.array(z.number().int().positive()).min(1).max(MAX_BULK),
});

function parseId(raw: string | string[] | undefined): number | null {
  if (typeof raw !== "string") return null;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

interface DeletableTable {
  /** Path segment, e.g. "leads" for /admin/leads. */
  segment: string;
  table:
    | typeof leadsTable
    | typeof corporateApplicationsTable
    | typeof driverApplicationsTable
    | typeof adhocPaymentLinksTable;
  label: string;
  /** Single-record DELETE already provided by another router. */
  singleHandledElsewhere?: boolean;
  /**
   * Runs before the rows go, for records with state outside the database.
   * Files are removed first: if the row went first and the unlink then failed,
   * the files would be orphaned on disk with nothing left pointing at them.
   */
  beforeDelete?: (ids: number[]) => void;
}

const TABLES: DeletableTable[] = [
  { segment: "leads", table: leadsTable, label: "Lead" },
  {
    segment: "corporate-applications",
    table: corporateApplicationsTable,
    label: "Corporate application",
    singleHandledElsewhere: true,
  },
  {
    segment: "driver-applications",
    table: driverApplicationsTable,
    label: "Driver application",
    singleHandledElsewhere: true,
    beforeDelete: (ids) => ids.forEach(removeApplicationFiles),
  },
  {
    segment: "payment-links",
    table: adhocPaymentLinksTable,
    label: "Payment link",
  },
];

for (const entity of TABLES) {
  if (!entity.singleHandledElsewhere) {
    router.delete(`/admin/${entity.segment}/:id`, requireAdmin, async (req, res): Promise<void> => {
      const id = parseId(req.params.id);
      if (id === null) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }

      entity.beforeDelete?.([id]);

      const [deleted] = await db
        .delete(entity.table)
        .where(eq(entity.table.id, id))
        .returning({ id: entity.table.id });

      if (!deleted) {
        res.status(404).json({ error: `${entity.label} not found` });
        return;
      }

      req.log.info(
        { entity: entity.segment, id, admin: req.session.adminUserEmail },
        "Admin deleted a record",
      );
      res.status(204).end();
    });
  }

  router.post(
    `/admin/${entity.segment}/bulk-delete`,
    requireAdmin,
    async (req, res): Promise<void> => {
      const parsed = BulkBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: `Select between 1 and ${MAX_BULK} records to delete.`,
        });
        return;
      }

      const { ids } = parsed.data;
      entity.beforeDelete?.(ids);

      const deleted = await db
        .delete(entity.table)
        .where(inArray(entity.table.id, ids))
        .returning({ id: entity.table.id });

      req.log.warn(
        {
          entity: entity.segment,
          requested: ids.length,
          deleted: deleted.length,
          admin: req.session.adminUserEmail,
        },
        "Admin bulk-deleted records",
      );

      res.json({ deleted: deleted.length });
    },
  );
}

export default router;
