import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js";
import adminRouter from "./routes/admin.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/admin", adminRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
