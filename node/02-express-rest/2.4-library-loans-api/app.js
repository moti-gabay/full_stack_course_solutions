import express from "express";
import booksRouter from "./routes/books.js";
import membersRouter from "./routes/members.js";
import loansRouter from "./routes/loans.js";

const app = express();
app.use(express.json());
app.use("/books", booksRouter);
app.use("/members", membersRouter);
app.use("/loans", loansRouter);

export default app;
