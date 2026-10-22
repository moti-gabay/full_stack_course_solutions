import express from "express";
import { requestId } from "./middleware/requestId.js";
import { logger } from "./middleware/logger.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { notFound, errorHandler } from "./middleware/errors.js";

export function createApp(limits) {
  const app = express();
  app.use(requestId);
  app.use(logger);
  app.use(rateLimit(limits));

  app.get("/", (req, res) => {
    res.json({ message: "שלום" });
  });

  app.get("/crash", () => {
    throw new Error("קריסה מכוונת");
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export default createApp();
