import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { clearAuthCookies, setAccessCookie, setRefreshCookie } from "../../utils/cookies.js";
import { env } from "../../config/env.js";
import { validate } from "../../utils/validate.js";
import { loginSchema, RegisterSchema, registerSchema } from "./auth.schema.js";
import msFromExpiryString from "../../utils/msFromExpiryString.js";
import { sendSuccess } from "../../utils/response.js";

export class AuthController {
    constructor(private authService: AuthService) {
        this.me = this.me.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
    }

    async me(req: Request, res: Response, next: NextFunction) {
      try {
        const id = req.user?.userId!;
        const user = await this.authService.me(id);
        return sendSuccess(res, user, "User found", 200);
      } catch (error) {
        next(error);
      }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const data: RegisterSchema = validate(registerSchema, req.body);
            await this.authService.register(data);
            return sendSuccess(res, null, "User registered successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
          const data = validate(loginSchema, req.body);
          const { accessToken, refreshToken } = await this.authService.login(data);
      
          setAccessCookie(res, accessToken, msFromExpiryString(env.JWT_ACCESS_EXPIRES));
          setRefreshCookie(res, refreshToken, msFromExpiryString(env.JWT_REFRESH_EXPIRES));
      
          return sendSuccess(res, null, "Login successfully", 200);
        } catch (err) {
          next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken) {
            return res.status(401).json({ success: false, message: "No refresh token" });
          }
      
          const { accessToken, refreshToken: newRefresh } = await this.authService.rotateRefresh(refreshToken);
      
          setAccessCookie(res, accessToken, msFromExpiryString(env.JWT_ACCESS_EXPIRES));
          setRefreshCookie(res, newRefresh, msFromExpiryString(env.JWT_REFRESH_EXPIRES));
      
          return sendSuccess(res, null, "Refresh token rotated successfully", 200);
        } catch (err) {
          next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
          const refreshToken = req.cookies.refreshToken;
          await this.authService.logout(refreshToken);
          clearAuthCookies(res);
          return sendSuccess(res, null, "Logout successfully", 200);
        } catch (err) {
          next(err);
        }
    }
}