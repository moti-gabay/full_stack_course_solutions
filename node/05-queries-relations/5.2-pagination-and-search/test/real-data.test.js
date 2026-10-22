import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { Recipe } from "../models/Recipe.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

const db = useMemoryDb();
const api = () => request(app);
const run = promisify(execFile);

test("the seed script inserts 100 recipes, each with a slug from its title", async () => {
  await run(process.execPath, ["seed.js"], { env: { ...process.env, MONGODB_URI: db.uri } });
  assert.equal(await Recipe.countDocuments(), 100);
  const recipes = await Recipe.find();
  assert.ok(recipes.every((r) => r.slug && r.slug === r.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-")));
});

test("slug is generated from the title", async () => {
  const { body } = await api().post("/api/recipes").send({ title: "  Pasta Bake!  " });
  assert.equal(body.slug, "pasta-bake");
  const he = await api().post("/api/recipes").send({ title: "פשטידת ירקות" });
  assert.equal(he.body.slug, "פשטידת-ירקות");
});

test("a recipe with a slug that already exists returns 409", async () => {
  await api().post("/api/recipes").send({ title: "Pasta Bake" });
  const res = await api().post("/api/recipes").send({ title: "pasta bake" });
  assert.equal(res.status, 409);
  assert.equal(res.body.field, "slug");
});

test("PATCH to a title that already exists returns 409, a new title updates the slug", async () => {
  await api().post("/api/recipes").send({ title: "Pasta Bake" });
  const { body } = await api().post("/api/recipes").send({ title: "Green Salad" });
  assert.equal((await api().patch(`/api/recipes/${body._id}`).send({ title: "Pasta Bake" })).status, 409);
  const renamed = await api().patch(`/api/recipes/${body._id}`).send({ title: "Big Salad" });
  assert.equal(renamed.body.slug, "big-salad");
});

test("DELETE is soft: the document stays with deletedAt but is hidden everywhere", async () => {
  const { body } = await api().post("/api/recipes").send({ title: "Soup" });
  assert.equal((await api().delete(`/api/recipes/${body._id}`)).status, 204);

  const raw = await Recipe.collection.findOne({ _id: new mongoose.Types.ObjectId(body._id) });
  assert.ok(raw.deletedAt instanceof Date);

  assert.equal((await api().get("/api/recipes")).body.data.length, 0);
  assert.equal((await api().get(`/api/recipes/${body._id}`)).status, 404);
  assert.equal((await api().patch(`/api/recipes/${body._id}`).send({ prepMinutes: 3 })).status, 404);
  assert.equal((await api().delete(`/api/recipes/${body._id}`)).status, 404);
  assert.equal(await Recipe.countDocuments(), 0);
});

test("PATCH with one field updates only that field", async () => {
  const { body } = await api()
    .post("/api/recipes")
    .send({ title: "Soup", difficulty: "easy", prepMinutes: 30, ingredients: ["water"] });
  const res = await api().patch(`/api/recipes/${body._id}`).send({ prepMinutes: 45 });
  assert.equal(res.status, 200);
  assert.equal(res.body.prepMinutes, 45);
  assert.equal(res.body.title, "Soup");
  assert.equal(res.body.difficulty, "easy");
  assert.deepEqual(res.body.ingredients, ["water"]);
});

test("PATCH with an invalid value returns 400 (runValidators)", async () => {
  const { body } = await api().post("/api/recipes").send({ title: "Soup" });
  assert.equal((await api().patch(`/api/recipes/${body._id}`).send({ difficulty: "x" })).status, 400);
  assert.equal((await api().patch(`/api/recipes/${body._id}`).send({ prepMinutes: 0 })).status, 400);
});
