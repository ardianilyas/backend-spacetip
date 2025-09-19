import { io } from "socket.io-client";
import { prisma } from "../../src/config/prisma"; // sesuaikan path prisma client kamu

async function main() {
  // Ambil 1 data creator dari DB (misalnya yang pertama)
  const creator = await prisma.creator.findFirst();
  
  if (!creator) {
    console.error("No creator found in database");
    process.exit(1);
  }

  const socket = io("http://localhost:8000", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to server", socket.id);

    socket.emit("join_creator_room", creator.token);

    console.log(`Joined room ${creator.token}, waiting for donations...`);
  });

  socket.on("donation_message", (data) => {
    console.log("New donation received: ", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
}

main();