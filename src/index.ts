import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./utils/db";
import authRoutes from "./routes/auth.route";
import aiRoutes from "./routes/ai.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// CORS config for frontend (localhost:5173)
app.use(
  cors({
    origin: "*", // allow all origins (any port, any domain)
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (_req, res) => {
  res.send("Grade Genie Backend (TS) is running");
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});
