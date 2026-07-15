import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Docker/Coolify's healthcheck hits this route to decide whether to restart
// the container. It used to only confirm the Node process was alive, which
// meant a fully hung Postgres pool (dead pooled connections, no timeouts)
// still reported "healthy" forever — nothing ever triggered an automatic
// recovery. Pinging the DB makes this endpoint an actual readiness check.
//
// This used to race pool.query() against its own 3s setTimeout and abandon
// the underlying query on timeout without cancelling it — the query kept
// running (and kept its connection checked out) in the background. Since a
// new ping fires every healthcheck interval, abandoned queries accumulated
// one per cycle until the pool was fully exhausted, at which point every
// other route sharing the same pool started hanging too. There is no
// separate timeout here anymore on purpose: the pool's own
// connectionTimeoutMillis/query_timeout (lib/db) already bound how long a
// single query can take, and Docker's healthcheck Timeout (5s, see
// docker-compose.yml) bounds the outer check — a second, shorter,
// unmanaged timeout on top of those was the actual bug, not a safety net.
router.get("/healthz", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    const data = HealthCheckResponse.parse({ status: "ok" });
    res.json(data);
  } catch (err) {
    logger.error({ err }, "Healthcheck DB ping failed");
    res.status(503).json({ status: "error" });
  }
});

export default router;
