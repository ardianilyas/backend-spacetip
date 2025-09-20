import { Donation, DonationStatus, Prisma, PrismaClient, WithdrawalStatus } from "../../../prisma/generated/prisma";
import { prisma } from "../../config/prisma";

type TransactionClient = Prisma.TransactionClient;

export class WebhookRepository {
    // Donation
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

    // Withdrawal 
    async findWithdrawalByExternalId(externalId: string, tx: TransactionClient = prisma) {
        return tx.withdrawal.findUnique({ where: { externalId } });
    }

    async updateWithdrawalStatus(id: string, status: WithdrawalStatus, tx: TransactionClient = prisma) {
        return tx.withdrawal.update({
            where: { id },
            data: { status },
        });
    }

    async decrementCreatorBalance(id: string, amount: number, tx: TransactionClient = prisma) {
        return tx.creator.update({
            where: { id },
            data: { balance: { decrement: amount } },
        });
    }

    async runTransaction<T>(callback: (tx: TransactionClient) => Promise<T>): Promise<T> {
        return prisma.$transaction(callback);
    }
}