import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const DB_PING_TIMEOUT_MS = 3_000;

function pingDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("db ping timed out")), DB_PING_TIMEOUT_MS);
    pool.query("SELECT 1")
      .then(() => { clearTimeout(timer); resolve(); })
      .catch((err: unknown) => { clearTimeout(timer); reject(err); });
  });
}

// Docker/Coolify's healthcheck hits this route to decide whether to restart
// the container. It used to only confirm the Node process was alive, which
// meant a fully hung Postgres pool (dead pooled connections, no timeouts)
// still reported "healthy" forever — nothing ever triggered an automatic
// recovery. Pinging the DB with a bounded timeout makes this endpoint an
// actual readiness check, not just a liveness check.
router.get("/healthz", async (_req, res) => {
  try {
    await pingDb();
    const data = HealthCheckResponse.parse({ status: "ok" });
    res.json(data);
  } catch (err) {
    logger.error({ err }, "Healthcheck DB ping failed");
    res.status(503).json({ status: "error" });
  }
});

export default router;
