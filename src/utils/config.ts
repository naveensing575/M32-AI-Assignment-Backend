import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is missing from environment variables!");
}
