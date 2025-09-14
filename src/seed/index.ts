import { prisma } from "../config/prisma";
import { creatorSeeder } from "./creator.seeder";
import { userSeeder } from "./user.seeder";

async function main() {
    console.log("Running seeders...");
    
    await userSeeder(5);
    await creatorSeeder();

    console.log("Seeders completed");
}

main().catch(err => {
    console.log(err);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})