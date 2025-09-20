export interface CreateQRCodePayload {
    referenceId: string;
    amount: number;
    type?: "DYNAMIC" | "STATIC";
    currency?: "IDR",
    expiresAt?: string;
}

export interface CreateDisbursementPayload {
    amount: number;
    externalId: string;
    bankCode: string;
    accountHolderName: string;
    accountNumber: string;
}