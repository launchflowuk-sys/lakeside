import { pool } from "@workspace/db";
import { logger } from "./logger";
import bcrypt from "bcryptjs";

export async function seedAdminFromEnv(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO admin_users (email, password_hash, name, role)
         VALUES ($1, $2, 'Admin', 'admin')
         ON CONFLICT (email) DO UPDATE
           SET password_hash = EXCLUDED.password_hash`,
        [email, passwordHash],
      );
      logger.info({ email }, "Admin seed: account ready");
    } finally {
      client.release();
    }
  } catch (err) {
    logger.error({ err }, "Admin seed: failed — check ADMIN_EMAIL and ADMIN_PASSWORD");
  }
}
