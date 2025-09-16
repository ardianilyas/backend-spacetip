import z from "zod";

export const createDonationSchema = z.object({
    amount: z.number(),
    message: z.string().optional(),
    creatorId: z.uuid(),
    donorName: z.string().optional(),
});

export const simulatePaymentSchema = z.object({
    qrId: z.string(),
    amount: z.number()
});

export type CreateDonationSchema = z.infer<typeof createDonationSchema> & { referenceId: string; expiresAt: string; donorId: string, xenditQrId: string; };