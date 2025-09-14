import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { CreatorController } from "./creator.controller";

const router = Router();
const controller = new CreatorController();

router.use(requireAuth);

router.post("/", controller.createCreator);
router.get("/:username", controller.findCreatorByUsername);
router.get("/verify/:userId", controller.verifyCreator);

export default router;