import { test, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

const KEY = "test-key";
before(() => {
  process.env.API_KEY = KEY;
});

const post = (body) => request(app).post("/api/books").set("x-api-key", KEY).send(body);

test("POST without author returns 400 with author in the missing list", async () => {
  const res = await post({ title: "Dune" });
  assert.equal(res.status, 400);
  assert.deepEqual(res.body.missing, ["author"]);
});

test("POST without both fields lists both", async () => {
  const res = await post({ title: "  " });
  assert.equal(res.status, 400);
  assert.deepEqual(res.body.missing, ["title", "author"]);
});

test("POST with both fields passes validation", async () => {
  const res = await post({ title: "Dune", author: "Frank Herbert" });
  assert.equal(res.status, 201);
});

test("GET passes without x-api-key", async () => {
  assert.equal((await request(app).get("/api/books")).status, 200);
});

for (const method of ["post", "patch", "delete"]) {
  test(`${method.toUpperCase()} without a key or with a wrong key returns 401`, async () => {
    assert.equal((await request(app)[method]("/api/books/1")).status, 401);
    assert.equal((await request(app)[method]("/api/books/1").set("x-api-key", "wrong")).status, 401);
  });
}

test("PATCH and DELETE with the right key pass", async () => {
  const { body } = await post({ title: "Temp", author: "Me" });
  const patched = await request(app)
    .patch(`/api/books/${body.id}`)
    .set("x-api-key", KEY)
    .send({ title: "Temp 2" });
  assert.equal(patched.status, 200);
  assert.equal(patched.body.title, "Temp 2");
  const deleted = await request(app).delete(`/api/books/${body.id}`).set("x-api-key", KEY);
  assert.equal(deleted.status, 204);
});
