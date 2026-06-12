import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";
import { logger } from "./logger";

export async function seedAdminFromEnv(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email));

    if (existing) {
      logger.info({ email }, "Admin seed: user already exists, skipping");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.insert(adminUsersTable).values({
      email,
      passwordHash,
      name: "Admin",
      role: "admin",
    });

    logger.info({ email }, "Admin seed: created admin user from env vars");
  } catch (err) {
    logger.error({ err }, "Admin seed: failed");
  }
}
