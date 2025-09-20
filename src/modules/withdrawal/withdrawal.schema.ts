import z from "zod";

export const createWithdrawalSchema = z.object({
    amount: z.number().min(15000),
    bankCode: z.string(),
    accountHolderName: z.string(),
    accountNumber: z.string(),
    creatorId: z.string(),
});

export type CreateWithdrawalSchema = z.infer<typeof createWithdrawalSchema>;