import express from "express";
import { requireApiKey } from "./middleware/apiKey.js";
import booksRouter from "./routes/books.js";

const app = express();
app.use(express.json());
app.use(requireApiKey);
app.use("/api/books", booksRouter);

export default app;
