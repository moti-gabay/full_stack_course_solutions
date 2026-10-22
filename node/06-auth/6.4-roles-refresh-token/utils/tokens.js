import jwt from "jsonwebtoken";

const OPTIONS = { algorithms: ["HS256"] };

// short-lived, sent by the client in the Authorization header
export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || "15m",
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, OPTIONS);
}

// long-lived, lives only in an httpOnly cookie; jti lets the server revoke it
export function signRefreshToken(user, jti) {
  return jwt.sign({ sub: user.id, jti }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TTL || "7d",
  });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, OPTIONS);
}
