import { faker } from "@faker-js/faker";
import { prisma } from "../config/prisma";
import crypto from "crypto";

export async function creatorSeeder() {
    const users = await prisma.user.findMany();

    const shuffled = users.sort(() => 0.5 - Math.random());

    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 3);

    for (const user of selected) {
        const token = crypto.randomBytes(8).toString("hex");
        await prisma.creator.create({
            data: {
                userId: user.id,
                username: faker.internet.username(),
                token,
                bio: faker.person.bio(),
            }
        })
    }

    console.log(`${selected.length} creators seeded`);
}