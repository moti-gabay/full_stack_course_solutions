import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("greets in Hebrew with lang=he", async () => {
  const res = await request(app).get("/greet/Dana?lang=he");
  assert.equal(res.status, 200);
  assert.equal(res.body.greeting, "שלום Dana!");
});

test("greets in English with lang=en", async () => {
  const res = await request(app).get("/greet/Dana?lang=en");
  assert.equal(res.body.greeting, "Hello Dana!");
});

test("sum of a=3&b=4 is 7", async () => {
  const res = await request(app).get("/sum?a=3&b=4");
  assert.equal(res.status, 200);
  assert.equal(res.body.sum, 7);
});

for (const qs of ["a=3&b=abc", "a=3", "a=&b=4", "a=1&a=2&b=3"]) {
  test(`/sum?${qs} returns 400`, async () => {
    const res = await request(app).get(`/sum?${qs}`);
    assert.equal(res.status, 400);
  });
}
