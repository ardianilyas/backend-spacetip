import { getIO } from "../../libs/websocket/socket";
import { NotFoundError } from "../../utils/errors";
import { logger } from "../../utils/logger";
import { WebhookRepository } from "./webhook.repository";

export class WebhookService {
    constructor(private webhookRepo: WebhookRepository) {

    }

    async processXenditWebhook(event: any) {
        const donation = await this.webhookRepo.findDonationByReferenceId(event.data.reference_id);

        if (!donation) {
            logger.app.info({ donationid: event.data.reference_id }, "Donation not found");
            throw new NotFoundError(`Donation with reference ID ${event.data.reference_id} not found`);
        }

        if (donation.status === "PAID") {
            logger.app.info({ donationId: event.data.reference_id }, "Donation already paid");
            throw new Error("Donation already paid");
        }

        if (event.data.status === "SUCCEEDED") {
            await this.webhookRepo.runTransaction(async (tx) => {
                const creator = await this.webhookRepo.findCreatorById(donation.creatorId);

                if (!creator) {
                    logger.error.info({ creatorId: donation.creatorId }, "Creator not found");
                }

                await this.webhookRepo.updateCreatorBalance(donation.creatorId, event.data.amount, tx);

                await this.webhookRepo.updateDonationStatus(donation.id, { status: "PAID", paidAt: new Date() }, tx);

                if (creator?.id) {
                    const io = getIO();
                    // change creator id to creator token soon
                    io.to(`creator_${creator.id}`).emit("donation_message", {
                        donationId: donation.id,
                        amount: event.data.amount,
                        message: donation.message,
                        donorName: donation.donorName || "Anonymous"
                    });
                }
            });
        }
        logger.app.info({ donationId: donation.id }, "Webhook processed successfully");
        return { message: "Webhook processed successfully" };
    }
}