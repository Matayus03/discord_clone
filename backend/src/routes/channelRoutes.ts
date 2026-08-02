import channelController from "../controllers/channelController.js";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/servers/:serverId/channels", authMiddleware, channelController.createChannel);

router.get("/servers/:serverId/channels", authMiddleware, channelController.getChannelsByServer);

export default router;