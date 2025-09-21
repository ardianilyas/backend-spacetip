import { Creator, Donation } from "../../../prisma/generated/prisma";
import { prisma } from "../../config/prisma";
import { CreatorDataType } from "../creator/creator.type";
import { CreateDonationSchema } from "./donation.schema";

export class DonationRepository {
    async getCreatorByUsername(username: string): Promise<CreatorDataType | null> {
        return prisma.creator.findUnique({ where: { username }, select: { username: true, bio: true, isVerified: true } });
    }

    async createDonation(data: CreateDonationSchema): Promise<Donation> {
        return prisma.donation.create({ data });
    }

    async getDonationByQrId(qrId: string): Promise<Donation | null> {
        return prisma.donation.findFirst({ where: { xenditQrId: qrId } });
    }
}