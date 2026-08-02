import { Router } from "express";
import memberController from "../controllers/memberController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/servers/:serverId/members", authMiddleware, memberController.getMembersByServer);

export default router;