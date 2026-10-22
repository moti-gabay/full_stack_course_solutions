import express from "express";
import authRouter from "./routes/auth.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
