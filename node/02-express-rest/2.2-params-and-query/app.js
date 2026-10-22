import express from "express";

const app = express();

const greetings = {
  he: (name) => `שלום ${name}!`,
  en: (name) => `Hello ${name}!`,
};

app.get("/greet/:name", (req, res) => {
  const lang = req.query.lang === "he" ? "he" : "en";
  res.json({ greeting: greetings[lang](req.params.name), lang });
});

// "3" -> 3, but "", "abc" or a missing value -> null
function toNumber(value) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

app.get("/sum", (req, res) => {
  const a = toNumber(req.query.a);
  const b = toNumber(req.query.b);
  if (a === null || b === null) {
    return res.status(400).json({ error: "a ו-b חייבים להיות מספרים" });
  }
  res.json({ a, b, sum: a + b });
});

export default app;
