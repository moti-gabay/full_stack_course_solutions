import express from "express";
import recipesRouter from "./routes/recipes.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
app.use(express.json());
app.use("/api/recipes", recipesRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
