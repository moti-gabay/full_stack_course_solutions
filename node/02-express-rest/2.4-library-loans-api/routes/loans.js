import { Router } from "express";
import { insert, findById, activeLoanOf } from "../db.js";

const router = Router();

router.post("/", (req, res) => {
  const { bookId, memberId } = req.body ?? {};
  if (bookId === undefined || memberId === undefined) {
    return res.status(400).json({ error: "bookId ו-memberId הם שדות חובה" });
  }
  const book = findById("books", bookId);
  const member = findById("members", memberId);
  if (!book || !member) return res.status(404).json({ error: "ספר או חבר לא נמצאו" });
  if (activeLoanOf(book.id)) return res.status(409).json({ error: "הספר כבר מושאל" });

  const loan = insert("loans", {
    bookId: book.id,
    memberId: member.id,
    loanedAt: new Date().toISOString(),
    returnedAt: null,
  });
  res.status(201).json(loan);
});

router.post("/:id/return", (req, res) => {
  const loan = findById("loans", req.params.id);
  if (!loan) return res.status(404).json({ error: "השאלה לא נמצאה" });
  if (loan.returnedAt) return res.status(409).json({ error: "הספר כבר הוחזר" });
  loan.returnedAt = new Date().toISOString();
  res.json(loan);
});

export default router;
