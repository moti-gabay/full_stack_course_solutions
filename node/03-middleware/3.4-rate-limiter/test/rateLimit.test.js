import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import express from "express";
import { createApp } from "../app.js";
import { rateLimit } from "../middleware/rateLimit.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

beforeEach((t) => {
  t.mock.method(console, "log", () => {});
});

test("10 requests pass, the 11th returns 429 with Retry-After", async () => {
  const app = createApp();
  for (let i = 0; i < 10; i++) {
    assert.equal((await request(app).get("/")).status, 200);
  }
  const res = await request(app).get("/");
  assert.equal(res.status, 429);
  const retryAfter = Number(res.headers["retry-after"]);
  assert.ok(retryAfter > 0 && retryAfter <= 60);
});

test("requests pass again after the window is over", async () => {
  const app = createApp({ windowMs: 300, max: 2 });
  await request(app).get("/");
  await request(app).get("/");
  assert.equal((await request(app).get("/")).status, 429);
  await sleep(350);
  assert.equal((await request(app).get("/")).status, 200);
});

test("old entries are cleaned up so the map does not grow forever", async () => {
  const limiter = rateLimit({ windowMs: 100, max: 5 });
  const app = express().set("trust proxy", true).use(limiter).get("/", (req, res) => res.end());
  for (let i = 0; i < 20; i++) {
    await request(app).get("/").set("X-Forwarded-For", `10.0.0.${i}`);
  }
  assert.equal(limiter.hits.size, 20);
  await sleep(250);
  assert.equal(limiter.hits.size, 0);
});

test("every response has an X-Request-Id that also appears in the log line", async (t) => {
  const log = t.mock.method(console, "log", () => {});
  const res = await request(createApp()).get("/");
  const id = res.headers["x-request-id"];
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert.match(log.mock.calls[0].arguments[0], new RegExp(`^\\[${id}\\] GET / 200`));
});

test("the same id appears in the error print and in the error response", async (t) => {
  const err = t.mock.method(console, "error", () => {});
  const res = await request(createApp()).get("/crash");
  const id = res.headers["x-request-id"];
  assert.equal(res.status, 500);
  assert.equal(res.body.requestId, id);
  assert.match(err.mock.calls[0].arguments[0], new RegExp(`^\\[${id}\\] Error: קריסה מכוונת`));
});
