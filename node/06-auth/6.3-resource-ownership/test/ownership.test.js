import { test, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

useMemoryDb();
before(() => {
  process.env.JWT_SECRET = "test-secret";
});

async function userToken(email) {
  const creds = { email, password: "secret123" };
  const { body: user } = await request(app).post("/auth/register").send(creds);
  const { body } = await request(app).post("/auth/login").send(creds);
  return { id: user._id, auth: { Authorization: `Bearer ${body.token}` } };
}

const createRecipe = (auth, title = "שקשוקה") =>
  request(app).post("/api/recipes").set(auth).send({ title, prepMinutes: 20 });

test("user A creates a recipe and is its owner", async () => {
  const a = await userToken("a@example.com");
  const res = await createRecipe(a.auth);
  assert.equal(res.status, 201);
  assert.equal(res.body.owner, a.id);
});

test("owner cannot be set from the body", async () => {
  const a = await userToken("a@example.com");
  const b = await userToken("b@example.com");
  const res = await request(app).post("/api/recipes").set(a.auth).send({ title: "שקשוקה", owner: b.id });
  assert.equal(res.body.owner, a.id);
});

test("creating a recipe requires login", async () => {
  assert.equal((await request(app).post("/api/recipes").send({ title: "שקשוקה" })).status, 401);
});

test("user B gets 403 when editing or deleting A's recipe", async () => {
  const a = await userToken("a@example.com");
  const b = await userToken("b@example.com");
  const { body: recipe } = await createRecipe(a.auth);

  const patch = await request(app).patch(`/api/recipes/${recipe._id}`).set(b.auth).send({ title: "גנוב" });
  assert.equal(patch.status, 403);
  assert.equal((await request(app).delete(`/api/recipes/${recipe._id}`).set(b.auth)).status, 403);
  assert.equal((await request(app).get(`/api/recipes/${recipe._id}`)).body.title, "שקשוקה");
});

test("user A edits and deletes their own recipe", async () => {
  const a = await userToken("a@example.com");
  const b = await userToken("b@example.com");
  const { body: recipe } = await createRecipe(a.auth);

  const patch = await request(app)
    .patch(`/api/recipes/${recipe._id}`)
    .set(a.auth)
    .send({ prepMinutes: 30, owner: b.id });
  assert.equal(patch.status, 200);
  assert.equal(patch.body.prepMinutes, 30);
  assert.equal(patch.body.owner, a.id); // can't give the recipe away

  assert.equal((await request(app).patch(`/api/recipes/${recipe._id}`).set(a.auth).send({ title: "א" })).status, 400);
  assert.equal((await request(app).delete(`/api/recipes/${recipe._id}`).set(a.auth)).status, 204);
  assert.equal((await request(app).get(`/api/recipes/${recipe._id}`)).status, 404);
});

test("GET /api/recipes/mine returns only the logged-in user's recipes", async () => {
  const a = await userToken("a@example.com");
  const b = await userToken("b@example.com");
  await createRecipe(a.auth, "של א 1");
  await createRecipe(a.auth, "של א 2");
  await createRecipe(b.auth, "של ב");

  const res = await request(app).get("/api/recipes/mine").set(a.auth);
  assert.deepEqual(res.body.map((r) => r.title).sort(), ["של א 1", "של א 2"]);
  assert.equal((await request(app).get("/api/recipes")).body.length, 3);
  assert.equal((await request(app).get("/api/recipes/mine")).status, 401);
});
