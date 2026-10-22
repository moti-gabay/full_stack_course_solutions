const PROTECTED = ["POST", "PATCH", "DELETE"];

export function requireApiKey(req, res, next) {
  if (!PROTECTED.includes(req.method)) return next();

  const key = req.get("x-api-key");
  if (!process.env.API_KEY || key !== process.env.API_KEY) {
    return res.status(401).json({ error: "מפתח API חסר או שגוי" });
  }
  next();
}
