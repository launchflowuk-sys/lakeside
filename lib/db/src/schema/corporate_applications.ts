import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const corporateAppStatusEnum = pgEnum("corporate_app_status", [
  "new",
  "reviewing",
  "approved",
  "rejected",
  "on_hold",
]);

export const organisationTypeEnum = pgEnum("organisation_type", [
  "business",
  "school",
  "council",
  "nhs",
  "charity",
  "other",
]);

export const corporateApplicationsTable = pgTable("corporate_applications", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  status: corporateAppStatusEnum("status").notNull().default("new"),

  companyName:      text("company_name").notNull(),
  organisationType: organisationTypeEnum("organisation_type").notNull(),
  companyAddress:   text("company_address").notNull(),
  city:             text("city").notNull(),
  postcode:         text("postcode").notNull(),
  website:          text("website"),

  contactName: text("contact_name").notNull(),
  jobTitle:    text("job_title"),
  email:       text("email").notNull(),
  phone:       text("phone").notNull(),

  estimatedMonthlyJourneys: text("estimated_monthly_journeys").notNull(),
  journeyTypes:             text("journey_types").notNull(),
  numberOfPassengers:       text("number_of_passengers"),
  preferredBilling:         text("preferred_billing").notNull().default("monthly"),
  contractStartDate:        text("contract_start_date"),
  existingProviderDetails:  text("existing_provider_details"),
  additionalRequirements:   text("additional_requirements"),

  adminNotes: text("admin_notes"),
  assignedTo: text("assigned_to"),
});

export const insertCorporateApplicationSchema = createInsertSchema(
  corporateApplicationsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  adminNotes: true,
  assignedTo: true,
});

export type InsertCorporateApplication = z.infer<typeof insertCorporateApplicationSchema>;
export type CorporateApplication = typeof corporateApplicationsTable.$inferSelect;
