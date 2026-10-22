// fixed window: every IP gets `max` requests per `windowMs`
export function rateLimit({ windowMs = 60_000, max = 10 } = {}) {
  const hits = new Map(); // ip -> { count, resetAt }

  // remove IPs whose window is over, so the Map doesn't grow forever
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(ip);
    }
  }, windowMs);
  cleanup.unref(); // don't keep the process alive just for the timer

  function limiter(req, res, next) {
    const now = Date.now();
    let entry = hits.get(req.ip);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(req.ip, entry);
    }
    entry.count++;

    if (entry.count > max) {
      res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ error: "יותר מדי בקשות, נסו שוב בעוד רגע" });
    }
    next();
  }

  limiter.hits = hits; // exposed for tests
  return limiter;
}
