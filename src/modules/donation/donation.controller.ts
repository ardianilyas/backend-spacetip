import { NextFunction, Request, Response } from "express";
import { DonationService } from "./donation.service";
import { validate } from "../../utils/validate";
import { CreateDonationSchema, createDonationSchema, simulatePaymentSchema } from "./donation.schema";
import { sendSuccess } from "../../utils/response";

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
            return sendSuccess(res, creator, "Creator found", 200);
        } catch (error) {
            next(error);
        }
    }

    async createDonation(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = validate(createDonationSchema, req.body);
            const data = { ...validatedData, donorId: req.user?.userId! } as CreateDonationSchema;
            const response = await this.donationService.createDonation(data);
            return sendSuccess(res, response, "Donation created successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    async simulatePayment(req: Request, res: Response, next: NextFunction) {
        try {
            const data = validate(simulatePaymentSchema, req.body);
            const response = await this.donationService.simulateQrPayment(data.qrId, data.amount);
            return sendSuccess(res, response, "QR Payment simulated successfully", 200);
        } catch (error) {
            next(error);
        }
    }
}