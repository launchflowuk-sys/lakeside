import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import adminAuthRouter from "./admin-auth";
import adminLeadsRouter from "./admin-leads";
import adminStatsRouter from "./admin-stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(adminAuthRouter);
router.use(adminLeadsRouter);
router.use(adminStatsRouter);

export default router;
