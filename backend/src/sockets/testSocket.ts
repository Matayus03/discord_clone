import { io } from "socket.io-client";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJtYXJpbyIsImlhdCI6MTc4NTUwNDE5MSwiZXhwIjoxNzg1NTA3NzkxfQ.f_cbVBhTWRJE8LCgTxexKDEzNQr964EN4saRdDGA6OM";

const socket = io("http://localhost:3000", {
    auth: {
        token
    }
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("Connection error:", err.message);
});