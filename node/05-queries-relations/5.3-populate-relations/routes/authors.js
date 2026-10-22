import { Router } from "express";
import { Author } from "../models/Author.js";
import { Book } from "../models/Book.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await Author.find());
});

router.get("/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ error: "סופר לא נמצא" });
  res.json(author);
});

router.post("/", async (req, res) => {
  res.status(201).json(await Author.create(req.body));
});

router.get("/:id/books", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ error: "סופר לא נמצא" });
  res.json(await Book.find({ author: author._id }));
});

router.delete("/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ error: "סופר לא נמצא" });
  if (await Book.exists({ author: author._id })) {
    return res.status(409).json({ error: "אי אפשר למחוק סופר שיש לו ספרים" });
  }
  await author.deleteOne();
  res.sendStatus(204);
});

export default router;
