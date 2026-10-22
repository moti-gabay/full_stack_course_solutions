import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

const api = () => request(app);

test("GET /api/recipes returns 200 with a list", async () => {
  const res = await api().get("/api/recipes");
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
});

test("POST creates a recipe (201), invalid body returns 400", async () => {
  const created = await api().post("/api/recipes").send({ title: "סלט", prepMinutes: 5 });
  assert.equal(created.status, 201);
  assert.equal(created.body.title, "סלט");
  assert.ok(created.body.id);

  assert.equal((await api().post("/api/recipes").send({ prepMinutes: 5 })).status, 400);
  assert.equal((await api().post("/api/recipes").send({ title: "x", prepMinutes: "5" })).status, 400);
});

test("GET /:id returns 200, unknown id returns 404", async () => {
  assert.equal((await api().get("/api/recipes/1")).status, 200);
  assert.equal((await api().get("/api/recipes/999")).status, 404);
});

test("PATCH updates only the sent fields (200), unknown id returns 404", async () => {
  const res = await api().patch("/api/recipes/1").send({ prepMinutes: 15, id: 77 });
  assert.equal(res.status, 200);
  assert.equal(res.body.prepMinutes, 15);
  assert.equal(res.body.id, 1);
  assert.equal(res.body.title, "שקשוקה");
  assert.equal((await api().patch("/api/recipes/999").send({ prepMinutes: 1 })).status, 404);
});

test("DELETE returns 204, then GET returns 404", async () => {
  assert.equal((await api().delete("/api/recipes/2")).status, 204);
  assert.equal((await api().get("/api/recipes/2")).status, 404);
  assert.equal((await api().delete("/api/recipes/2")).status, 404);
});
