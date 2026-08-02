import type { JwtPayload } from "jsonwebtoken";

declare module "socket.io" {
    interface Socket {
        user?: {
            id: number;
            username: string;
        };
    }
}