import { NextFunction, Request, Response } from "express";
import { CreatorService } from "./creator.service";
import { validate } from "../../utils/validate";
import { createCreatorSchema } from "./creator.schema";
import { sendSuccess } from "../../utils/response";

export class CreatorController {
    constructor(private creatorService: CreatorService) {
        this.getAllCreators = this.getAllCreators.bind(this);
        this.getCreatorBalance = this.getCreatorBalance.bind(this);
        this.createCreator = this.createCreator.bind(this);
        this.findCreatorByUsername = this.findCreatorByUsername.bind(this);
        this.verifyCreator = this.verifyCreator.bind(this);
    }

    async getAllCreators(req: Request, res: Response, next: NextFunction) {
        try {
            const creators = await this.creatorService.getAllCreators();
            return sendSuccess(res, creators, "Creators found", 200);
        } catch (error) {
            next(error);
        }
    }

    async getCreatorBalance(req:Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId!;
            const balance = await this.creatorService.getCreatorBalance(userId);
            return sendSuccess(res, balance, "Creator balance found", 200);
        } catch (error) {
            next(error);
        }
    }

    async createCreator(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = validate(createCreatorSchema, req.body);
            const data = { ...validatedData, userId: req.user?.userId! };
            await this.creatorService.createCreator(data);
            return sendSuccess(res, null, "Creator created successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    async findCreatorByUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const { username } = req.params;
            const creator = await this.creatorService.findCreatorByUsername(username);
            return sendSuccess(res, creator, "Creator found", 200);
        } catch (error) {
            next(error);
        }
    }

    async verifyCreator(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const creator = await this.creatorService.verifyCreator(userId);
            return sendSuccess(res, creator, "Creator verified successfully", 200);
        } catch (error) {
            next(error);
        }
    }
}