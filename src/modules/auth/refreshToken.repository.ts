import type { RefreshToken } from "../../../prisma/generated/prisma/index.js";
import { prisma } from "../../config/prisma.js";
import type { RefreshTokenType } from "./refreshToken.type.js";

export class RefreshTokenRepository {
    async create(data: RefreshTokenType): Promise<RefreshToken> {
        return prisma.refreshToken.create({ data });
    }

    async findById(id: string) {
        return prisma.refreshToken.findUnique({ where: { id } });
    }

    async deleteById(id: string) {
        return prisma.refreshToken.delete({ where: { id } });
    }

    async revokeAllForUser(userId: string) {
        return prisma.refreshToken.updateMany({
            where: { userId },
            data: { revoked: true }
        });
    }
}