import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import { User } from "../models/User.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

useMemoryDb();
const register = (body) => request(app).post("/auth/register").send(body);
const dana = { email: "dana@example.com", password: "secret123" };

test("register succeeds and the response does not include the password", async () => {
  const res = await register(dana);
  assert.equal(res.status, 201);
  assert.equal(res.body.email, "dana@example.com");
  assert.ok(res.body._id);
  assert.equal("password" in res.body, false);
  assert.doesNotMatch(res.text, /secret123|\$2b\$/);
});

test("the database stores a bcrypt hash, not the password", async () => {
  await register(dana);
  const user = await User.findOne({ email: dana.email }).select("+password");
  assert.match(user.password, /^\$2b\$10\$/);
  assert.notEqual(user.password, dana.password);
});

test("password is not loaded by default (select: false)", async () => {
  await register(dana);
  const user = await User.findOne({ email: dana.email });
  assert.equal(user.password, undefined);
});

test("registering the same email again returns 409, case-insensitive", async () => {
  await register(dana);
  assert.equal((await register(dana)).status, 409);
  assert.equal((await register({ ...dana, email: "DANA@example.com" })).status, 409);
});

test("invalid email, short or missing password return 400", async () => {
  assert.equal((await register({ email: "not-an-email", password: "secret123" })).status, 400);
  assert.equal((await register({ email: "a@b.co", password: "short" })).status, 400);
  assert.equal((await register({ email: "a@b.co" })).status, 400);
});
