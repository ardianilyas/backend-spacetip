import { TransactionStatus } from "../../../prisma/generated/prisma";

export interface TransactionInputType {
    amount: number;
    currency?: string;
    paymentMethod: string;
    status?: TransactionStatus;
    xenditPaymentId?: string;
    donationId: string;
    creatorId: string;
}