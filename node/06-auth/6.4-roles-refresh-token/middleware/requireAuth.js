import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/tokens.js";

export async function requireAuth(req, res, next) {
  const [scheme, token] = req.get("Authorization")?.split(" ") ?? [];
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "חסר token" });
  }

  let payload;
  try {
    // throws on a bad signature, a malformed token or an expired one
    payload = verifyAccessToken(token);
  } catch {
    return res.status(401).json({ error: "token לא תקין או שפג תוקפו" });
  }

  req.user = await User.findById(payload.sub);
  if (!req.user) return res.status(401).json({ error: "המשתמש לא קיים" });
  next();
}
