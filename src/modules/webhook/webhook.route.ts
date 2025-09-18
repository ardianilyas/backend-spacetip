import { Router } from "express";
import { WebhookController } from "./webhook.controller";
import { WebhookRepository } from "./webhook.repository";
import { WebhookService } from "./webhook.service";

const router = Router();

const webhookRepo = new WebhookRepository();
const webhookService = new WebhookService(webhookRepo); 
const controller = new WebhookController(webhookService);

router.post("/payments/webhook", controller.webhook);

export default router;