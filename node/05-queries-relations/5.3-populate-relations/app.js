import express from "express";
import authorsRouter from "./routes/authors.js";
import booksRouter from "./routes/books.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
app.use(express.json());
app.use("/authors", authorsRouter);
app.use("/books", booksRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
