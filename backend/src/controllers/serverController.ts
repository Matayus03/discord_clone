import type { Request, Response } from "express";
import serverService from "../services/serverService.js";

async function createServer(req: Request, res: Response) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userId = req.user.id

        const server = await serverService.createServer(userId, name);

        return res.status(201).json({
            message: "Server created successfully", server
        });
    
    } catch(err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getUserServers(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userId = req.user.id;

        const servers = await serverService.getUserServers(userId);

        return res.status(200).json(servers);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export default {
    createServer,
    getUserServers
}