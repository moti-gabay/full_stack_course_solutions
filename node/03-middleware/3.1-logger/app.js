import express from "express";
import { logger } from "./middleware/logger.js";

const app = express();
app.use(logger);

app.get("/", (req, res) => {
  res.json({ message: "שלום" });
});

app.get("/slow", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  res.json({ message: "סוף סוף" });
});

export default app;
