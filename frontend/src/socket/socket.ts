import { io } from "socket.io-client";

const socket = io(
    "http://192.168.1.18:3000",
    {
        autoConnect: false,
        transports: ["websocket"]
    }
);

export default socket;