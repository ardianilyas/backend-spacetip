import { NextFunction, Request, Response } from "express";
import { WithdrawalService } from "./withdrawal.service";
import { validate } from "../../utils/validate";
import { createWithdrawalSchema } from "./withdrawal.schema";

export class WithdrawalController {
    constructor(private withdrawalService: WithdrawalService) {
        this.createWithdrawal = this.createWithdrawal.bind(this);
    }

    async createWithdrawal(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(createWithdrawalSchema, req.body);

            const response = await this.withdrawalService.createWithdrawal(data);

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
}