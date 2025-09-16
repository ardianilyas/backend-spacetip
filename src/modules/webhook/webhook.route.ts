import { Router } from "express";
import { WebhookController } from "./webhook.controller";

const router = Router();
const controller = new WebhookController();

router.post("/payments/webhook", controller.webhook);

export default router;