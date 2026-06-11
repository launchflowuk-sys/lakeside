import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, corporateApplicationsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import { z } from "zod";
import { serializeCorporateApp } from "./corporate-applications";

const router: IRouter = Router();

const ListParams = z.object({
  status: z.enum(["new", "reviewing", "approved", "rejected", "on_hold"]).optional(),
  page:   z.coerce.number().int().positive().default(1),
  limit:  z.coerce.number().int().positive().max(100).default(20),
});

const IdParam = z.object({ id: z.number().int().positive() });

const UpdateBody = z.object({
  status:     z.enum(["new", "reviewing", "approved", "rejected", "on_hold"]).optional(),
  adminNotes: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
});

router.get("/admin/corporate-applications", requireAdmin, async (req, res): Promise<void> => {
  const params = ListParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { status, page, limit } = params.data;
  const offset = (page - 1) * limit;

  const whereClause = status
    ? eq(corporateApplicationsTable.status, status)
    : undefined;

  const [applications, countResult] = await Promise.all([
    db
      .select()
      .from(corporateApplicationsTable)
      .where(whereClause)
      .orderBy(desc(corporateApplicationsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(corporateApplicationsTable)
      .where(whereClause),
  ]);

  res.json({
    applications: applications.map(serializeCorporateApp),
    total: countResult[0]?.count ?? 0,
    page,
    limit,
  });
});

router.get("/admin/corporate-applications/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = IdParam.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  const [application] = await db
    .select()
    .from(corporateApplicationsTable)
    .where(eq(corporateApplicationsTable.id, params.data.id));

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(serializeCorporateApp(application));
});

router.patch("/admin/corporate-applications/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = IdParam.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  const body = UpdateBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Partial<typeof corporateApplicationsTable.$inferInsert> = {};
  if (body.data.status     !== undefined) updateData.status     = body.data.status;
  if (body.data.adminNotes !== undefined) updateData.adminNotes = body.data.adminNotes;
  if (body.data.assignedTo !== undefined) updateData.assignedTo = body.data.assignedTo;

  const [application] = await db
    .update(corporateApplicationsTable)
    .set(updateData)
    .where(eq(corporateApplicationsTable.id, params.data.id))
    .returning();

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(serializeCorporateApp(application));
});

router.delete("/admin/corporate-applications/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = IdParam.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  const [deleted] = await db
    .delete(corporateApplicationsTable)
    .where(eq(corporateApplicationsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json({ success: true });
});

export default router;
