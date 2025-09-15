import { Creator } from "../../../prisma/generated/prisma";
import { prisma } from "../../config/prisma";
import { CreateCreatorSchema } from "./creator.schema";

export class CreatorRepository {

    async getAllCreators(): Promise<Creator[]> {
        return prisma.creator.findMany();
    }

    async createCreatorAccount(data: CreateCreatorSchema): Promise<Creator> {
        return prisma.creator.create({ data });
    }

    async findCreatorByUsername(username: string): Promise<Creator | null> {
        return prisma.creator.findUnique({ where: { username } });
    }

    async verifyCreator(userId: string): Promise<Creator> {
        return prisma.creator.update({
            where: { userId },
            data: { isVerified: true },
        });
    }
}