export function notFound(req, res) {
  res.status(404).json({ error: "הנתיב לא קיים", requestId: req.id });
}

export function errorHandler(err, req, res, next) {
  console.error(`[${req.id}] ${err.stack}`);
  res.status(500).json({ error: "שגיאת שרת", requestId: req.id });
}
