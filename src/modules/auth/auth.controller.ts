import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { clearAuthCookies, setAccessCookie, setRefreshCookie } from "../../utils/cookies.js";
import { env } from "../../config/env.js";
import { validate } from "../../utils/validate.js";
import { loginSchema, RegisterSchema, registerSchema } from "./auth.schema.js";
import msFromExpiryString from "../../utils/msFromExpiryString.js";

export class AuthController {
    constructor(private authService = new AuthService()) {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.refresh = this.refresh.bind(this);
        this.logout = this.logout.bind(this);
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const data: RegisterSchema = validate(registerSchema, req.body);
            const user = await this.authService.register(data);
            res.status(201).json(user);
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
      
          res.json({ success: true });
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
      
          res.json({ success: true });
        } catch (err) {
          next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
          const refreshToken = req.cookies.refreshToken;
          await this.authService.logout(refreshToken);
          clearAuthCookies(res);
          res.json({ success: true });
        } catch (err) {
          next(err);
        }
    }
}