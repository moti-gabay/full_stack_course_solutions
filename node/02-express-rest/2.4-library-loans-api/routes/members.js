import { Router } from "express";
import { db, insert, findById } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(db.members);
});

router.get("/:id", (req, res) => {
  const member = findById("members", req.params.id);
  if (!member) return res.status(404).json({ error: "חבר לא נמצא" });
  res.json(member);
});

router.post("/", (req, res) => {
  const { name } = req.body ?? {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name הוא שדה חובה" });
  }
  res.status(201).json(insert("members", { name }));
});

router.get("/:id/loans", (req, res) => {
  const member = findById("members", req.params.id);
  if (!member) return res.status(404).json({ error: "חבר לא נמצא" });
  const active = db.loans.filter((l) => l.memberId === member.id && l.returnedAt === null);
  res.json(active.map((loan) => ({ ...loan, book: findById("books", loan.bookId) })));
});

export default router;
