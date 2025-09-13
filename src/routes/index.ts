import { Router } from "express";
import authRoute from "../modules/auth/auth.route";

const router = Router();
const apiRouter = router;

apiRouter.use("/auth", authRoute);

router.use("/api", apiRouter);

export default router;