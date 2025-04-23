import { Router } from "express";
import { generateContent } from "../controllers/ai.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/generate", authMiddleware, generateContent);

export default router;
