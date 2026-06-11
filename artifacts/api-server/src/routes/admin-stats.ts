import { Router, type IRouter } from "express";
import { eq, sql, desc } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin, async (req, res): Promise<void> => {
  const [counts, recentLeads] = await Promise.all([
    db
      .select({
        status: leadsTable.status,
        count: sql<number>`count(*)::int`,
      })
      .from(leadsTable)
      .groupBy(leadsTable.status),
    db
      .select()
      .from(leadsTable)
      .orderBy(desc(leadsTable.createdAt))
      .limit(10),
  ]);

  const statsMap: Record<string, number> = {};
  for (const row of counts) {
    statsMap[row.status] = row.count;
  }

  const total = counts.reduce((sum, r) => sum + r.count, 0);

  res.json({
    total,
    new: statsMap["new"] ?? 0,
    contacted: statsMap["contacted"] ?? 0,
    quoted: statsMap["quoted"] ?? 0,
    booked: statsMap["booked"] ?? 0,
    completed: statsMap["completed"] ?? 0,
    cancelled: statsMap["cancelled"] ?? 0,
    archived: statsMap["archived"] ?? 0,
    recentLeads: recentLeads.map((lead) => ({
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
    })),
  });
});

export default router;
