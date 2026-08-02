import { io } from "socket.io-client";

const socket = io(
    "https://discord-clone-k3as.onrender.com",
    {
        autoConnect: false,
        transports: ["websocket"]
    }
);

export default socket;