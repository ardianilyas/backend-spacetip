import { xenditClient } from "./xendit.client";
import { CreateDisbursementPayload, CreateQRCodePayload } from "./xendit.types";

export class XenditService {
    static async createQRCode({
        referenceId,
        amount,
        type = "DYNAMIC",
        currency = "IDR",
        expiresAt
    }: CreateQRCodePayload) {
        const response =  await xenditClient.post("/qr_codes", {
            reference_id: referenceId,
            type,
            currency,
            amount,
            expires_at: expiresAt,
        });
        return response.data;
    }

    static async simulatePayment(qrId: string, amount: number) {
        const response =  await xenditClient.post(`/qr_codes/${qrId}/payments/simulate`, {
            amount
        });

        return response.data;
    }

    static async disbursement(data: CreateDisbursementPayload) {
        const response = await xenditClient.post("/disbursements", {
            external_id: data.externalId,
            amount: data.amount,
            bank_code: data.bankCode,
            account_holder_name: data.accountHolderName,
            account_number: data.accountNumber
        });
        return response.data;
    }
}