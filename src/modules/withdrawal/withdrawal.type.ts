import { WithdrawalStatus } from "../../../prisma/generated/prisma";

export interface WithdrawalDataType {
    amount: number;
    amountToBeTransferred: number;
    currency?: string;
    status?: WithdrawalStatus;
    externalId: string;
    bankCode: string;
    accountHolderName: string;
    accountNumber: string;
    creatorId: string;
}