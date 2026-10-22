import { Router } from "express";
import { Recipe, DIFFICULTIES } from "../models/Recipe.js";
import { Review } from "../models/Review.js";

const router = Router();

const SORT_FIELDS = ["createdAt", "prepMinutes", "title"];
const MAX_LIMIT = 50;

// "pasta" is safe, but "(" or ".*" from the user must be matched literally
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function positiveInt(value, fallback) {
  if (value === undefined) return fallback;
  const n = Number(value);
  return typeof value === "string" && Number.isInteger(n) && n >= 1 ? n : null;
}

// turns ?difficulty=easy&maxTime=30&sort=-createdAt&page=2&limit=10&q=pasta into
// a Mongo filter, sort and paging, or returns { error }. Every parameter is optional.
function parseListQuery({ difficulty, maxTime, sort, page, limit, q }) {
  const filter = {};
  if (q !== undefined) {
    if (typeof q !== "string") return { error: "q חייב להיות טקסט" };
    filter.title = { $regex: escapeRegex(q), $options: "i" };
  }
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
  sortBy._id = 1; // tie-breaker: without a stable order, pages can repeat or skip items

  const pageNum = positiveInt(page, 1);
  const limitNum = positiveInt(limit, 10);
  if (pageNum === null || limitNum === null) {
    return { error: "page ו-limit חייבים להיות מספרים שלמים וחיוביים" };
  }
  return { filter, sort: sortBy, page: pageNum, limit: Math.min(limitNum, MAX_LIMIT) };
}

router.get("/", async (req, res) => {
  const { error, filter, sort, page, limit } = parseListQuery(req.query);
  if (error) return res.status(400).json({ error });

  const [data, total] = await Promise.all([
    Recipe.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Recipe.countDocuments(filter),
  ]);
  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
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

router.post("/:id/reviews", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ error: "מתכון לא נמצא" });
  const review = await Review.create({
    recipe: recipe._id,
    rating: req.body?.rating,
    comment: req.body?.comment,
  });
  res.status(201).json(review);
});

export default router;
