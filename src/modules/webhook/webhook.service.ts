import { appEventEmitter } from "../../events/eventEmitter";
import { DonationPaidPayload } from "../../events/types/donation.type";
import { getIO } from "../../libs/websocket/socket"; // remove
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
                        creatorToken: creator.token!,
                        donationId: donation.id,
                        amount: event.data.amount,
                        message: donation.message!,
                        donorName: donation.donorName ?? "Someone",
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

    async processXenditWebhookWithdrawal(event: any) {
        const withdrawal = await this.webhookRepo.findWithdrawalByExternalId(event.external_id);

        if (!withdrawal) {
            logger.app.info({ withdrawalId: event.external_id }, "Withdrawal not found");
            throw new NotFoundError(`Withdrawal with external ID ${event.external_id} not found`);
        }

        if (withdrawal.status === "COMPLETED") {
            logger.app.info({ withdrawalId: withdrawal.id }, "Withdrawal already completed");
            throw new Error("Withdrawal already completed");
        }

        if (event.status === "COMPLETED") {
            const result = await this.webhookRepo.runTransaction(async (tx) => {
                const creator = await this.webhookRepo.findCreatorById(withdrawal.creatorId);

                if (!creator) {
                    logger.error.info({ creatorId: withdrawal.creatorId }, "Creator not found");
                    throw new NotFoundError(`Creator with id ${withdrawal.creatorId} not found`);
                }

                const withdrawalUpdated = await this.webhookRepo.updateWithdrawalStatus(withdrawal.id, "COMPLETED", tx);

                const creatorBalanceUpdate = await this.webhookRepo.decrementCreatorBalance(withdrawal.creatorId, withdrawal.amount, tx);

                return {
                    withdrawalUpdated,
                    creatorBalanceUpdate,
                }
            });

            logger.app.info({ data: result.withdrawalUpdated }, "Withdrawal status updated to COMPLETED");
            logger.app.info({ data: result.creatorBalanceUpdate }, "Creator balance updated");
        }

        logger.app.info({ withdrawal: withdrawal }, "Webhook withdrawal processed successfully");
        return { message: "Webhook withdrawal processed successfully" };
    }
}