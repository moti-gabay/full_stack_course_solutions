import { Router } from "express";

const router = Router();

let nextId = 3;
const recipes = [
  { id: 1, title: "שקשוקה", ingredients: ["ביצים", "עגבניות"], difficulty: "easy", prepMinutes: 20 },
  { id: 2, title: "פסטה ברוטב שמנת", ingredients: ["פסטה", "שמנת"], difficulty: "medium", prepMinutes: 25 },
];

const FIELDS = ["title", "ingredients", "difficulty", "prepMinutes"];

// returns an error message, or null when the body is valid
function validate(body, { partial = false } = {}) {
  if (!body || typeof body !== "object") return "גוף הבקשה חייב להיות JSON";
  if (!partial || "title" in body) {
    if (typeof body.title !== "string" || body.title.trim() === "") return "title הוא שדה חובה";
  }
  if ("ingredients" in body && !Array.isArray(body.ingredients)) return "ingredients חייב להיות מערך";
  if ("prepMinutes" in body && typeof body.prepMinutes !== "number") return "prepMinutes חייב להיות מספר";
  return null;
}

// copy only the known fields, so a client can't overwrite id
function pick(body) {
  return Object.fromEntries(FIELDS.filter((f) => f in body).map((f) => [f, body[f]]));
}

function findRecipe(id) {
  return recipes.find((r) => r.id === Number(id));
}

router.get("/", (req, res) => {
  res.json(recipes);
});

router.get("/:id", (req, res) => {
  const recipe = findRecipe(req.params.id);
  if (!recipe) return res.status(404).json({ error: "מתכון לא נמצא" });
  res.json(recipe);
});

router.post("/", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });
  const recipe = { id: nextId++, ingredients: [], ...pick(req.body) };
  recipes.push(recipe);
  res.status(201).json(recipe);
});

router.patch("/:id", (req, res) => {
  const recipe = findRecipe(req.params.id);
  if (!recipe) return res.status(404).json({ error: "מתכון לא נמצא" });
  const error = validate(req.body, { partial: true });
  if (error) return res.status(400).json({ error });
  Object.assign(recipe, pick(req.body));
  res.json(recipe);
});

router.delete("/:id", (req, res) => {
  const index = recipes.findIndex((r) => r.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "מתכון לא נמצא" });
  recipes.splice(index, 1);
  res.sendStatus(204);
});

export default router;
