import type { Request, Response } from "express";
import channelService from "../services/channelService.js";

async function createChannel(req: Request, res: Response) {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }

        if (type !== "text" && type !== "voice") {
            return res.status(400).json({
                message: "Invalid channel type"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userId = req.user.id;
        const serverId = Number(req.params.serverId);

        if (isNaN(serverId)) {
            return res.status(400).json({
                message: "Invalid server id"
            });
        }

        const channel = await channelService.createChannel(userId, serverId, name, type);

        return res.status(201).json({
            message: "Channel created successfully", channel
        });
    
    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "Forbidden") {
                return res.status(403).json({
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

async function getChannelsByServer(req: Request, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userId = req.user.id;

        const serverId = Number(req.params.serverId);

        if (isNaN(serverId)) {
            return res.status(400).json({
                message: "Invalid server id"
            })
        }

        const channels = await channelService.getChannelsByServer(serverId, userId);

        return res.status(200).json(channels);

    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "Forbidden") {
                return res.status(403).json({
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
    createChannel,
    getChannelsByServer
}