import type { Server } from "socket.io";
import authSocket from "./authSocket.js";
import setupMessageSocket from "./messageSocket.js";
import setupVoiceSocket from "./voiceSocket.js";

function setupSocket(io: Server) {

    io.use(authSocket);

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        console.log("User:", socket.user);
    });

    setupMessageSocket(io);
    setupVoiceSocket(io);

}

export default setupSocket;