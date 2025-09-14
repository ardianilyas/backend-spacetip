import { NextFunction, Request, Response } from "express";

export function checkRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

        if(!allowedRoles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Forbidden, insufficient permissions" });
        
        next();
    }
}