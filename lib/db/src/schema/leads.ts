import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "quoted",
  "booked",
  "completed",
  "cancelled",
  "archived",
]);

export const journeyTypeEnum = pgEnum("journey_type", [
  "local",
  "airport",
  "school_run",
  "corporate",
  "cruise_terminal",
  "other",
]);

export const contactMethodEnum = pgEnum("contact_method", [
  "phone",
  "whatsapp",
  "email",
]);

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  status: leadStatusEnum("status").notNull().default("new"),

  journeyType: journeyTypeEnum("journey_type").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  destination: text("destination").notNull(),
  viaStops: text("via_stops"),

  journeyDate: text("journey_date").notNull(),
  journeyTime: text("journey_time").notNull(),

  returnRequired: boolean("return_required").notNull().default(false),
  returnDate: text("return_date"),
  returnTime: text("return_time"),

  passengers: integer("passengers").notNull().default(1),
  luggage: text("luggage"),
  childSeatsRequired: boolean("child_seats_required").notNull().default(false),
  accessibilityRequirements: text("accessibility_requirements"),
  additionalNotes: text("additional_notes"),

  fullName: text("full_name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  preferredContactMethod: contactMethodEnum("preferred_contact_method")
    .notNull()
    .default("phone"),

  quotedPrice: text("quoted_price"),
  adminNotes: text("admin_notes"),
  assignedDriver: text("assigned_driver"),
  bookingReference: text("booking_reference"),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  quotedPrice: true,
  adminNotes: true,
  assignedDriver: true,
  bookingReference: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
