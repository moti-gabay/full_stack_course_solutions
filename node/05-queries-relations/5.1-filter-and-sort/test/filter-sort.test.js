import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import { Recipe } from "../models/Recipe.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

useMemoryDb();
const list = (qs = "") => request(app).get(`/api/recipes${qs}`);

beforeEach(async () => {
  // created one by one, so createdAt grows: Salad is the oldest, Stew the newest
  for (const r of [
    { title: "Salad", difficulty: "easy", prepMinutes: 10 },
    { title: "Omelette", difficulty: "easy", prepMinutes: 45 },
    { title: "Lasagna", difficulty: "hard", prepMinutes: 90 },
    { title: "Stew", difficulty: "medium", prepMinutes: 30 },
  ]) {
    await Recipe.create(r);
  }
});

const titles = (res) => res.body.map((r) => r.title);

test("without parameters every recipe is returned", async () => {
  assert.equal((await list()).body.length, 4);
});

test("difficulty=easy returns only easy recipes", async () => {
  assert.deepEqual(titles(await list("?difficulty=easy")).sort(), ["Omelette", "Salad"]);
});

test("maxTime=30 returns only recipes of up to 30 minutes", async () => {
  assert.deepEqual(titles(await list("?maxTime=30")).sort(), ["Salad", "Stew"]);
});

test("sort=-createdAt returns the newest first", async () => {
  assert.deepEqual(titles(await list("?sort=-createdAt")), ["Stew", "Lasagna", "Omelette", "Salad"]);
  assert.deepEqual(titles(await list("?sort=prepMinutes")), ["Salad", "Stew", "Omelette", "Lasagna"]);
});

test("parameters can be combined", async () => {
  const res = await list("?difficulty=easy&maxTime=30&sort=-createdAt");
  assert.deepEqual(titles(res), ["Salad"]);
});

for (const qs of ["difficulty=x", "maxTime=abc", "maxTime=0", "maxTime=2.5", "sort=password", "sort=a&sort=b"]) {
  test(`${qs} returns 400`, async () => {
    assert.equal((await list(`?${qs}`)).status, 400);
  });
}
