import authController from "../controllers/authController.js";
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", authMiddleware, (req, res) => {
    res.json(req.user);
})

export default router;