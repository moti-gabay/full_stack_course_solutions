import { Router } from "express";
import { validate } from "../middleware/validate.js";

const router = Router();

let nextId = 2;
const books = [{ id: 1, title: "1984", author: "George Orwell" }];

function findBook(req, res, next) {
  req.book = books.find((b) => b.id === Number(req.params.id));
  if (!req.book) return res.status(404).json({ error: "ספר לא נמצא" });
  next();
}

router.get("/", (req, res) => {
  res.json(books);
});

router.post("/", validate(["title", "author"]), (req, res) => {
  const book = { id: nextId++, title: req.body.title, author: req.body.author };
  books.push(book);
  res.status(201).json(book);
});

router.patch("/:id", findBook, (req, res) => {
  const { title, author } = req.body ?? {};
  if (title !== undefined) req.book.title = title;
  if (author !== undefined) req.book.author = author;
  res.json(req.book);
});

router.delete("/:id", findBook, (req, res) => {
  books.splice(books.indexOf(req.book), 1);
  res.sendStatus(204);
});

export default router;
