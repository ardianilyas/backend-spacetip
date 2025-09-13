import type { Response } from "express";
import { env } from "../config/env.js";

const isProd = env.NODE_ENV === "production";

const accessCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
  };

const refreshCookieOptions = {
    httpOnly: true, 
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
};

export function setAccessCookie(res: Response, token: string, maxAgeMs: number) {
    res.cookie("accessToken", token, {
        ...accessCookieOptions,
        maxAge: maxAgeMs
    });
}

export function setRefreshCookie(res: Response, token: string, maxAgeMs: number) {
    res.cookie("refreshToken", token, {
        ...refreshCookieOptions,
        maxAge: maxAgeMs,
    });
}

export function clearAuthCookies(res: Response) {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
}