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
    const passwordHash = await bcrypt.hash(password, 12);

    const [existing] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email));

    if (existing) {
      await db
        .update(adminUsersTable)
        .set({ passwordHash })
        .where(eq(adminUsersTable.email, email));
      logger.info({ email }, "Admin seed: password synced from env");
    } else {
      await db.insert(adminUsersTable).values({
        email,
        passwordHash,
        name: "Admin",
        role: "admin",
      });
      logger.info({ email }, "Admin seed: admin user created from env");
    }
  } catch (err) {
    logger.error({ err }, "Admin seed: failed");
  }
}
