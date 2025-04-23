import { Response } from "express";
import { generateWithLLM } from "../utils/llm.helper";
import { AuthRequest } from "../middleware/auth.middleware";
import Interaction from "../models/interaction.model";

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
