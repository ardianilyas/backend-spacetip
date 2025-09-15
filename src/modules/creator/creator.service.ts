import { ConflictError, NotFoundError } from "../../utils/errors";
import { logger } from "../../utils/logger";
import { CreatorRepository } from "./creator.repository";
import { CreateCreatorSchema } from "./creator.schema";

export class CreatorService {
    constructor(private creatorRepo: CreatorRepository) {}

    async createCreator(data: CreateCreatorSchema) {
        const exists = await this.creatorRepo.findCreatorByUsername(data.username);

        if(exists) throw new ConflictError("Creator already exists");

        const creator = await this.creatorRepo.createCreatorAccount(data);
        logger.app.info({ data: creator }, "A new creator created");

        return creator;
    }

    async findCreatorByUsername(username: string) {
        const creator = this.creatorRepo.findCreatorByUsername(username);

        if(!creator) throw new NotFoundError("Creator not found");

        return creator;
    }

    async verifyCreator(userId: string) {
        const verifiedCreator = await this.creatorRepo.verifyCreator(userId);
        logger.app.info({ data: verifiedCreator }, `A creator verified`);

        return verifiedCreator;
    }
}