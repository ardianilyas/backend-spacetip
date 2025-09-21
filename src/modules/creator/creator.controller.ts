import { NextFunction, Request, Response } from "express";
import { CreatorService } from "./creator.service";
import { validate } from "../../utils/validate";
import { createCreatorSchema } from "./creator.schema";

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
            return res.status(200).json({ success: true, data: creators });
        } catch (error) {
            next(error);
        }
    }

    async getCreatorBalance(req:Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId!;
            const balance = await this.creatorService.getCreatorBalance(userId);
            return res.status(200).json({ success: true, data: balance });
        } catch (error) {
            next(error);
        }
    }

    async createCreator(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = validate(createCreatorSchema, req.body);
            const data = { ...validatedData, userId: req.user?.userId! };
            await this.creatorService.createCreator(data);
            return res.status(201).json({ success: true, message: "Creator created successfully" });
        } catch (error) {
            next(error);
        }
    }

    async findCreatorByUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const { username } = req.params;
            const creator = await this.creatorService.findCreatorByUsername(username);
            return res.status(200).json({ success: true, data: creator });
        } catch (error) {
            next(error);
        }
    }

    async verifyCreator(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const creator = await this.creatorService.verifyCreator(userId);
            return res.status(200).json({ success: true, message: "Creator verified", data: creator });
        } catch (error) {
            next(error);
        }
    }
}