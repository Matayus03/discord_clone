import type { Request, Response } from "express";
import messageService from "../services/messageService.js";

async function createMessage(req: Request, res: Response) {
    try {

        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                message: "Empty message"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userId = req.user.id;
        const channelId = Number(req.params.channelId);

        if (isNaN(channelId)) {
            return res.status(400).json({
                message: "Invalid channel id"
            });
        }

        const message = await messageService.createMessage(userId, channelId, content);

        return res.status(201).json({
            message
        });

    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "Channel not found") {
                return res.status(404).json({
                    message: err.message
                });
            }

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

async function getMessagesByChannel(req: Request, res: Response) {
    try {

        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userId = req.user.id;

        const channelId = Number(req.params.channelId);

        if (isNaN(channelId)) {
            return res.status(400).json({
                message: "Invalid channel id"
            });
        }

        const messages = await messageService.getMessagesByChannel(userId, channelId);

        return res.status(200).json(messages);

    } catch (err) {
        if (err instanceof Error) {
            if (err.message === "Channel not found") {
                return res.status(404).json({
                    message: err.message
                });
            }

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
    createMessage,
    getMessagesByChannel
}