import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "ברוכים הבאים לשרת הראשון שלי" });
});

app.get("/about", (req, res) => {
  res.json({ name: "three-routes", description: "שרת Express עם שלושה נתיבים" });
});

app.get("/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

export default app;
