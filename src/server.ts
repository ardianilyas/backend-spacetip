import app from "./app";
import http from "http";
import { initSocket } from "./libs/websocket/socket";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});