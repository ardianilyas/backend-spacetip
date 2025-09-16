import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import creatorRouter from "../modules/creator/creator.route";
import donationRouter from "../modules/donation/donation.route";
import webhookRouter from "../modules/webhook/webhook.route";

const router = Router();
const apiRouter = router;

apiRouter.use("/", webhookRouter);
apiRouter.use("/auth", authRoute);
apiRouter.use("/creators", creatorRouter);
apiRouter.use("/", donationRouter);

router.use("/", apiRouter);

export default router;