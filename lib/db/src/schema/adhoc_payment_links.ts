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

export const adhocPaymentLinkStatusEnum = pgEnum("adhoc_payment_link_status", [
  "pending",
  "paid",
]);

// Payment links created by an admin for an arbitrary amount, not tied to
// any lead or quote (e.g. a one-off charge, a deposit, a custom job).
export const adhocPaymentLinksTable = pgTable("adhoc_payment_links", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

  status: adhocPaymentLinkStatusEnum("status").notNull().default("pending"),

  // Minor currency units (pence for GBP) - same convention as Square itself
  // uses, avoids the free-text price parsing quotes.price needs.
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),

  squarePaymentLinkUrl: text("square_payment_link_url"),
  squareOrderId: text("square_order_id"),

  createdBy: text("created_by").notNull(),
});

export const insertAdhocPaymentLinkSchema = createInsertSchema(adhocPaymentLinksTable).omit({
  id: true,
  createdAt: true,
  status: true,
  squarePaymentLinkUrl: true,
  squareOrderId: true,
});

export type InsertAdhocPaymentLink = z.infer<typeof insertAdhocPaymentLinkSchema>;
export type AdhocPaymentLink = typeof adhocPaymentLinksTable.$inferSelect;
