export function validate(fields) {
  return (req, res, next) => {
    const body = req.body ?? {};
    const missing = fields.filter(
      (field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === ""
    );
    if (missing.length > 0) {
      return res.status(400).json({ error: "חסרים שדות חובה", missing });
    }
    next();
  };
}
