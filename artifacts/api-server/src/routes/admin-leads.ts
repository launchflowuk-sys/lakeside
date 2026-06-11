import { Router, type IRouter } from "express";
import { eq, desc, sql, and } from "drizzle-orm";
import { db, leadsTable, leadRepliesTable } from "@workspace/db";
import {
  ListAdminLeadsQueryParams,
  GetAdminLeadParams,
  UpdateAdminLeadParams,
  UpdateAdminLeadBody,
  ReplyToLeadParams,
  ReplyToLeadBody,
  GetLeadRepliesParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { sendAdminReply } from "../lib/email";

const router: IRouter = Router();

function serializeLead(lead: typeof leadsTable.$inferSelect) {
  return {
    id: lead.id,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    status: lead.status,
    journeyType: lead.journeyType,
    pickupLocation: lead.pickupLocation,
    destination: lead.destination,
    viaStops: lead.viaStops,
    journeyDate: lead.journeyDate,
    journeyTime: lead.journeyTime,
    returnRequired: lead.returnRequired,
    returnDate: lead.returnDate,
    returnTime: lead.returnTime,
    passengers: lead.passengers,
    luggage: lead.luggage,
    childSeatsRequired: lead.childSeatsRequired,
    accessibilityRequirements: lead.accessibilityRequirements,
    additionalNotes: lead.additionalNotes,
    fullName: lead.fullName,
    mobile: lead.mobile,
    email: lead.email,
    preferredContactMethod: lead.preferredContactMethod,
    quotedPrice: lead.quotedPrice,
    adminNotes: lead.adminNotes,
    assignedDriver: lead.assignedDriver,
    bookingReference: lead.bookingReference,
  };
}

router.get("/admin/leads", requireAdmin, async (req, res): Promise<void> => {
  const params = ListAdminLeadsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { status, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const whereClause = status
    ? eq(leadsTable.status, status as typeof leadsTable.$inferSelect["status"])
    : undefined;

  const [leads, countResult] = await Promise.all([
    db
      .select()
      .from(leadsTable)
      .where(whereClause)
      .orderBy(desc(leadsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leadsTable)
      .where(whereClause),
  ]);

  res.json({
    leads: leads.map(serializeLead),
    total: countResult[0]?.count ?? 0,
    page,
    limit,
  });
});

router.get("/admin/leads/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAdminLeadParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid lead ID" });
    return;
  }

  const [lead] = await db
    .select()
    .from(leadsTable)
    .where(eq(leadsTable.id, params.data.id));

  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  res.json(serializeLead(lead));
});

router.patch("/admin/leads/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateAdminLeadParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid lead ID" });
    return;
  }

  const body = UpdateAdminLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Partial<typeof leadsTable.$inferInsert> = {};
  if (body.data.status !== undefined) updateData.status = body.data.status;
  if (body.data.adminNotes !== undefined) updateData.adminNotes = body.data.adminNotes;
  if (body.data.quotedPrice !== undefined) updateData.quotedPrice = body.data.quotedPrice;
  if (body.data.assignedDriver !== undefined) updateData.assignedDriver = body.data.assignedDriver;
  if (body.data.bookingReference !== undefined) updateData.bookingReference = body.data.bookingReference;

  const [lead] = await db
    .update(leadsTable)
    .set(updateData)
    .where(eq(leadsTable.id, params.data.id))
    .returning();

  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  res.json(serializeLead(lead));
});

router.post("/admin/leads/:id/reply", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ReplyToLeadParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid lead ID" });
    return;
  }

  const body = ReplyToLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [lead] = await db
    .select()
    .from(leadsTable)
    .where(eq(leadsTable.id, params.data.id));

  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  const sentBy = req.session.adminUserName ?? req.session.adminUserEmail ?? "Admin";

  const [reply] = await db
    .insert(leadRepliesTable)
    .values({
      leadId: lead.id,
      subject: body.data.subject,
      message: body.data.message,
      quotedPrice: body.data.quotedPrice ?? null,
      sentBy,
    })
    .returning();

  if (body.data.quotedPrice) {
    await db
      .update(leadsTable)
      .set({ quotedPrice: body.data.quotedPrice, status: "quoted" })
      .where(eq(leadsTable.id, lead.id));
  }

  await sendAdminReply({
    to: lead.email,
    customerName: lead.fullName,
    subject: body.data.subject,
    message: body.data.message,
    quotedPrice: body.data.quotedPrice,
    journeyFrom: lead.pickupLocation,
    journeyTo: lead.destination,
    journeyDate: lead.journeyDate,
    journeyTime: lead.journeyTime,
  });

  res.json({
    id: reply.id,
    leadId: reply.leadId,
    subject: reply.subject,
    message: reply.message,
    quotedPrice: reply.quotedPrice,
    sentAt: reply.sentAt.toISOString(),
    sentBy: reply.sentBy,
  });
});

router.get("/admin/leads/:id/replies", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetLeadRepliesParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid lead ID" });
    return;
  }

  const replies = await db
    .select()
    .from(leadRepliesTable)
    .where(eq(leadRepliesTable.leadId, params.data.id))
    .orderBy(leadRepliesTable.sentAt);

  res.json(
    replies.map((r) => ({
      id: r.id,
      leadId: r.leadId,
      subject: r.subject,
      message: r.message,
      quotedPrice: r.quotedPrice,
      sentAt: r.sentAt.toISOString(),
      sentBy: r.sentBy,
    }))
  );
});

export default router;
