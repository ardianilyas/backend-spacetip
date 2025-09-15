export interface CreateQRCodePayload {
    referenceId: string;
    amount: number;
    type?: "DYNAMIC" | "STATIC";
    currency?: "IDR",
    expiresAt?: string;
}