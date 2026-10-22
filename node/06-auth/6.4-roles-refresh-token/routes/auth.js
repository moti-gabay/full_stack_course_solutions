import { Router } from "express";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { loginLimiter, recordFailure, resetFailures } from "../middleware/loginLimiter.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

const router = Router();

const COOKIE = "refreshToken";
const cookieOptions = {
  httpOnly: true, // JavaScript in the browser can't read it, so XSS can't steal it
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict",
  path: "/auth", // sent only to /auth/refresh and /auth/logout, not with every request
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// a new refresh token id replaces the previous one, so an old cookie stops working
async function issueTokens(user, res) {
  user.refreshTokenId = randomUUID();
  await user.save();
  res.cookie(COOKIE, signRefreshToken(user, user.refreshTokenId), cookieOptions);
  return { accessToken: signAccessToken(user) };
}

router.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = await User.create({ email, password });
  res.status(201).json(user);
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "email ו-password הם שדות חובה" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    recordFailure(req);
    return res.status(401).json({ error: "מייל או סיסמה שגויים" });
  }

  resetFailures(req);
  res.json(await issueTokens(user, res));
});

router.post("/refresh", async (req, res) => {
  let payload;
  try {
    payload = verifyRefreshToken(req.cookies[COOKIE]);
  } catch {
    return res.status(401).json({ error: "refresh token חסר או לא תקין" });
  }

  const user = await User.findById(payload.sub).select("+refreshTokenId");
  if (!user || user.refreshTokenId !== payload.jti) {
    return res.status(401).json({ error: "refresh token בוטל" });
  }
  res.json(await issueTokens(user, res));
});

router.post("/logout", async (req, res) => {
  try {
    const { sub } = verifyRefreshToken(req.cookies[COOKIE]);
    await User.updateOne({ _id: sub }, { $unset: { refreshTokenId: 1 } });
  } catch {
    // no valid cookie: nothing to revoke, still clear it
  }
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie(COOKIE, clearOptions);
  res.sendStatus(204);
});

router.get("/me", requireAuth, (req, res) => {
  res.json(req.user);
});

export default router;
