export function logger(req, res, next) {
  const start = performance.now();
  const time = new Date().toLocaleTimeString("he-IL");

  // "finish" fires after the response was sent, so the duration and status are known
  res.on("finish", () => {
    const ms = (performance.now() - start).toFixed(1);
    console.log(`[${time}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next();
}
