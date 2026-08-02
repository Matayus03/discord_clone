import messageController from "../controllers/messageController.js";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/channels/:channelId/messages", authMiddleware, messageController.createMessage);

router.get("/channels/:channelId/messages", authMiddleware, messageController.getMessagesByChannel);

export default router;