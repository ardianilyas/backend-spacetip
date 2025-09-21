import { Response } from "express";

export interface SuccessMeta { [key: string]: any }

export function sendSuccess(
    res: Response, 
    data?: any, 
    message: string = "OK", 
    statusCode: 200 | 201 = 200, 
    meta?: SuccessMeta
) {
    return res.status(statusCode).json({
        success: true,
        code: statusCode,
        message,
        data: data ?? null,
        meta: meta ?? null
    });
}

export function sendError(
    res: Response,
    message: string = "Bad Request",
    statusCode: number = 400,
    errors?: any
) {
    return res.status(statusCode).json({
        success: false,
        code: statusCode,
        message,
        errors: errors ?? null
    });
}