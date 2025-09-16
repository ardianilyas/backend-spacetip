import { TransactionRepository } from "./transaction.repository";
import { TransactionInputType } from "./transaction.type";

export class TransactionService {
    constructor(private transactionRepo: TransactionRepository) {

    }

    async createTransaction(data: TransactionInputType) {
        return this.transactionRepo.createTransaction(data);
    }
}