import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.js";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", controller.login);

router.use(requireAuth, Router()
    .post("/refresh", controller.refresh)
    .post("/logout", controller.logout)
);

export default router;