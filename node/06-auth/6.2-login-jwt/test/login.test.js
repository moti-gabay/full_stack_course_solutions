import { test, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

useMemoryDb();
const SECRET = "test-secret";
before(() => {
  process.env.JWT_SECRET = SECRET;
});

const dana = { email: "dana@example.com", password: "secret123" };
const me = (token) => request(app).get("/auth/me").set("Authorization", `Bearer ${token}`);

async function registerAndLogin() {
  const { body: user } = await request(app).post("/auth/register").send(dana);
  const { body } = await request(app).post("/auth/login").send(dana);
  return { user, token: body.token };
}

test("login with correct details returns a token", async () => {
  const { user, token } = await registerAndLogin();
  assert.equal(jwt.verify(token, SECRET).sub, user._id);
});

test("a wrong password or an unknown email returns 401 and no token", async () => {
  await registerAndLogin();
  for (const body of [{ ...dana, password: "wrong-password" }, { ...dana, email: "x@y.com" }]) {
    const res = await request(app).post("/auth/login").send(body);
    assert.equal(res.status, 401);
    assert.equal(res.body.token, undefined);
    assert.equal(res.body.error, "מייל או סיסמה שגויים");
  }
});

test("GET /auth/me with a Bearer token returns the logged-in user", async () => {
  const { token } = await registerAndLogin();
  const res = await me(token);
  assert.equal(res.status, 200);
  assert.equal(res.body.email, dana.email);
  assert.equal("password" in res.body, false);
});

test("GET /auth/me without a header returns 401", async () => {
  assert.equal((await request(app).get("/auth/me")).status, 401);
  assert.equal((await request(app).get("/auth/me").set("Authorization", "Token abc")).status, 401);
});

test("a token with one changed character returns 401", async () => {
  const { token } = await registerAndLogin();
  const i = token.length - 10; // inside the signature
  const tampered = token.slice(0, i) + (token[i] === "a" ? "b" : "a") + token.slice(i + 1);
  assert.equal((await me(tampered)).status, 401);
});

test("a token signed with another secret returns 401", async () => {
  const { user } = await registerAndLogin();
  assert.equal((await me(jwt.sign({ sub: user._id }, "another-secret"))).status, 401);
});

test("an expired token returns 401", async () => {
  const { user } = await registerAndLogin();
  const expired = jwt.sign({ sub: user._id, exp: Math.floor(Date.now() / 1000) - 10 }, SECRET);
  assert.equal((await me(expired)).status, 401);
});
