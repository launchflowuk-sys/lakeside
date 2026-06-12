import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { leadsTable } from "./leads";

export const quoteStatusEnum = pgEnum("quote_status", [
  "pending",
  "accepted",
  "expired",
  "cancelled",
]);

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),

  quoteRef: text("quote_ref").notNull().unique(),
  leadId: integer("lead_id")
    .notNull()
    .references(() => leadsTable.id, { onDelete: "cascade" }),

  status: quoteStatusEnum("status").notNull().default("pending"),

  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerMobile: text("customer_mobile").notNull(),

  pickupLocation: text("pickup_location").notNull(),
  destination: text("destination").notNull(),
  viaStops: text("via_stops"),
  journeyDate: text("journey_date").notNull(),
  journeyTime: text("journey_time").notNull(),
  returnRequired: text("return_required").notNull().default("no"),
  returnDate: text("return_date"),
  returnTime: text("return_time"),
  passengers: integer("passengers").notNull().default(1),
  journeyType: text("journey_type").notNull(),

  price: text("price").notNull(),
  priceNotes: text("price_notes"),

  paymentCash: text("payment_cash").default("yes"),
  paymentCard: text("payment_card").default("no"),
  paymentBankTransfer: text("payment_bank_transfer").default("no"),
  bankSortCode: text("bank_sort_code"),
  bankAccountNumber: text("bank_account_number"),
  bankAccountName: text("bank_account_name"),

  validUntil: text("valid_until").notNull(),
  adminMessage: text("admin_message"),

  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
});

export const insertQuoteSchema = createInsertSchema(quotesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  quoteRef: true,
  status: true,
  acceptedAt: true,
});

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotesTable.$inferSelect;
