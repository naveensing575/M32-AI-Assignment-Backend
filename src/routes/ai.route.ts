import { Router } from "express";
import { generateContent, getHistory } from "../controllers/ai.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/generate", authMiddleware, generateContent);
router.get("/history", authMiddleware, getHistory);

export default router;
