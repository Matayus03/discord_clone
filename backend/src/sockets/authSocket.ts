import type { Socket } from "socket.io";
import jwt from "jsonwebtoken";

function authSocket(socket: Socket, next: Function) {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("Unauthorized"));
    }

    try {
        const user = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        socket.user = user as {
            id: number,
            username: string;
        };

        next();

    } catch (err) {
        next(new Error("Invalid token"));
    }
}

export default authSocket;