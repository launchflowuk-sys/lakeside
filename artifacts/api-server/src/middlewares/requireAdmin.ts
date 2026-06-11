import { type Request, type Response, type NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    adminUserId?: number;
    adminUserEmail?: string;
    adminUserName?: string;
    adminUserRole?: string;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.adminUserId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}
