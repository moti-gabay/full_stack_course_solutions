import { Router } from "express";
import { Book } from "../models/Book.js";
import { Author } from "../models/Author.js";

const router = Router();

router.get("/", async (req, res) => {
  res.json(await Book.find().populate("author", "name"));
});

router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author", "name");
  if (!book) return res.status(404).json({ error: "ספר לא נמצא" });
  res.json(book);
});

router.post("/", async (req, res) => {
  // a ref is not a foreign key: MongoDB will happily store an id of an author that doesn't exist
  if (req.body?.author && !(await Author.exists({ _id: req.body.author }))) {
    return res.status(400).json({ error: "הסופר לא קיים" });
  }
  const book = await Book.create(req.body);
  res.status(201).json(await book.populate("author", "name"));
});

export default router;
