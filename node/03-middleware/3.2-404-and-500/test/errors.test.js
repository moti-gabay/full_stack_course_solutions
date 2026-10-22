import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("GET /nope returns 404 with a JSON body", async () => {
  const res = await request(app).get("/nope");
  assert.equal(res.status, 404);
  assert.match(res.headers["content-type"], /application\/json/);
  assert.match(res.body.error, /\/nope/);
});

test("GET /crash returns a JSON error from the central handler", async (t) => {
  const errors = t.mock.method(console, "error", () => {});
  const res = await request(app).get("/crash");
  assert.equal(res.status, 500);
  assert.deepEqual(res.body, { error: "שגיאת שרת" });
  assert.equal(errors.mock.callCount(), 1); // the real error is logged on the server
});

test("the server keeps answering after /crash", async (t) => {
  t.mock.method(console, "error", () => {});
  await request(app).get("/crash");
  const res = await request(app).get("/");
  assert.equal(res.status, 200);
});
