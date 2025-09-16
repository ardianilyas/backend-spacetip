import { Transaction } from "../../../prisma/generated/prisma";
import { prisma } from "../../config/prisma";
import { TransactionInputType } from "./transaction.type";

export class TransactionRepository {
    async createTransaction(data: TransactionInputType): Promise<Transaction> {
        return prisma.transaction.create({ data });
    }
}