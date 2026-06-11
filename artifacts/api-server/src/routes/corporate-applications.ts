import { Router, type IRouter } from "express";
import { db, corporateApplicationsTable, insertCorporateApplicationSchema } from "@workspace/db";

const router: IRouter = Router();

function serializeCorporateApp(app: typeof corporateApplicationsTable.$inferSelect) {
  return {
    id: app.id,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    status: app.status,
    companyName: app.companyName,
    organisationType: app.organisationType,
    companyAddress: app.companyAddress,
    city: app.city,
    postcode: app.postcode,
    website: app.website,
    contactName: app.contactName,
    jobTitle: app.jobTitle,
    email: app.email,
    phone: app.phone,
    estimatedMonthlyJourneys: app.estimatedMonthlyJourneys,
    journeyTypes: app.journeyTypes,
    numberOfPassengers: app.numberOfPassengers,
    preferredBilling: app.preferredBilling,
    contractStartDate: app.contractStartDate,
    existingProviderDetails: app.existingProviderDetails,
    additionalRequirements: app.additionalRequirements,
    adminNotes: app.adminNotes,
    assignedTo: app.assignedTo,
  };
}

router.post("/corporate-applications", async (req, res): Promise<void> => {
  const parsed = insertCorporateApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [application] = await db
    .insert(corporateApplicationsTable)
    .values({ ...parsed.data, status: "new" })
    .returning();

  res.status(201).json(serializeCorporateApp(application));
});

export { serializeCorporateApp };
export default router;
