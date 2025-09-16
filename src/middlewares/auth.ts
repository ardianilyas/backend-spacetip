import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
    user: { userId: string, role: string };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const access = req.cookies?.accessToken;
      if (!access) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      const payload = verifyAccessToken(access);
      (req as AuthRequest).user = { userId: payload.userId, role: payload.role };
      next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };