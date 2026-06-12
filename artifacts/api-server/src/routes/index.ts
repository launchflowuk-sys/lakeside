import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import adminAuthRouter from "./admin-auth";
import adminLeadsRouter from "./admin-leads";
import adminStatsRouter from "./admin-stats";
import corporateApplicationsRouter from "./corporate-applications";
import adminCorporateRouter from "./admin-corporate";
import reviewsRouter from "./reviews";
import quotesRouter from "./quotes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(corporateApplicationsRouter);
router.use(adminAuthRouter);
router.use(adminLeadsRouter);
router.use(adminStatsRouter);
router.use(adminCorporateRouter);
router.use(reviewsRouter);
router.use(quotesRouter);

export default router;
