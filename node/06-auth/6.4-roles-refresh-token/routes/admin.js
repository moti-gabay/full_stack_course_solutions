import { Router } from "express";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

// every route in this router is admin-only
router.use(requireAuth, requireRole("admin"));

router.get("/users", async (req, res) => {
  res.json(await User.find().sort({ createdAt: 1 }));
});

export default router;
