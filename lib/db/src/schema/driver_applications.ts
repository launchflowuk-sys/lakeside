import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const driverAppStatusEnum = pgEnum("driver_app_status", [
  "new",
  "reviewing",
  "interview",
  "approved",
  "rejected",
  "on_hold",
]);

export const driverApplicationsTable = pgTable("driver_applications", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  status: driverAppStatusEnum("status").notNull().default("new"),

  // ── Applicant ──────────────────────────────────────────────────────────
  fullName:    text("full_name").notNull(),
  email:       text("email").notNull(),
  phone:       text("phone").notNull(),
  addressLine: text("address_line"),
  city:        text("city"),
  postcode:    text("postcode").notNull(),
  rightToWork: text("right_to_work").notNull(),

  // ── Licensing ──────────────────────────────────────────────────────────
  isLicensed:        boolean("is_licensed").notNull().default(false),
  licenceAuthority:  text("licence_authority"),
  phLicenceNumber:   text("ph_licence_number"),
  phLicenceExpiry:   text("ph_licence_expiry"),
  dvlaLicenceNumber: text("dvla_licence_number"),
  dvlaYearsHeld:     text("dvla_years_held"),
  penaltyPoints:     text("penalty_points"),

  // ── Vehicle ────────────────────────────────────────────────────────────
  hasOwnVehicle:  boolean("has_own_vehicle").notNull().default(false),
  vehicleDetails: text("vehicle_details"),

  // ── Experience and availability ────────────────────────────────────────
  yearsExperience: text("years_experience"),
  availability:    text("availability"),
  howHeard:        text("how_heard"),
  additionalInfo:  text("additional_info"),

  // ── Upload handshake ───────────────────────────────────────────────────
  // Issued when the application row is created, so the follow-up multipart
  // request can prove it owns this application without being logged in.
  // Cleared once uploads are finalised, and ignored once expired.
  uploadToken:          text("upload_token"),
  uploadTokenExpiresAt: timestamp("upload_token_expires_at", { withTimezone: true }),

  // ── Admin ──────────────────────────────────────────────────────────────
  adminNotes: text("admin_notes"),
  assignedTo: text("assigned_to"),
});

export const driverApplicationDocumentsTable = pgTable(
  "driver_application_documents",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id")
      .notNull()
      .references(() => driverApplicationsTable.id, { onDelete: "cascade" }),
    docType:          text("doc_type").notNull(),
    originalFilename: text("original_filename").notNull(),
    storedFilename:   text("stored_filename").notNull(),
    mimeType:         text("mime_type").notNull(),
    sizeBytes:        integer("size_bytes").notNull(),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_driver_app_docs_application").on(table.applicationId)],
);

/**
 * Document slots offered on the public form. Kept as a plain list rather than
 * a Postgres enum so adding a document type later is a code change only, with
 * no migration and no risk to existing rows.
 */
export const DRIVER_DOCUMENT_TYPES = [
  "ph_driver_licence",
  "dvla_licence",
  "dbs_certificate",
  "right_to_work",
  "proof_of_address",
  "insurance",
  "mot",
  "v5c",
  "cv",
  "other",
] as const;

export type DriverDocumentType = (typeof DRIVER_DOCUMENT_TYPES)[number];

const optionalText = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((value) => (value === "" ? undefined : value));

/**
 * Public submission payload. Written by hand rather than derived via
 * drizzle-zod so the licensed/unlicensed branch can be enforced here rather
 * than left to the route, and so server-managed columns can never be set by
 * a caller.
 */
export const submitDriverApplicationSchema = z
  .object({
    fullName:    z.string().trim().min(2, "Please enter your full name").max(120),
    email:       z.string().trim().email("Please enter a valid email address").max(200),
    phone:       z.string().trim().min(7, "Please enter a valid phone number").max(40),
    addressLine: optionalText,
    city:        optionalText,
    postcode:    z.string().trim().min(4, "Please enter your postcode").max(12),
    rightToWork: z.enum(["uk_citizen", "settled_status", "visa_with_right_to_work", "other"]),

    isLicensed:        z.boolean(),
    licenceAuthority:  optionalText,
    phLicenceNumber:   optionalText,
    phLicenceExpiry:   optionalText,
    dvlaLicenceNumber: optionalText,
    dvlaYearsHeld:     optionalText,
    penaltyPoints:     optionalText,

    hasOwnVehicle:  z.boolean(),
    vehicleDetails: optionalText,

    yearsExperience: optionalText,
    availability:    optionalText,
    howHeard:        optionalText,
    additionalInfo:  optionalText,

    consent: z.literal(true, {
      message: "Please confirm you agree to us storing your details",
    }),
  })
  .refine(
    (data) => !data.isLicensed || Boolean(data.licenceAuthority && data.phLicenceNumber),
    {
      message:
        "Please tell us which council issued your licence and your badge number",
      path: ["phLicenceNumber"],
    },
  )
  .refine((data) => !data.hasOwnVehicle || Boolean(data.vehicleDetails), {
    message: "Please tell us about your vehicle",
    path: ["vehicleDetails"],
  });

export type SubmitDriverApplication = z.infer<typeof submitDriverApplicationSchema>;
export type DriverApplication = typeof driverApplicationsTable.$inferSelect;
export type DriverApplicationDocument =
  typeof driverApplicationDocumentsTable.$inferSelect;
