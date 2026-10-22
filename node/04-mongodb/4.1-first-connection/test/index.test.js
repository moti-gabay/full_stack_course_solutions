import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const run = promisify(execFile);
let mongod, uri;

before(async () => {
  mongod = await MongoMemoryServer.create();
  uri = mongod.getUri("library");
});
after(() => mongod.stop());

const runScript = () =>
  run(process.execPath, ["index.js"], { env: { ...process.env, MONGODB_URI: uri } });

test("connects, adds 3 books and prints every book in the collection", async () => {
  const { stdout } = await runScript();
  assert.match(stdout, /MongoDB connected/);
  assert.match(stdout, /יש 3 ספרים/);
  for (const title of ["1984", "Dune", "Clean Code"]) assert.match(stdout, new RegExp(title));
});

test("the books are stored in a `books` collection, and every run prints all of them", async () => {
  const { stdout } = await runScript();
  assert.match(stdout, /יש 6 ספרים/);

  const conn = await mongoose.createConnection(uri).asPromise();
  assert.equal(await conn.collection("books").countDocuments(), 6);
  await conn.close();
});

test("without MONGODB_URI it fails with a message instead of a stack trace", async () => {
  const env = { ...process.env };
  delete env.MONGODB_URI;
  await assert.rejects(run(process.execPath, ["index.js"], { env }), (err) => {
    assert.equal(err.code, 1);
    assert.match(err.stderr, /^שגיאה:/);
    return true;
  });
});
