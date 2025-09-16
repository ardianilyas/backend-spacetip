import { NextFunction, Request, Response } from "express";
import { DonationService } from "./donation.service";
import { validate } from "../../utils/validate";
import { CreateDonationSchema, createDonationSchema, simulatePaymentSchema } from "./donation.schema";

export class DonationController {
    constructor(private donationService: DonationService) {
        this.getCreatorByUsername = this.getCreatorByUsername.bind(this);
        this.createDonation = this.createDonation.bind(this);
        this.simulatePayment = this.simulatePayment.bind(this);
    }

    async getCreatorByUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const { username } = req.params;
            const creator = await this.donationService.getCreatorByUsername(username);
            res.status(200).json(creator);
        } catch (error) {
            next(error);
        }
    }

    async createDonation(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = validate(createDonationSchema, req.body);
            const data = { ...validatedData, donorId: req.user?.userId! } as CreateDonationSchema;
            const response = await this.donationService.createDonation(data);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async simulatePayment(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(simulatePaymentSchema, req.body);
            const response = await this.donationService.simulateQrPayment(data.qrId, data.amount);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}