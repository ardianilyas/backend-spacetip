import { Donation, DonationStatus, Prisma, PrismaClient } from "../../../prisma/generated/prisma";
import { prisma } from "../../config/prisma";

type TransactionClient = Prisma.TransactionClient;

export class WebhookRepository {
    async findDonationByReferenceId(referenceId: string) {
        return prisma.donation.findUnique({
            where: {
                referenceId
            }
        });
    }

    async findCreatorById(id: string, tx: TransactionClient = prisma) {
        return tx.creator.findUnique({ where: { id } });
    }

    async updateCreatorBalance(id: string, amount: number, tx: TransactionClient = prisma) {
        return tx.creator.update({
            where: { id },
            data: { balance: { increment: amount } }
        });
    }

    async updateDonationStatus(id: string, data: { status: DonationStatus; paidAt?: Date }, tx: TransactionClient = prisma) {
        return tx.donation.update({
            where: { id },
            data
        });
    }

    async runTransaction(callback: (tx: TransactionClient) => Promise<void>) {
        return prisma.$transaction(callback);
    }
}