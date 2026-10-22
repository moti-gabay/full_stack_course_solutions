import { Router } from "express";
import { Recipe } from "../models/Recipe.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// loads the recipe and lets the request continue only for its owner
async function requireOwner(req, res, next) {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ error: "מתכון לא נמצא" });
  if (!recipe.owner.equals(req.user._id)) {
    return res.status(403).json({ error: "רק מי שיצר את המתכון יכול לשנות אותו" });
  }
  req.recipe = recipe;
  next();
}

router.get("/", async (req, res) => {
  res.json(await Recipe.find());
});

// must come before "/:id", otherwise "mine" is treated as an id
router.get("/mine", requireAuth, async (req, res) => {
  res.json(await Recipe.find({ owner: req.user._id }));
});

router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ error: "מתכון לא נמצא" });
  res.json(recipe);
});

router.post("/", requireAuth, async (req, res) => {
  // owner always comes from the token, never from the body
  const recipe = await Recipe.create({ ...req.body, owner: req.user._id });
  res.status(201).json(recipe);
});

router.patch("/:id", requireAuth, requireOwner, async (req, res) => {
  const { owner, ...updates } = req.body ?? {};
  req.recipe.set(updates);
  res.json(await req.recipe.save());
});

router.delete("/:id", requireAuth, requireOwner, async (req, res) => {
  await req.recipe.deleteOne();
  res.sendStatus(204);
});

export default router;
