import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/admin/auth/debug", requireAdmin, async (req, res): Promise<void> => {
  const token = process.env.DEBUG_TOKEN;
  if (!token || req.query.token !== token) {
    res.status(404).end();
    return;
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, email, name, role, created_at,
              LEFT(password_hash, 7) AS hash_prefix
       FROM admin_users ORDER BY id`,
    );
    res.json({ adminUsers: result.rows });
  } finally {
    client.release();
  }
});

export default router;
