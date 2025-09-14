import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../prisma/generated/prisma/index.js";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: err.issues.map(e => ({ path: e.path.join("."), message: e.message })),
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Unique constraint failed",
            });
        }
    }

    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message,
    });
}