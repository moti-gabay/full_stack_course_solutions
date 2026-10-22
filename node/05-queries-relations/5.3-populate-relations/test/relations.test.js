import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";
import { useMemoryDb } from "../helpers/memoryDb.js";

useMemoryDb();
const api = () => request(app);

const createAuthor = async (name) => (await api().post("/authors").send({ name })).body;
const createBook = async (title, author) =>
  (await api().post("/books").send({ title, author: author._id })).body;

test("GET /books returns each book with the author's name, not just an id", async () => {
  const orwell = await createAuthor("George Orwell");
  await createBook("1984", orwell);

  const res = await api().get("/books");
  assert.equal(res.status, 200);
  assert.equal(res.body[0].author.name, "George Orwell");
  assert.equal(res.body[0].author._id, orwell._id);
});

test("GET /authors/:id/books returns only that author's books", async () => {
  const orwell = await createAuthor("George Orwell");
  const herbert = await createAuthor("Frank Herbert");
  await createBook("1984", orwell);
  await createBook("Animal Farm", orwell);
  await createBook("Dune", herbert);

  const res = await api().get(`/authors/${orwell._id}/books`);
  assert.deepEqual(res.body.map((b) => b.title).sort(), ["1984", "Animal Farm"]);
  assert.equal((await api().get("/authors/000000000000000000000000/books")).status, 404);
});

test("deleting an author with books returns 409, an author without books is deleted", async () => {
  const orwell = await createAuthor("George Orwell");
  const lonely = await createAuthor("No Books Yet");
  await createBook("1984", orwell);

  assert.equal((await api().delete(`/authors/${orwell._id}`)).status, 409);
  assert.equal((await api().get(`/authors/${orwell._id}`)).status, 200);

  assert.equal((await api().delete(`/authors/${lonely._id}`)).status, 204);
  assert.equal((await api().get(`/authors/${lonely._id}`)).status, 404);
});

test("a book needs an existing author", async () => {
  assert.equal((await api().post("/books").send({ title: "x" })).status, 400);
  const res = await api().post("/books").send({ title: "x", author: "000000000000000000000000" });
  assert.equal(res.status, 400);
  assert.equal((await api().post("/books").send({ title: "x", author: "abc" })).status, 400);
});
