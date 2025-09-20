import { prisma } from "../../config/prisma";
import { WithdrawalDataType } from './withdrawal.type';

export class WithdrawalRepository {
    async getCreatorBalance(creatorId: string) {
        return prisma.creator.findUnique({ where: { id: creatorId }, select: { balance: true } })
    }

    async createWithdrawal(data: WithdrawalDataType) {
        return prisma.withdrawal.create({ data });
    }
}