import serverController from "../controllers/serverController.js";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/servers", authMiddleware, serverController.createServer);

router.get("/servers", authMiddleware, serverController.getUserServers);

export default router;