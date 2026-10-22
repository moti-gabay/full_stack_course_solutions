import express from "express";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "השרת עובד" });
});

app.get("/crash", () => {
  throw new Error("Boom! קריסה מכוונת לבדיקה");
});

app.use(notFound);
app.use(errorHandler);

export default app;
