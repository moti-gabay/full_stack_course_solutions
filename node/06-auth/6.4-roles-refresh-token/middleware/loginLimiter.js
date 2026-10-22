const MAX_FAILURES = 5;
const BLOCK_MS = 15 * 60 * 1000;

const failures = new Map(); // "ip:email" -> { count, resetAt }

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of failures) if (entry.resetAt <= now) failures.delete(key);
}, BLOCK_MS).unref();

const keyOf = (req) => `${req.ip}:${String(req.body?.email).toLowerCase()}`;

// blocks the request when this ip + email failed too many times in a row
export function loginLimiter(req, res, next) {
  const entry = failures.get(keyOf(req));
  if (entry && entry.count >= MAX_FAILURES && entry.resetAt > Date.now()) {
    res.set("Retry-After", String(Math.ceil((entry.resetAt - Date.now()) / 1000)));
    return res.status(429).json({ error: "יותר מדי ניסיונות התחברות, נסו שוב מאוחר יותר" });
  }
  next();
}

export function recordFailure(req) {
  const key = keyOf(req);
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= Date.now()) {
    failures.set(key, { count: 1, resetAt: Date.now() + BLOCK_MS });
  } else {
    entry.count++;
  }
}

export function resetFailures(req) {
  failures.delete(keyOf(req));
}
