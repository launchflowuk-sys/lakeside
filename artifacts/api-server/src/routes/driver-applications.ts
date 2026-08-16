import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import { eq, and, gt } from "drizzle-orm";
import multer from "multer";
import {
  db,
  driverApplicationsTable,
  driverApplicationDocumentsTable,
  submitDriverApplicationSchema,
  DRIVER_DOCUMENT_TYPES,
  type DriverDocumentType,
} from "@workspace/db";
import { driverDocumentUpload, safeOriginalName, MAX_FILE_BYTES } from "../lib/uploads";
import {
  sendDriverApplicationNotification,
  sendDriverApplicationAck,
} from "../lib/email-driver";

const router: IRouter = Router();

// Driver applications are long to fill in, so a legitimate person will only
// ever submit one or two. Keep the window tight enough to stop scripted spam
// without ever catching a real applicant retrying after a validation error.
const applicationRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

const uploadRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many uploads. Please try again later." },
});

const UPLOAD_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function isDriverDocumentType(value: string): value is DriverDocumentType {
  return (DRIVER_DOCUMENT_TYPES as readonly string[]).includes(value);
}

/**
 * Gate for the document endpoints. The applicant is not logged in, so the
 * only thing proving they own this application is the single-use token handed
 * back when the row was created. Without this, application ids are sequential
 * and anyone could staple files onto someone else's application.
 */
async function requireUploadToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const applicationId = Number(req.params.id);
  const token = req.get("x-upload-token");

  if (!Number.isInteger(applicationId) || applicationId <= 0 || !token) {
    res.status(400).json({ error: "Invalid application reference" });
    return;
  }

  const [application] = await db
    .select()
    .from(driverApplicationsTable)
    .where(
      and(
        eq(driverApplicationsTable.id, applicationId),
        eq(driverApplicationsTable.uploadToken, token),
        gt(driverApplicationsTable.uploadTokenExpiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!application) {
    res.status(403).json({ error: "This upload link is no longer valid" });
    return;
  }

  next();
}

// ── Step 1: the written application ────────────────────────────────────────
// Saved on its own, before any file transfer, so a dropped connection during
// upload never costs the applicant everything they typed.
router.post("/driver-applications", applicationRateLimit, async (req, res): Promise<void> => {
  const parsed = submitDriverApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ err: parsed.error.message }, "Driver application failed validation");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { consent: _consent, ...application } = parsed.data;
  const uploadToken = crypto.randomBytes(32).toString("hex");

  const [created] = await db
    .insert(driverApplicationsTable)
    .values({
      ...application,
      status: "new",
      uploadToken,
      uploadTokenExpiresAt: new Date(Date.now() + UPLOAD_TOKEN_TTL_MS),
    })
    .returning();

  req.log.info({ driverApplicationId: created.id }, "Driver application saved");

  res.status(201).json({
    id: created.id,
    uploadToken,
    maxFileBytes: MAX_FILE_BYTES,
  });
});

// ── Step 2: documents ──────────────────────────────────────────────────────
router.post(
  "/driver-applications/:id/documents",
  uploadRateLimit,
  requireUploadToken,
  (req, res, next) => {
    driverDocumentUpload.array("documents")(req, res, (err: unknown) => {
      if (!err) {
        next();
        return;
      }
      if (err instanceof multer.MulterError) {
        const message =
          err.code === "LIMIT_FILE_SIZE"
            ? `Each file must be ${Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB or smaller`
            : err.code === "LIMIT_FILE_COUNT"
              ? "Too many files"
              : "Upload failed";
        res.status(400).json({ error: message });
        return;
      }
      req.log.warn({ err }, "Driver document upload rejected");
      res.status(400).json({
        error: err instanceof Error ? err.message : "Upload failed",
      });
    });
  },
  async (req, res): Promise<void> => {
    const applicationId = Number(req.params.id);
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];

    if (files.length === 0) {
      res.status(400).json({ error: "No files were uploaded" });
      return;
    }

    // Document types arrive alongside the files, positionally. Anything
    // unrecognised is stored as "other" rather than rejected — the file is
    // already on disk and a mislabelled document is better than a failed
    // application.
    const rawTypes = req.body?.docTypes;
    const docTypes: string[] = Array.isArray(rawTypes)
      ? rawTypes.map(String)
      : typeof rawTypes === "string"
        ? [rawTypes]
        : [];

    const rows = files.map((file, index) => {
      const candidate = docTypes[index] ?? "other";
      return {
        applicationId,
        docType: isDriverDocumentType(candidate) ? candidate : "other",
        originalFilename: safeOriginalName(file.originalname),
        storedFilename: file.filename,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      };
    });

    await db.insert(driverApplicationDocumentsTable).values(rows);

    req.log.info(
      { driverApplicationId: applicationId, count: rows.length },
      "Driver application documents stored",
    );

    res.status(201).json({ uploaded: rows.length });
  },
);

// ── Step 3: finalise ───────────────────────────────────────────────────────
// Burns the upload token and sends the notifications. Called by the frontend
// whether or not any documents were attached.
router.post(
  "/driver-applications/:id/complete",
  uploadRateLimit,
  requireUploadToken,
  async (req, res): Promise<void> => {
    const applicationId = Number(req.params.id);

    const [application] = await db
      .update(driverApplicationsTable)
      .set({ uploadToken: null, uploadTokenExpiresAt: null })
      .where(eq(driverApplicationsTable.id, applicationId))
      .returning();

    const documents = await db
      .select()
      .from(driverApplicationDocumentsTable)
      .where(eq(driverApplicationDocumentsTable.applicationId, applicationId));

    try {
      await Promise.all([
        sendDriverApplicationNotification(application, documents),
        sendDriverApplicationAck(application),
      ]);
    } catch (err) {
      // The application is already saved and visible in the admin panel, so a
      // dead SMTP server must never turn into a failed submission.
      req.log.error(
        { err, driverApplicationId: applicationId },
        "Failed to send driver application emails",
      );
    }

    res.status(200).json({ ok: true });
  },
);

export default router;
