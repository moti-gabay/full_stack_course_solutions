import { test, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import { User } from "../models/User.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

useMemoryDb();
before(() => {
  process.env.JWT_SECRET = "test-secret";
  process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
});

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

// an agent keeps cookies between requests, like a browser
async function loggedIn(email = "dana@example.com") {
  const agent = request.agent(app);
  const creds = { email, password: "secret123" };
  const register = await agent.post("/auth/register").send(creds);
  const login = await agent.post("/auth/login").send(creds);
  return { agent, register, login, token: login.body.accessToken };
}

test("register: new users get the user role", async () => {
  const { register } = await loggedIn();
  assert.equal(register.status, 201);
  assert.equal(register.body.role, "user");
});

test("login: returns an access token and sets an httpOnly refresh cookie", async () => {
  const { login } = await loggedIn();
  assert.equal(login.status, 200);
  assert.ok(login.body.accessToken);
  const cookie = login.headers["set-cookie"].find((c) => c.startsWith("refreshToken="));
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  assert.match(cookie, /Path=\/auth/);
  assert.equal("refreshToken" in login.body, false); // never in the body
});

test("protected access: the access token opens /auth/me", async () => {
  const { agent, token } = await loggedIn();
  assert.equal((await agent.get("/auth/me").set(bearer(token))).status, 200);
  assert.equal((await agent.get("/auth/me")).status, 401);
});

test("roles: a user gets 403 on an admin route, an admin gets 200", async () => {
  const { agent, token } = await loggedIn();
  assert.equal((await agent.get("/api/admin/users").set(bearer(token))).status, 403);
  assert.equal((await agent.get("/api/admin/users")).status, 401);

  await User.updateOne({ email: "dana@example.com" }, { role: "admin" });
  const { body } = await agent.post("/auth/login").send({ email: "dana@example.com", password: "secret123" });
  const res = await agent.get("/api/admin/users").set(bearer(body.accessToken));
  assert.equal(res.status, 200);
  assert.equal(res.body.length, 1);
  assert.equal("refreshTokenId" in res.body[0], false);
});

test("refresh: after the access token expires, the cookie gets a new one", async (t) => {
  process.env.ACCESS_TOKEN_TTL = "-10s"; // the access token is already expired when issued
  t.after(() => delete process.env.ACCESS_TOKEN_TTL);
  const { agent, token } = await loggedIn();
  delete process.env.ACCESS_TOKEN_TTL;

  assert.equal((await agent.get("/auth/me").set(bearer(token))).status, 401);

  const refreshed = await agent.post("/auth/refresh");
  assert.equal(refreshed.status, 200);
  assert.equal((await agent.get("/auth/me").set(bearer(refreshed.body.accessToken))).status, 200);
});

test("refresh rotates the token: the old cookie stops working", async () => {
  const { agent, login } = await loggedIn();
  const oldCookie = login.headers["set-cookie"][0].split(";")[0];
  assert.equal((await agent.post("/auth/refresh")).status, 200);
  assert.equal((await request(app).post("/auth/refresh").set("Cookie", oldCookie)).status, 401);
});

test("refresh without a cookie returns 401", async () => {
  assert.equal((await request(app).post("/auth/refresh")).status, 401);
});

test("logout: clears the cookie, and refresh fails afterwards, even with the old cookie", async () => {
  const { agent, login } = await loggedIn();
  const oldCookie = login.headers["set-cookie"][0].split(";")[0];

  const logout = await agent.post("/auth/logout");
  assert.equal(logout.status, 204);
  assert.match(logout.headers["set-cookie"][0], /refreshToken=;/);

  assert.equal((await agent.post("/auth/refresh")).status, 401);
  assert.equal((await request(app).post("/auth/refresh").set("Cookie", oldCookie)).status, 401);
});

test("login limiter: after 5 failures in a row even the right password is blocked", async () => {
  const { agent } = await loggedIn("limit@example.com");
  for (let i = 0; i < 5; i++) {
    const res = await agent.post("/auth/login").send({ email: "limit@example.com", password: "wrong-password" });
    assert.equal(res.status, 401);
  }
  const blocked = await agent.post("/auth/login").send({ email: "limit@example.com", password: "secret123" });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers["retry-after"]) > 0);

  // other accounts are not affected
  const { login } = await loggedIn("other@example.com");
  assert.equal(login.status, 200);
});

test("login limiter: a successful login resets the counter", async () => {
  const { agent } = await loggedIn("reset@example.com");
  const attempt = (password) => agent.post("/auth/login").send({ email: "reset@example.com", password });
  for (let i = 0; i < 4; i++) await attempt("wrong-password");
  assert.equal((await attempt("secret123")).status, 200);
  for (let i = 0; i < 4; i++) await attempt("wrong-password");
  assert.equal((await attempt("secret123")).status, 200);
});
