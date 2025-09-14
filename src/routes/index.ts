import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import creatorRouter from "../modules/creator/creator.route";

const router = Router();
const apiRouter = router;

apiRouter.use("/auth", authRoute);
apiRouter.use("/creators", creatorRouter);

router.use("/api", apiRouter);

export default router;