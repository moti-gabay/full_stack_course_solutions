import { Router } from "express";
import { Recipe, DIFFICULTIES } from "../models/Recipe.js";

const router = Router();

const SORT_FIELDS = ["createdAt", "prepMinutes", "title"];

// turns ?difficulty=easy&maxTime=30&sort=-createdAt into a Mongo filter and sort,
// or returns { error } for an invalid parameter. Every parameter is optional.
function parseListQuery({ difficulty, maxTime, sort }) {
  const filter = {};
  if (difficulty !== undefined) {
    if (!DIFFICULTIES.includes(difficulty)) {
      return { error: `difficulty חייב להיות אחד מ: ${DIFFICULTIES.join(", ")}` };
    }
    filter.difficulty = difficulty;
  }
  if (maxTime !== undefined) {
    const minutes = Number(maxTime);
    if (typeof maxTime !== "string" || !Number.isInteger(minutes) || minutes < 1) {
      return { error: "maxTime חייב להיות מספר שלם וחיובי" };
    }
    filter.prepMinutes = { $lte: minutes };
  }
  const sortBy = {};
  if (sort !== undefined) {
    const field = typeof sort === "string" ? sort.replace(/^-/, "") : "";
    if (!SORT_FIELDS.includes(field)) {
      return { error: `sort חייב להיות אחד מ: ${SORT_FIELDS.join(", ")} (עם - לסדר יורד)` };
    }
    sortBy[field] = sort.startsWith("-") ? -1 : 1;
  }
  return { filter, sort: sortBy };
}

router.get("/", async (req, res) => {
  const { error, filter, sort } = parseListQuery(req.query);
  if (error) return res.status(400).json({ error });
  res.json(await Recipe.find(filter).sort(sort));
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
