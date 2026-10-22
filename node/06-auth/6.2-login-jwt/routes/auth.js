import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = await User.create({ email, password });
  res.status(201).json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "email ו-password הם שדות חובה" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  // the same answer for "no such user" and "wrong password", so emails can't be probed
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "מייל או סיסמה שגויים" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
  res.json({ token });
});

router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

export default router;
