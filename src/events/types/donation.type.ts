export interface DonationPaidPayload {
    creatorToken: string;
    donationId: string;
    amount: number;
    message?: string;
    donorName: string;
}