import { Router, type IRouter } from "express";
import fs from "node:fs";
import { eq, desc, sql, and } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  driverApplicationsTable,
  driverApplicationDocumentsTable,
} from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import { resolveStoredFile, removeApplicationFiles } from "../lib/uploads";

const router: IRouter = Router();

const DRIVER_APP_STATUSES = [
  "new",
  "reviewing",
  "interview",
  "approved",
  "rejected",
  "on_hold",
] as const;

const ListParams = z.object({
  status: z.enum(DRIVER_APP_STATUSES).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const UpdateBody = z.object({
  status: z.enum(DRIVER_APP_STATUSES).optional(),
  adminNotes: z.string().max(5000).nullable().optional(),
  assignedTo: z.string().max(200).nullable().optional(),
});

type DriverApplicationRow = typeof driverApplicationsTable.$inferSelect;
type DriverDocumentRow = typeof driverApplicationDocumentsTable.$inferSelect;

/**
 * Never leak the upload token to the admin UI — it is a bearer credential that
 * would let anyone holding it attach files to the application.
 */
function serializeApplication(app: DriverApplicationRow) {
  return {
    id: app.id,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    status: app.status,
    fullName: app.fullName,
    email: app.email,
    phone: app.phone,
    addressLine: app.addressLine,
    city: app.city,
    postcode: app.postcode,
    rightToWork: app.rightToWork,
    isLicensed: app.isLicensed,
    licenceAuthority: app.licenceAuthority,
    phLicenceNumber: app.phLicenceNumber,
    phLicenceExpiry: app.phLicenceExpiry,
    dvlaLicenceNumber: app.dvlaLicenceNumber,
    dvlaYearsHeld: app.dvlaYearsHeld,
    penaltyPoints: app.penaltyPoints,
    hasOwnVehicle: app.hasOwnVehicle,
    vehicleDetails: app.vehicleDetails,
    yearsExperience: app.yearsExperience,
    availability: app.availability,
    howHeard: app.howHeard,
    additionalInfo: app.additionalInfo,
    adminNotes: app.adminNotes,
    assignedTo: app.assignedTo,
  };
}

function serializeDocument(doc: DriverDocumentRow) {
  return {
    id: doc.id,
    docType: doc.docType,
    originalFilename: doc.originalFilename,
    mimeType: doc.mimeType,
    sizeBytes: doc.sizeBytes,
    uploadedAt: doc.uploadedAt.toISOString(),
  };
}

router.get("/admin/driver-applications", requireAdmin, async (req, res): Promise<void> => {
  const params = ListParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { status, page, limit } = params.data;
  const offset = (page - 1) * limit;
  const whereClause = status ? eq(driverApplicationsTable.status, status) : undefined;

  const [applications, countResult] = await Promise.all([
    db
      .select()
      .from(driverApplicationsTable)
      .where(whereClause)
      .orderBy(desc(driverApplicationsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(driverApplicationsTable)
      .where(whereClause),
  ]);

  // One grouped count rather than a query per row, so the list stays a
  // constant two round trips however many applications are on the page.
  const ids = applications.map((app) => app.id);
  const docCounts = new Map<number, number>();
  if (ids.length > 0) {
    const counts = await db
      .select({
        applicationId: driverApplicationDocumentsTable.applicationId,
        count: sql<number>`count(*)::int`,
      })
      .from(driverApplicationDocumentsTable)
      .where(sql`${driverApplicationDocumentsTable.applicationId} = ANY(${ids})`)
      .groupBy(driverApplicationDocumentsTable.applicationId);
    for (const entry of counts) docCounts.set(entry.applicationId, entry.count);
  }

  res.json({
    applications: applications.map((app) => ({
      ...serializeApplication(app),
      documentCount: docCounts.get(app.id) ?? 0,
    })),
    total: countResult[0]?.count ?? 0,
    page,
    limit,
  });
});

router.get("/admin/driver-applications/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid application id" });
    return;
  }

  const [application] = await db
    .select()
    .from(driverApplicationsTable)
    .where(eq(driverApplicationsTable.id, id))
    .limit(1);

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  const documents = await db
    .select()
    .from(driverApplicationDocumentsTable)
    .where(eq(driverApplicationDocumentsTable.applicationId, id))
    .orderBy(driverApplicationDocumentsTable.id);

  res.json({
    ...serializeApplication(application),
    documents: documents.map(serializeDocument),
  });
});

router.patch("/admin/driver-applications/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid application id" });
    return;
  }

  const parsed = UpdateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const [updated] = await db
    .update(driverApplicationsTable)
    .set(parsed.data)
    .where(eq(driverApplicationsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(serializeApplication(updated));
});

// Documents are streamed through this authenticated route and are never served
// from nginx as static files — otherwise a guessed filename would expose
// someone's DBS certificate or passport to the open internet.
router.get(
  "/admin/driver-applications/:id/documents/:docId/download",
  requireAdmin,
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    const docId = Number(req.params.docId);
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(docId) || docId <= 0) {
      res.status(400).json({ error: "Invalid document reference" });
      return;
    }

    const [doc] = await db
      .select()
      .from(driverApplicationDocumentsTable)
      .where(
        and(
          eq(driverApplicationDocumentsTable.id, docId),
          eq(driverApplicationDocumentsTable.applicationId, id),
        ),
      )
      .limit(1);

    if (!doc) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const absolutePath = resolveStoredFile(id, doc.storedFilename);
    if (!absolutePath || !fs.existsSync(absolutePath)) {
      req.log.error({ docId, applicationId: id }, "Driver document missing from disk");
      res.status(404).json({ error: "Document file is no longer available" });
      return;
    }

    res.setHeader("Content-Type", doc.mimeType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Quotes and backslashes escaped so an odd filename cannot break out of
    // the header value.
    const safeName = doc.originalFilename.replace(/["\\]/g, "_");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);

    fs.createReadStream(absolutePath)
      .on("error", (err) => {
        req.log.error({ err, docId }, "Failed streaming driver document");
        if (!res.headersSent) res.status(500).end();
        else res.destroy();
      })
      .pipe(res);
  },
);

// Hard delete, for data-protection requests. Files go first: if the row were
// removed first and the unlink then failed, the files would be orphaned on
// disk with nothing left pointing at them.
router.delete("/admin/driver-applications/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid application id" });
    return;
  }

  removeApplicationFiles(id);

  const [deleted] = await db
    .delete(driverApplicationsTable)
    .where(eq(driverApplicationsTable.id, id))
    .returning({ id: driverApplicationsTable.id });

  if (!deleted) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  req.log.info({ driverApplicationId: id }, "Driver application deleted");
  res.status(204).end();
});

export default router;
