import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import { Recipe } from "../models/Recipe.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

useMemoryDb();
const list = (qs = "") => request(app).get(`/api/recipes${qs}`);

beforeEach(async () => {
  const recipes = Array.from({ length: 100 }, (_, i) => ({
    title: i % 10 === 0 ? `Pasta number ${i}` : `Recipe number ${i}`,
    prepMinutes: 10 + i,
  }));
  recipes.push({ title: "Baked PASTA (family size)", prepMinutes: 40 });
  await Recipe.create(recipes);
  await Recipe.deleteOne({ title: "Baked PASTA (family size)" }); // back to exactly 100
});

test("page=1&limit=10 returns 10 items, total 100 and totalPages 10", async () => {
  const { body } = await list("?page=1&limit=10");
  assert.equal(body.data.length, 10);
  assert.equal(body.total, 100);
  assert.equal(body.totalPages, 10);
  assert.equal(body.page, 1);
  assert.equal(body.limit, 10);
});

test("page=2 returns different items than page=1", async () => {
  const ids = async (page) => (await list(`?page=${page}&limit=10`)).body.data.map((r) => r._id);
  const [p1, p2] = [await ids(1), await ids(2)];
  assert.equal(p2.length, 10);
  assert.ok(p1.every((id) => !p2.includes(id)));
});

test("defaults are page 1 and limit 10", async () => {
  const { body } = await list();
  assert.equal(body.page, 1);
  assert.equal(body.data.length, 10);
});

test("q=PASTA is case-insensitive and total counts the search results", async () => {
  await Recipe.create({ title: "creamy pasta" });
  const { body } = await list("?q=PASTA&limit=50");
  assert.equal(body.total, 11);
  assert.equal(body.totalPages, 1);
  assert.ok(body.data.every((r) => /pasta/i.test(r.title)));
});

test("regex characters in q are matched literally", async () => {
  await Recipe.create({ title: "Pasta (big)" });
  assert.equal((await list("?q=(big)")).body.total, 1);
  assert.equal((await list("?q=.*")).body.total, 0);
});

test("limit=100 returns at most 50 items", async () => {
  const { body } = await list("?limit=100");
  assert.equal(body.data.length, 50);
  assert.equal(body.limit, 50);
  assert.equal(body.totalPages, 2);
});

test("works together with the filters from 5.1", async () => {
  const { body } = await list("?q=pasta&maxTime=40&sort=-prepMinutes");
  assert.deepEqual(body.data.map((r) => r.prepMinutes), [40, 30, 20, 10]);
});

for (const qs of ["page=0", "page=abc", "limit=-5", "limit=1.5"]) {
  test(`${qs} returns 400`, async () => {
    assert.equal((await list(`?${qs}`)).status, 400);
  });
}
