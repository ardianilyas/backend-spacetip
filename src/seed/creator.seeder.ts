import { faker } from "@faker-js/faker";
import { prisma } from "../config/prisma";

export async function creatorSeeder() {
    const users = await prisma.user.findMany();

    const shuffled = users.sort(() => 0.5 - Math.random());

    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 3);

    for (const user of selected) {
        await prisma.creator.create({
            data: {
                userId: user.id,
                username: faker.internet.username(),
                bio: faker.person.bio(),
            }
        })
    }

    console.log(`${selected.length} creators seeded`);
}