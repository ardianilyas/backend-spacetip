import { Request, Response, Router } from "express";
import { AuthController } from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.js";
import passport from "passport";
import { setAccessCookie, setRefreshCookie } from "../../utils/cookies.js";
import msFromExpiryString from "../../utils/msFromExpiryString.js";
import { env } from "../../config/env.js";
import { RefreshTokenRepository } from "./refreshToken.repository.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";

const router = Router();

const refreshRepo = new RefreshTokenRepository();
const authRepo = new AuthRepository();

const authService = new AuthService(refreshRepo, authRepo);

const controller = new AuthController(authService);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback", 
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req: Request, res: Response) => {
        // @ts-ignore
        const { user, access, refresh } = req.user as { user: any, access: string, refresh: string };

        setAccessCookie(res, access, msFromExpiryString(env.JWT_ACCESS_EXPIRES));
        setRefreshCookie(res, refresh, msFromExpiryString(env.JWT_REFRESH_EXPIRES));
        
        res.status(200).json(user);
    }
)

router.use(requireAuth, Router()
    .post("/logout", controller.logout)
);

export default router;