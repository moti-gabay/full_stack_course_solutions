import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

function captureLogs(t) {
  const lines = [];
  t.mock.method(console, "log", (line) => lines.push(line));
  return lines;
}

test("logs method, url and time for every request", async (t) => {
  const lines = captureLogs(t);
  await request(app).get("/?x=1");
  assert.equal(lines.length, 1);
  assert.match(lines[0], /^\[\d{1,2}:\d{2}:\d{2}\] GET \/\?x=1 200 /);
});

test("also logs a request to a route that does not exist", async (t) => {
  const lines = captureLogs(t);
  await request(app).post("/nope");
  assert.match(lines[0], /POST \/nope 404/);
});

test("logs the response time in milliseconds", async (t) => {
  const lines = captureLogs(t);
  await request(app).get("/slow");
  const ms = Number(lines[0].match(/ ([\d.]+)ms$/)[1]);
  assert.ok(ms >= 290, `expected ~300ms, got ${ms}`);
});
