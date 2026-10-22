import express from "express";
import recipesRouter from "./routes/recipes.js";
import statsRouter from "./routes/stats.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
app.use(express.json());
app.use("/api/recipes", recipesRouter);
app.use("/api/stats", statsRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
