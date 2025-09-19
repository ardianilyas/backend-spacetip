import { getIO } from "../../libs/websocket/socket";
import { appEventEmitter } from "../eventEmitter";
import { DonationPaidPayload } from "../types/donation.type";

appEventEmitter.on("donation.paid", (payload: DonationPaidPayload) => {
    const io = getIO();

    io.to(`creator_${payload.creatorToken}`).emit("donation_message", {
        donationId: payload.donationId,
        amount: payload.amount,
        message: payload.message,
        donorName: payload.donorName,
    });
})