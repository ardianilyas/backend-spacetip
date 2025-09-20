import { Creator } from "../../../prisma/generated/prisma";
import { prisma } from "../../config/prisma";
import { CreateCreatorSchema } from "./creator.schema";
import { CreatorDataType } from "./creator.type";

export class CreatorRepository {

    async getAllCreators(): Promise<CreatorDataType[]> {
        return prisma.creator.findMany({ select: { username: true, bio: true, isVerified: true } });
    }

    async createCreatorAccount(data: CreateCreatorSchema): Promise<Creator> {
        return prisma.creator.create({ data });
    }

    async findCreatorByUsername(username: string): Promise<CreatorDataType | null> {
        return prisma.creator.findUnique({ where: { username }, select: { username: true, bio: true, isVerified: true } });
    }

    async verifyCreator(userId: string): Promise<Creator> {
        return prisma.creator.update({
            where: { userId },
            data: { isVerified: true },
        });
    }
}