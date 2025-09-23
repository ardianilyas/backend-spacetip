import { User } from "../../../prisma/generated/prisma";
import { prisma } from "../../config/prisma";
import { RegisterSchema } from "./auth.schema";

export class AuthRepository {
    async createUser(data: RegisterSchema): Promise<User> {
        return prisma.user.create({ data });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async findUserById(id: string) {
        return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true } });
    }
}