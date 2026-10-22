export function notFound(req, res) {
  res.status(404).json({ error: "הנתיב לא קיים" });
}

export function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    const details = Object.fromEntries(Object.entries(err.errors).map(([f, e]) => [f, e.message]));
    return res.status(400).json({ error: "נתונים לא תקינים", details });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: `ערך לא תקין בשדה ${err.path}` });
  }
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message }); // e.g. malformed JSON body
  }
  console.error(err);
  res.status(500).json({ error: "שגיאת שרת" });
}
