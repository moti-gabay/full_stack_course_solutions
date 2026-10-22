import { Router } from "express";
import { Recipe } from "../models/Recipe.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await Recipe.find());
});

router.get("/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ error: "מתכון לא נמצא" });
  res.json(recipe);
});

router.post("/", async (req, res) => {
  const recipe = await Recipe.create(req.body);
  res.status(201).json(recipe);
});

router.patch("/:id", async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!recipe) return res.status(404).json({ error: "מתכון לא נמצא" });
  res.json(recipe);
});

router.delete("/:id", async (req, res) => {
  // soft delete: the document stays in the database with deletedAt
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
  if (!recipe) return res.status(404).json({ error: "מתכון לא נמצא" });
  res.sendStatus(204);
});

export default router;
