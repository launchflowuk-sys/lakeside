import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import { logger } from "./logger";

/**
 * Where uploaded driver documents live on disk.
 *
 * In production this must point at a path backed by a host bind mount (see
 * the `api` service in docker-compose.yml) — the container filesystem itself
 * is rebuilt on every Coolify redeploy, so anything written outside the mount
 * is destroyed on the next deploy.
 */
export const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR?.trim() || "./uploads",
);

export const DRIVER_DOCS_DIR = path.join(UPLOAD_DIR, "driver-applications");

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_FILES_PER_APPLICATION = 10;

/**
 * Allowed types, keyed by mime type with the extensions each may legitimately
 * carry. Both halves are checked: a mime type alone is client-supplied and
 * trivially spoofed, and an extension alone says nothing about the bytes.
 */
const ALLOWED_TYPES: Record<string, readonly string[]> = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/heic": [".heic"],
  "image/heif": [".heif"],
};

export const ACCEPTED_UPLOAD_MIME_TYPES = Object.keys(ALLOWED_TYPES);

export function ensureUploadDirs(): void {
  try {
    fs.mkdirSync(DRIVER_DOCS_DIR, { recursive: true });
  } catch (err) {
    // Not fatal at boot: the rest of the site works without uploads, and the
    // upload route surfaces a clean error if the directory is still missing.
    logger.error({ err, dir: DRIVER_DOCS_DIR }, "Could not create upload directory");
  }
}

/** Directory holding one application's documents. */
export function applicationDir(applicationId: number): string {
  return path.join(DRIVER_DOCS_DIR, String(applicationId));
}

/**
 * Resolve a stored file's absolute path, refusing anything that escapes the
 * upload directory. Stored filenames are server-generated UUIDs so traversal
 * should be impossible, but this is the last gate before a filesystem read
 * and costs nothing.
 */
export function resolveStoredFile(
  applicationId: number,
  storedFilename: string,
): string | null {
  const dir = applicationDir(applicationId);
  const resolved = path.resolve(dir, storedFilename);
  const relative = path.relative(DRIVER_DOCS_DIR, resolved);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    logger.warn({ applicationId, storedFilename }, "Rejected out-of-bounds file path");
    return null;
  }
  return resolved;
}

/** Strip any directory component a client may have put in the filename. */
export function safeOriginalName(name: string): string {
  return path.basename(name).replace(/[\r\n\t]/g, "").slice(0, 200) || "document";
}

const storage = multer.diskStorage({
  destination(req, _file, cb) {
    const applicationId = Number((req.params as { id?: string }).id);
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      cb(new Error("Invalid application id"), "");
      return;
    }
    const dir = applicationDir(applicationId);
    fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ALLOWED_TYPES[file.mimetype] ?? [];
    // Fall back to the mime type's canonical extension rather than trusting
    // whatever the client sent.
    const safeExt = allowed.includes(ext) ? ext : (allowed[0] ?? "");
    cb(null, `${crypto.randomUUID()}${safeExt}`);
  },
});

export const driverDocumentUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_BYTES,
    files: MAX_FILES_PER_APPLICATION,
  },
  fileFilter(_req, file, cb) {
    const allowedExtensions = ALLOWED_TYPES[file.mimetype];
    if (!allowedExtensions) {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
      return;
    }
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext && !allowedExtensions.includes(ext)) {
      cb(new Error(`File extension ${ext} does not match its content type`));
      return;
    }
    cb(null, true);
  },
});

/** Best-effort removal of an application's files; never throws. */
export function removeApplicationFiles(applicationId: number): void {
  const dir = applicationDir(applicationId);
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (err) {
    logger.error({ err, applicationId }, "Failed to remove driver application files");
  }
}
