import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { SubmitLeadBody } from "@workspace/api-zod";
import { sendNewLeadNotification, sendCustomerConfirmation } from "../lib/email";

const router: IRouter = Router();

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = SubmitLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lead] = await db.insert(leadsTable).values({
    ...parsed.data,
    status: "new",
  }).returning();

  await Promise.all([
    sendNewLeadNotification(lead),
    sendCustomerConfirmation(lead),
  ]);

  res.status(201).json({
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
  });
});

export default router;
