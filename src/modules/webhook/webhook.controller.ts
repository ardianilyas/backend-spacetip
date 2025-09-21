import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { WebhookService } from "./webhook.service";
import { sendError, sendSuccess } from "../../utils/response";

export class WebhookController {
    constructor(private webhookService: WebhookService) {
        this.paymentQRwebhook = this.paymentQRwebhook.bind(this);
        this.withdrawalWebhook = this.withdrawalWebhook.bind(this);
    }

    async paymentQRwebhook(req: Request, res: Response, next: NextFunction) {

        const xenditCallbackToken = req.headers["x-callback-token"] as string;
        const webhookToken = env.XENDIT_WEBHOOK_TOKEN as string;
    
        if (xenditCallbackToken !== webhookToken) {
            logger.error.info({ token: xenditCallbackToken }, "Invalid webhook token.");
            return sendError(res, "Invalid webhook token.", 401);
        }
    
        try {
            const result = await this.webhookService.processXenditWebhook(req.body);
            return sendSuccess(res, result, "Webhook processed successfully", 200);
        } catch (error) {
            console.error("Webhook processing error:", error);
            logger.error.error({ err: error }, "Webhook processing error");
            next(error); 
        }
    }

    async withdrawalWebhook(req: Request, res: Response, next: NextFunction) {
        const xenditCallbackToken = req.headers["x-callback-token"] as string;
        const webhookToken = env.XENDIT_WEBHOOK_TOKEN as string;

        if (xenditCallbackToken !== webhookToken) {
            logger.error.info({ token: xenditCallbackToken }, "Invalid webhook token.");
            return sendError(res, "Invalid webhook token.", 401);
        }

        try {
            const result = await this.webhookService.processXenditWebhookWithdrawal(req.body);
            return sendSuccess(res, result, "Webhook processed successfully", 200);
        } catch (error) {
            next(error);
        }
    }
}