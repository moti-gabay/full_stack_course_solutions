import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const run = (...args) =>
  execFileSync(process.execPath, ["hello.js", ...args], { encoding: "utf8" });

test("prints Node version, OS, date and a personal greeting", () => {
  const out = run("דנה");
  assert.match(out, new RegExp(process.version.replace(/\./g, "\\.")));
  assert.match(out, /מערכת הפעלה: .+/);
  assert.match(out, /תאריך: .+/);
  assert.match(out, /שלום דנה/);
  assert.doesNotMatch(out, /שימוש:/);
});

test("without a name prints usage instead of a greeting", () => {
  const out = run();
  assert.match(out, /גרסת Node/);
  assert.match(out, /שימוש: node hello.js <שם>/);
  assert.doesNotMatch(out, /שלום/);
});
