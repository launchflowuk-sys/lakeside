import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// Docker/Coolify's healthcheck hits this route, and Traefik refuses to
// route traffic to a container Docker considers unhealthy — so whatever
// this endpoint reports directly controls whether the whole site is
// reachable, not just whether individual DB-dependent requests work.
//
// This was briefly made DB-aware (pinging Postgres) to catch a hung
// connection pool automatically. That surfaced a real, still-unresolved
// bug in the pool's connection-reuse logic (see server-migration/incident
// notes) that intermittently makes DB queries hang — and because this
// route gated Traefik's routing, every recurrence took the entire site
// offline instead of just the DB-dependent parts. Reverted to a plain
// liveness check until the underlying pool bug is actually fixed: this
// endpoint should never again be able to take down routing on its own.
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
