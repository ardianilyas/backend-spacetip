import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import creatorRouter from "../modules/creator/creator.route";
import donationRouter from "../modules/donation/donation.route";

const router = Router();
const apiRouter = router;

apiRouter.use("/auth", authRoute);
apiRouter.use("/creators", creatorRouter);
apiRouter.use("/", donationRouter);

router.use("/api", apiRouter);

export default router;