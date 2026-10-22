import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

const db = useMemoryDb();
const api = () => request(app);
const valid = { title: "שקשוקה", ingredients: ["ביצים"], difficulty: "easy", prepMinutes: 20 };
const MISSING_ID = "000000000000000000000000";

test("full CRUD against the database", async () => {
  const created = await api().post("/api/recipes").send(valid);
  assert.equal(created.status, 201);
  const id = created.body._id;

  assert.equal((await api().get("/api/recipes")).body.length, 1);
  assert.equal((await api().get(`/api/recipes/${id}`)).body.title, "שקשוקה");

  const patched = await api().patch(`/api/recipes/${id}`).send({ prepMinutes: 25 });
  assert.equal(patched.status, 200);
  assert.equal(patched.body.prepMinutes, 25);
  assert.equal(patched.body.title, "שקשוקה");

  assert.equal((await api().delete(`/api/recipes/${id}`)).status, 204);
  assert.equal((await api().get(`/api/recipes/${id}`)).status, 404);
});

test("unknown ids return 404", async () => {
  assert.equal((await api().get(`/api/recipes/${MISSING_ID}`)).status, 404);
  assert.equal((await api().patch(`/api/recipes/${MISSING_ID}`).send({ prepMinutes: 5 })).status, 404);
  assert.equal((await api().delete(`/api/recipes/${MISSING_ID}`)).status, 404);
});

test("the data survives a reconnect (server restart)", async () => {
  await api().post("/api/recipes").send(valid);
  await mongoose.disconnect();
  await mongoose.connect(db.uri);
  assert.equal((await api().get("/api/recipes")).body.length, 1);
});

for (const [name, body] of [
  ["missing title", { prepMinutes: 10 }],
  ["2-char title", { title: "אב" }],
  ['difficulty "extreme"', { title: "פסטה", difficulty: "extreme" }],
  ["prepMinutes 0", { title: "פסטה", prepMinutes: 0 }],
]) {
  test(`POST with ${name} returns 400`, async () => {
    const res = await api().post("/api/recipes").send(body);
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "נתונים לא תקינים");
  });
}

test("a created recipe has createdAt and updatedAt", async () => {
  const { body } = await api().post("/api/recipes").send(valid);
  assert.ok(Date.parse(body.createdAt));
  assert.ok(Date.parse(body.updatedAt));
});

test("an invalid id (CastError) returns 400, not 500", async () => {
  const res = await api().get("/api/recipes/abc");
  assert.equal(res.status, 400);
});
