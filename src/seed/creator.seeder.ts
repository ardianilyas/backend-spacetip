import { faker } from "@faker-js/faker";
import { prisma } from "../config/prisma";
import crypto from "crypto";

export async function creatorSeeder() {
    const users = await prisma.user.findMany();

    const shuffled = users.sort(() => 0.5 - Math.random());

    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 3);

    const developer = await prisma.user.findUnique({ where: { email: "ardian@developer.com" } });

    await prisma.creator.create({
        data: {
            userId: developer!.id,
            username: "ardianilyas",
            token: crypto.randomBytes(8).toString("hex"),
            bio: faker.person.bio(),
        }
    });

    for (const user of selected) {
        const token = crypto.randomBytes(8).toString("hex");
        await prisma.creator.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                username: faker.internet.username(),
                token,
                bio: faker.person.bio(),
            }
        })
    }

    console.log(`${selected.length} creators seeded`);
}