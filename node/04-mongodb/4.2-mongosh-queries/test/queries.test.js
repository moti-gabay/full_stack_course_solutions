import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { MongoMemoryServer } from "mongodb-memory-server";

const hasMongosh = spawnSync("mongosh", ["--version"]).status === 0;
let mongod, output;

before(async () => {
  if (!hasMongosh) return;
  mongod = await MongoMemoryServer.create();
  output = execFileSync("mongosh", [mongod.getUri("library"), "--quiet", "queries.js"], {
    encoding: "utf8",
  });
});
after(() => mongod?.stop());

// the script prints "N. title" before every command; returns the output of command N
const section = (n) => output.split(/^\d+\. .*$/m)[n].trim();

test("all 10 commands run without errors", { skip: !hasMongosh && "mongosh not installed" }, () => {
  for (let n = 1; n <= 10; n++) assert.ok(section(n), `command ${n} printed nothing`);
  assert.doesNotMatch(output, /Error/);
});

test("find with a filter and $gt return the right books", { skip: !hasMongosh }, () => {
  assert.equal(section(2).match(/author: 'George Orwell'/g).length, 2);
  assert.match(section(3), /Clean Code/);
  assert.doesNotMatch(section(3), /Dune/);
});

test("$push adds a value to the array", { skip: !hasMongosh }, () => {
  assert.match(section(7), /'sci-fi',\s+'classic'/);
});

test("countDocuments matches what was inserted and deleted (5 - 1)", { skip: !hasMongosh }, () => {
  assert.equal(section(9), "4");
});

test("the projection returns only title and author", { skip: !hasMongosh }, () => {
  const keys = new Set(section(10).match(/^\s+(\w+):/gm).map((k) => k.trim()));
  assert.deepEqual([...keys].sort(), ["author:", "title:"]);
});
