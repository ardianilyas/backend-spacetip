import { Server } from "socket.io";
import http from "http";

let io: Server;

export function initSocket(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: "*" // soon change it 
        },
    });

    io.on("connection", (socket) => {
        console.log(`Client connected : ${socket.id}`);
        // change id to token (important)
        socket.on("join_creator_room", (creatorId: string) => {
            socket.join(`creator_${creatorId}`);
            console.log(`Client ${socket.id} joined from ${creatorId}`);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected", socket.id);
        });        
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("socket.io not initialized");
    }
    return io;
}