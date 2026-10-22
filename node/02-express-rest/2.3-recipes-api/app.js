import express from "express";
import recipesRouter from "./routes/recipes.js";

const app = express();
app.use(express.json());
app.use("/api/recipes", recipesRouter);

export default app;
