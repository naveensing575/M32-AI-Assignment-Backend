import { Router } from "express";
import {
  generateContent,
  getHistory,
  uploadFile,
  generateFromFile,
  exportDocx,
} from "../controllers/ai.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
const router = Router();

router.post("/generate", authMiddleware, generateContent);
router.get("/history", authMiddleware, getHistory);
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.post(
  "/generate-from-file",
  authMiddleware,
  upload.single("file"),
  generateFromFile
);

router.get("/export/:id", authMiddleware, exportDocx);

export default router;
