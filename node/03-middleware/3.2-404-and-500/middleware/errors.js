export function notFound(req, res) {
  res.status(404).json({ error: `הנתיב ${req.method} ${req.originalUrl} לא קיים` });
}

// four parameters: that's how Express knows this is an error handler
export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status ?? 500;
  res.status(status).json({ error: status === 500 ? "שגיאת שרת" : err.message });
}
