import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import { NotFoundError } from "../../utils/errors";
import { logger } from "../../utils/logger";

export class WebhookController {
    constructor() {
        this.webhook = this.webhook.bind(this);
    }

    async webhook(req: Request, res: Response, next: NextFunction) {

        const xenditCallbackToken = req.headers["x-callback-token"] as string;
        const webhookToken = env.XENDIT_WEBHOOK_TOKEN as string;
    
        if (xenditCallbackToken !== webhookToken) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
    
        try {
            const event = req.body;
    
            const donation = await prisma.donation.findUnique({
                where: { referenceId: event.data.reference_id },
            });
    
            if (!donation) {
                logger.app.info({ donationId: event.data.reference_id }, "Donation not found");
                return res.status(200).json({ success: true, message: "Donation not found, but acknowledged." });
            }
    
            if (donation.status === "PAID") {
                logger.app.info({ donationId: donation.id }, "Donation already paid");
                return res.status(200).json({ success: true, message: "Webhook for this donation has already been processed." });
            }
    
            if (event.data.status === "SUCCEEDED") {
                await prisma.$transaction(async (tx) => {
                    
                    const creator = await tx.creator.findUnique({ where: { id: donation.creatorId } });
    
                    if (!creator) {
                        logger.error.error({ creatorId: donation.creatorId }, "Creator not found");
                        throw new NotFoundError(`Creator with ID ${donation.creatorId} not found.`);
                    }

                    await tx.creator.update({
                        where: { id: donation.creatorId },
                        data: { balance: { increment: event.data.amount } }, 
                    });
    
                    await tx.donation.update({
                        where: { id: donation.id },
                        data: { status: "PAID", paidAt: new Date() },
                    });
                });
            }
            
            logger.app.info({ donationId: donation.id }, "Webhook processed successfully");
            res.status(200).json({ success: true, message: "Webhook processed successfully" });
    
        } catch (error) {
            console.error("Webhook processing error:", error);
            logger.error.error({ err: error }, "Webhook processing error");
            next(error); 
        }
    }
}