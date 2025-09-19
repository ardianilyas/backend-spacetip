import { appEventEmitter } from "../../events/eventEmitter";
import { DonationPaidPayload } from "../../events/types/donation.type";
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
            const result = await this.webhookRepo.runTransaction(async (tx) => {
                const creator = await this.webhookRepo.findCreatorById(donation.creatorId);

                if (!creator) {
                    logger.error.info({ creatorId: donation.creatorId }, "Creator not found");
                    throw new NotFoundError(`Creator with id ${donation.creatorId} not found`);
                }

                const creatorBalanceUpdate = await this.webhookRepo.updateCreatorBalance(donation.creatorId, event.data.amount, tx);

                const donationUpdate = await this.webhookRepo.updateDonationStatus(donation.id, { status: "PAID", paidAt: new Date() }, tx);

                return {
                    creatorBalanceUpdate,
                    donationUpdate,
                    payload: {
                        creatorId: donation.creatorId,
                        donationId: donation.id,
                        amount: event.data.amount,
                        message: donation.message!,
                        donorName: donation.donorName ?? "Anonymous"
                    } as DonationPaidPayload,
                };

            });

            logger.app.info({ data: result.creatorBalanceUpdate }, "Creator balance updated");
            logger.app.info({ data: result.donationUpdate }, "Donation status updated to PAID");

            appEventEmitter.emit("donation.paid", result.payload);
        }
        logger.app.info({ donationId: donation.id }, "Webhook processed successfully");
        return { message: "Webhook processed successfully" };
    }
}