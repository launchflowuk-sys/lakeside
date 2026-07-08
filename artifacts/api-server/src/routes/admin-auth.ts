import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, adminUsersTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { AdminLoginBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.post("/admin/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email));

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  req.session.adminUserId = user.id;
  req.session.adminUserEmail = user.email;
  req.session.adminUserName = user.name;
  req.session.adminUserRole = user.role;

  req.session.save((err) => {
    if (err) {
      res.status(500).json({ error: "Login failed" });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  });
});

router.post("/admin/auth/logout", requireAdmin, async (req, res): Promise<void> => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Logout failed" });
      return;
    }
    res.json({ success: true });
  });
});

router.get("/admin/auth/me", requireAdmin, async (req, res): Promise<void> => {
  res.json({
    id: req.session.adminUserId,
    email: req.session.adminUserEmail,
    name: req.session.adminUserName,
    role: req.session.adminUserRole,
  });
});

export default router;
