import { Response } from "express";
import { generateWithLLM } from "../utils/llm.helper";
import { AuthRequest } from "../middleware/auth.middleware";
import Interaction from "../models/interaction.model";
import cloudinary from "../utils/cloudinary";
import { extractTextFromFile } from "../utils/extractText";
import { exportToDocx } from "../utils/docxExport";

export const generateContent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { prompt, model } = req.body;

  if (!prompt) {
    res.status(400).json({ message: "Prompt is required" });
    return;
  }

  try {
    const response = await generateWithLLM({ prompt, model });

    // Save to session memory
    await Interaction.create({
      userId: req.userId,
      prompt,
      response,
    });

    res.status(200).json({
      response,
      user: req.userId,
    });
  } catch (error: unknown) {
    console.error("Generate Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message: "Failed to generate content",
      error: message,
    });
  }
};

export const generateFromFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;
    const instruction = req.body.instruction || "Summarize this document:";

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const content = await extractTextFromFile(file.buffer, file.mimetype);
    const prompt = `${instruction.trim()}\n\n${content}`;

    const response = await generateWithLLM({ prompt });

    await Interaction.create({
      userId: req.userId,
      prompt,
      response,
      fileName: file.originalname,
      fileType: file.mimetype,
    });

    res.status(200).json({ response });
  } catch (error: unknown) {
    console.error("Generate from file error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to generate from file", error: msg });
  }
};

export const uploadFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const uploadResult = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          res.status(500).json({ message: "Cloudinary upload failed" });
        } else {
          res.status(200).json({
            url: result.secure_url,
            original_filename: result.original_filename,
            size: result.bytes,
            format: result.format,
          });
        }
      }
    );

    // pipe file to Cloudinary stream
    uploadResult.end(file.buffer);
  } catch (error: unknown) {
    console.error("Upload Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Upload failed", error: msg });
  }
};

export const getHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = parseInt(req.query.skip as string) || 0;

  try {
    const history = await Interaction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Interaction.countDocuments({ userId: req.userId });

    res.status(200).json({
      total,
      count: history.length,
      limit,
      skip,
      data: history,
    });
  } catch (error: unknown) {
    console.error("History Pagination Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ message: "Failed to fetch history", error: message });
  }
};

export const exportDocx = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const interaction = await Interaction.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!interaction) {
      res.status(404).json({ message: "Response not found" });
      return;
    }

    await exportToDocx(
      res,
      interaction.response,
      interaction.fileName || "response.docx"
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Failed to export file", error: msg });
  }
};
