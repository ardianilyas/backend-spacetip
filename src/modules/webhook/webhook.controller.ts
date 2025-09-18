import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { WebhookService } from "./webhook.service";

export class WebhookController {
    constructor(private webhookService: WebhookService) {
        this.webhook = this.webhook.bind(this);
    }

    async webhook(req: Request, res: Response, next: NextFunction) {

        const xenditCallbackToken = req.headers["x-callback-token"] as string;
        const webhookToken = env.XENDIT_WEBHOOK_TOKEN as string;
    
        if (xenditCallbackToken !== webhookToken) {
            logger.error.info({ token: xenditCallbackToken }, "Invalid webhook token.");
            return res.status(401).json({ success: false, message: "Invalid webhook token." });
        }
    
        try {
            const result = await this.webhookService.processXenditWebhook(req.body);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Webhook processing error:", error);
            logger.error.error({ err: error }, "Webhook processing error");
            next(error); 
        }
    }
}