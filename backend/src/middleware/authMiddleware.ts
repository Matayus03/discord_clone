import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const [type, token] = authHeader?.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const verifiedToken = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        req.user = verifiedToken as {
            id: number;
            username: string;
        }

        next();
    
    } catch (err) {
        return res.status(401).json({
            message: "Expired or invalid token"
        });
    }
}

export default authMiddleware;