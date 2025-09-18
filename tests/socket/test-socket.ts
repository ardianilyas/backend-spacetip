import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
    transports: ["websocket"],
});

socket.on("connect", () => {
    console.log("Connected to server", socket.id);

    socket.emit("join_creator_room", "0fe46188-7d8f-4cc5-b219-a21f0efd0c59");

    console.log("Joined room 0fe46188-7d8f-4cc5-b219-a21f0efd0c59, waiting for donations. . .");  
});

socket.on("donation_message", (data) => {
    console.log("New donation received: ", data);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});