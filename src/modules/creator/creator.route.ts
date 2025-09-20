import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { CreatorController } from "./creator.controller";
import { CreatorRepository } from "./creator.repository";
import { CreatorService } from "./creator.service";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();

const creatorRepo = new CreatorRepository();
const creatorService = new CreatorService(creatorRepo);
const controller = new CreatorController(creatorService);

router.use(requireAuth);

router.post("/", controller.createCreator);
router.get("/:username", controller.findCreatorByUsername);
router.get("/verify/:userId", checkRole("admin", "superadmin"), controller.verifyCreator);

export default router;