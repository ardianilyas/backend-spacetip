import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { WithdrawalRepository } from "./withdrawal.repository";
import { WithdrawalService } from "./withdrawal.service";
import { WithdrawalController } from "./withdrawal.controller";

const router = Router();

const withdrawalRepo = new WithdrawalRepository();
const withdrawalService = new WithdrawalService(withdrawalRepo);
const controller = new WithdrawalController(withdrawalService);

router.use(requireAuth);

router.post("/", controller.createWithdrawal);

export default router;