import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { leadsTable } from "./leads";

export const leadRepliesTable = pgTable("lead_replies", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id")
    .notNull()
    .references(() => leadsTable.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  quotedPrice: text("quoted_price"),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  sentBy: text("sent_by").notNull(),
});

export const insertLeadReplySchema = createInsertSchema(leadRepliesTable).omit({
  id: true,
  sentAt: true,
});

export type InsertLeadReply = z.infer<typeof insertLeadReplySchema>;
export type LeadReply = typeof leadRepliesTable.$inferSelect;
