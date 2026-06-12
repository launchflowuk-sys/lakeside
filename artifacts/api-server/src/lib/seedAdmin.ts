import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";
import { logger } from "./logger";

export async function seedAdminFromEnv(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const forceReset = process.env.ADMIN_FORCE_RESET === "true";

  if (!email || !password) {
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const [existing] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email));

    if (existing) {
      if (forceReset) {
        await db
          .update(adminUsersTable)
          .set({ passwordHash })
          .where(eq(adminUsersTable.email, email));
        logger.info({ email }, "Admin seed: password reset via ADMIN_FORCE_RESET");
      } else {
        logger.info({ email }, "Admin seed: user already exists, skipping (set ADMIN_FORCE_RESET=true to override)");
      }
      return;
    }

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
