import { Router } from "express";
import { DonationRepository } from "./donation.repository";
import { DonationService } from "./donation.service";
import { DonationController } from "./donation.controller";
import { requireAuth } from "../../middlewares/auth";
import { TransactionRepository } from "../../shared/transaction/transaction.repository";
import { TransactionService } from "../../shared/transaction/transaction.service";

const router = Router();

const transactionRepo = new TransactionRepository();
const tranasactionService = new TransactionService(transactionRepo);

const donationRepo = new DonationRepository();
const donationService = new DonationService(donationRepo, tranasactionService);
const controller = new DonationController(donationService);

router.use(requireAuth);

router.get("/:username", controller.getCreatorByUsername);
router.post("/:username", controller.createDonation);
router.post("/simulate/:qrId", controller.simulatePayment);

export default router;