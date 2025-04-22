import { Router } from "express";
const router = Router();

router.post("/register", async (req, res) => {
  // TODO: Register logic
  res.send("Register route");
});

router.post("/login", async (req, res) => {
  // TODO: Login logic
  res.send("Login route");
});

export default router;
