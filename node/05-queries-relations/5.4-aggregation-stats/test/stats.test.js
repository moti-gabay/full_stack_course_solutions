import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import { Recipe } from "../models/Recipe.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

useMemoryDb();
const api = () => request(app);
const stats = async () => (await api().get("/api/stats")).body;

beforeEach(async () => {
  await Recipe.create([
    { title: "Salad", difficulty: "easy", prepMinutes: 10, tags: ["vegan", "quick", "healthy"] },
    { title: "Toast", difficulty: "easy", prepMinutes: 5, tags: ["quick", "breakfast"] },
    { title: "Curry", difficulty: "medium", prepMinutes: 40, tags: ["spicy", "vegan"] },
    { title: "Lasagna", difficulty: "hard", prepMinutes: 90, tags: ["italian"] },
    { title: "Pizza", difficulty: "medium", prepMinutes: 60, tags: ["italian", "quick", "kids"] },
  ]);
});

test("counts per difficulty match countDocuments with the same filter", async () => {
  const { byDifficulty } = await stats();
  for (const level of ["easy", "medium", "hard"]) {
    assert.equal(byDifficulty[level], await Recipe.countDocuments({ difficulty: level }));
  }
  assert.deepEqual(byDifficulty, { easy: 2, hard: 1, medium: 2 });
});

test("average prep time matches a manual calculation", async () => {
  assert.equal((await stats()).avgPrepMinutes, (10 + 5 + 40 + 90 + 60) / 5); // 41
});

test("returns the 5 most common tags", async () => {
  const { topTags } = await stats();
  assert.equal(topTags.length, 5);
  assert.deepEqual(topTags.slice(0, 3), [
    { tag: "quick", count: 3 },
    { tag: "italian", count: 2 },
    { tag: "vegan", count: 2 },
  ]);
});

test("soft-deleted recipes are not counted", async () => {
  const lasagna = await Recipe.findOne({ title: "Lasagna" });
  await api().delete(`/api/recipes/${lasagna._id}`);
  const { byDifficulty, avgPrepMinutes } = await stats();
  assert.equal(byDifficulty.hard, undefined);
  assert.equal(avgPrepMinutes, 28.8); // (10 + 5 + 40 + 60) / 4 = 28.75, rounded to 1 decimal
});

test("a review with rating 0, 6 or 3.5 is rejected", async () => {
  const salad = await Recipe.findOne({ title: "Salad" });
  for (const rating of [0, 6, 3.5, undefined]) {
    const res = await api().post(`/api/recipes/${salad._id}/reviews`).send({ rating });
    assert.equal(res.status, 400, `rating ${rating}`);
  }
  assert.equal((await api().get(`/api/recipes/${salad._id}`)).body.reviewsCount, 0);
});

test("the recipe's average rating updates right after every new review", async () => {
  const salad = await Recipe.findOne({ title: "Salad" });
  const review = (rating) => api().post(`/api/recipes/${salad._id}/reviews`).send({ rating });
  const recipe = async () => (await api().get(`/api/recipes/${salad._id}`)).body;

  assert.equal((await review(5)).status, 201);
  assert.equal((await recipe()).averageRating, 5);
  await review(4);
  await review(4);
  const updated = await recipe();
  assert.equal(updated.averageRating, 4.3); // (5 + 4 + 4) / 3 = 4.33
  assert.equal(updated.reviewsCount, 3);
});

test("a review for a recipe that does not exist returns 404", async () => {
  const res = await api().post("/api/recipes/000000000000000000000000/reviews").send({ rating: 3 });
  assert.equal(res.status, 404);
});
