import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { add, subtract, average } from "../math.js";

test("add", () => assert.equal(add(2, 3), 5));
test("subtract", () => assert.equal(subtract(10, 4), 6));
test("average", () => assert.equal(average([1, 2, 3, 4]), 2.5));
test("average of an empty array is 0, not NaN", () => assert.equal(average([]), 0));

test("app.js prints the results", () => {
  const out = execFileSync(process.execPath, ["app.js"], { encoding: "utf8" });
  assert.match(out, /add\(2, 3\) = 5/);
  assert.match(out, /subtract\(10, 4\) = 6/);
  assert.match(out, /average\(\[\]\) = 0/);
});
