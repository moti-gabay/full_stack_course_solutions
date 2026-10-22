import { Router } from "express";
import { db, insert, findById, activeLoanOf } from "../db.js";

const router = Router();

const withStatus = (book) => ({ ...book, available: !activeLoanOf(book.id) });

router.get("/", (req, res) => {
  res.json(db.books.map(withStatus));
});

router.get("/:id", (req, res) => {
  const book = findById("books", req.params.id);
  if (!book) return res.status(404).json({ error: "ספר לא נמצא" });
  res.json(withStatus(book));
});

router.post("/", (req, res) => {
  const { title, author } = req.body ?? {};
  if (typeof title !== "string" || !title.trim() || typeof author !== "string" || !author.trim()) {
    return res.status(400).json({ error: "title ו-author הם שדות חובה" });
  }
  res.status(201).json(insert("books", { title, author }));
});

export default router;
