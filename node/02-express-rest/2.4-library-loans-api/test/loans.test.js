import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

const api = () => request(app);

async function setup() {
  const book = (await api().post("/books").send({ title: "1984", author: "Orwell" })).body;
  const member = (await api().post("/members").send({ name: "דנה" })).body;
  return { book, member };
}

test("creates books and members, validates required fields", async () => {
  const { book, member } = await setup();
  assert.equal((await api().get(`/books/${book.id}`)).body.available, true);
  assert.equal((await api().get(`/members/${member.id}`)).status, 200);
  assert.equal((await api().post("/books").send({ title: "x" })).status, 400);
  assert.equal((await api().post("/members").send({})).status, 400);
  assert.equal((await api().get("/books/999")).status, 404);
});

test("POST /loans lends a book, a second loan of the same book returns 409", async () => {
  const { book, member } = await setup();
  const loan = await api().post("/loans").send({ bookId: book.id, memberId: member.id });
  assert.equal(loan.status, 201);
  assert.equal(loan.body.returnedAt, null);
  assert.equal((await api().get(`/books/${book.id}`)).body.available, false);

  const again = await api().post("/loans").send({ bookId: book.id, memberId: member.id });
  assert.equal(again.status, 409);
});

test("POST /loans with unknown book/member returns 404, missing fields 400", async () => {
  const { member } = await setup();
  assert.equal((await api().post("/loans").send({ bookId: 999, memberId: member.id })).status, 404);
  assert.equal((await api().post("/loans").send({ memberId: member.id })).status, 400);
});

test("return a book, then it can be lent again; returning twice is 409", async () => {
  const { book, member } = await setup();
  const loan = (await api().post("/loans").send({ bookId: book.id, memberId: member.id })).body;

  const returned = await api().post(`/loans/${loan.id}/return`);
  assert.equal(returned.status, 200);
  assert.ok(returned.body.returnedAt);
  assert.equal((await api().post(`/loans/${loan.id}/return`)).status, 409);
  assert.equal((await api().post("/loans/999/return")).status, 404);

  const again = await api().post("/loans").send({ bookId: book.id, memberId: member.id });
  assert.equal(again.status, 201);
});

test("GET /members/:id/loans returns only active loans", async () => {
  const { member } = await setup();
  const b1 = (await api().post("/books").send({ title: "A", author: "X" })).body;
  const b2 = (await api().post("/books").send({ title: "B", author: "Y" })).body;
  const l1 = (await api().post("/loans").send({ bookId: b1.id, memberId: member.id })).body;
  await api().post("/loans").send({ bookId: b2.id, memberId: member.id });
  await api().post(`/loans/${l1.id}/return`);

  const res = await api().get(`/members/${member.id}/loans`);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.map((l) => l.book.title), ["B"]);
  assert.equal((await api().get("/members/999/loans")).status, 404);
});
