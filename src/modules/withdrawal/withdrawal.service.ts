import { CreateDisbursementPayload, XenditService } from "../../libs/xendit";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import { WithdrawalRepository } from "./withdrawal.repository";
import { CreateWithdrawalSchema } from "./withdrawal.schema";
import { v4 as uuidv4 } from "uuid";

const WITHDRAWAL_PREFIX = "wdspace-";
const PLATFORM_FEE_RATE = 0.05;
const TRANSFER_FEE = 5000;

export class WithdrawalService {
  constructor(private withdrawalRepo: WithdrawalRepository) {}

  private _calculateNetAmount(amountRequested: number) {
    const platformFee = Math.floor(amountRequested * PLATFORM_FEE_RATE);
    return amountRequested - platformFee - TRANSFER_FEE;
  }

  async createWithdrawal(data: CreateWithdrawalSchema) {
    const externalId = WITHDRAWAL_PREFIX + uuidv4();

    const creatorBalance = await this.withdrawalRepo.getCreatorBalance(data.creatorId);
    if (!creatorBalance) throw new NotFoundError("Creator not found");

    if (data.amount > creatorBalance.balance) {
      throw new BadRequestError("Insufficient balance");
    }

    const netAmount = this._calculateNetAmount(data.amount);

    if (netAmount <= 0) {
      throw new BadRequestError("Amount too small to withdraw after fees");
    }

    const payload: CreateDisbursementPayload = {
      amount: netAmount,
      externalId,
      bankCode: data.bankCode,
      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
    };

    const response = await XenditService.disbursement(payload);

    await this.withdrawalRepo.createWithdrawal({
      ...data,
      externalId,
      amount: data.amount,
      amountToBeTransferred: netAmount,
    });

    return response;
  }
}