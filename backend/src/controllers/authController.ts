import type { Request, Response } from "express";
import authService from "../services/authService.js";

async function register(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }

        const {user, token} = await authService.register(username, email, password);

        return res.status(201).json({ message: "User created successfully", user, token });
        
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "Email already exists") {
                return res.status(409).json({
                    message: err.message
                });
            }
        }

        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }

        const {user, token} = await authService.login(email, password);

        return res.status(200).json({
            message: "Login successful", user, token
        });

    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "Invalid Credentials") {
                return res.status(401).json({
                    message: err.message
                });
            }
        }

        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export default {
    register,
    login
}