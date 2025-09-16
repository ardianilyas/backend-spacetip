import { Creator, Donation } from "../../../prisma/generated/prisma";
import { prisma } from "../../config/prisma";
import { CreateDonationSchema } from "./donation.schema";

export class DonationRepository {
    async getCreatorByUsername(username: string): Promise<Creator | null> {
        return prisma.creator.findUnique({ where: { username } });
    }

    async createDonation(data: CreateDonationSchema): Promise<Donation> {
        return prisma.donation.create({ data });
    }

    async getDonationByQrId(qrId: string): Promise<Donation | null> {
        return prisma.donation.findFirst({ where: { xenditQrId: qrId } });
    }
}