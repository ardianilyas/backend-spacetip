import { prisma } from "../config/prisma";
import { hashString } from "../utils/bcrypt";
import { faker } from "@faker-js/faker";

export async function userSeeder(count: number = 10) {
    console.log("Seeding users...");
    
    const devPass = await hashString("developer");
    // seed developer account
    await prisma.user.create({
        data: {
            name: "ardianilyas",
            email: "ardian@developer.com",
            password: devPass,
            role: "SUPERADMIN"
        }
    });

    // Seed fake users
    for(let i = 0; i < count; i++) {
        await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: await hashString("password"),
            }
        });
    };

    console.log(`${count+1} users seeded`);
}