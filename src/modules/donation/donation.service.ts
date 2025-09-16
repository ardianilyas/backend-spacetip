import { XenditService } from "../../libs/xendit";
import { TransactionService } from "../../shared/transaction/transaction.service";
import { TransactionInputType } from "../../shared/transaction/transaction.type";
import { NotFoundError } from "../../utils/errors";
import { logger } from "../../utils/logger";
import { DonationRepository } from "./donation.repository";
import { CreateDonationSchema } from "./donation.schema";
import { v4 as uuidv4 } from "uuid";

export class DonationService {
    constructor(private donationRepo: DonationRepository, private transactionService: TransactionService) {}

    async getCreatorByUsername(username: string) {
        const creator = await this.donationRepo.getCreatorByUsername(username);
        if(!creator) throw new NotFoundError("Creator not found");
        return creator;
    }

    async createDonation(payload: CreateDonationSchema) {
        try {
            const referenceId = await this.generateReferenceId();

            const expiresAt = await this.expiresAt(10);

            const qrCode = await XenditService.createQRCode({
                referenceId,
                amount: payload.amount,
                expiresAt
            });

            const data: CreateDonationSchema = { ...payload, referenceId, expiresAt, xenditQrId: qrCode.id };
            
            const donation = await this.donationRepo.createDonation(data);
            if(!donation) {
                logger.error.error({ data: donation }, "Failed to create donation");
                return;
            }
            logger.app.info({ data: donation }, "A new donation created");

            return qrCode;
        } catch (error) {
            logger.error.error({ err: error }, "Failed to create donation");
            return;
        }
    }

    async simulateQrPayment(qrId: string, amount: number) {
        try {
            const donation = await this.donationRepo.getDonationByQrId(qrId);

            if(!donation) throw new NotFoundError("Donation not found");
            
            const response = await XenditService.simulatePayment(qrId, amount);

            const transactionData: TransactionInputType = {
                amount,
                paymentMethod: "QR",
                status: "SUCCESS",
                xenditPaymentId: response.id,
                donationId: donation.id,
                creatorId: donation.creatorId,
            }
            
            const transaction = await this.transactionService.createTransaction(transactionData);

            return transactionData;
        } catch (error) {
            logger.error.error({ err: error }, "Failed to simulate payment");
        }
    }

    async generateReferenceId() {
        return "qrspace-" + uuidv4();
    }

    async expiresAt(min: number) {
        return new Date(Date.now() + min * 60 * 1000).toISOString(); 
    }
}