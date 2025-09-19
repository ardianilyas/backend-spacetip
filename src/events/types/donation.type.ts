export interface DonationPaidPayload {
    creatorId: string;
    donationId: string;
    amount: number;
    message?: string;
    donorName: string;
}