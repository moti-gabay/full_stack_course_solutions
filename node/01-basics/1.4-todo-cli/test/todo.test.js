import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const todo = resolve("todo.js");
let dir;

// every test runs in a fresh empty folder, so tasks.json starts empty
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "todo-"));
});

const run = (...args) =>
  spawnSync(process.execPath, [todo, ...args], { cwd: dir, encoding: "utf8" });

test("add twice, then list shows both tasks", () => {
  run("add", "לקנות חלב");
  run("add", "לכתוב בדיקות");
  const out = run("list").stdout;
  assert.match(out, /1\. \[ \] לקנות חלב/);
  assert.match(out, /2\. \[ \] לכתוב בדיקות/);
});

test("tasks are saved to tasks.json and survive the next run", () => {
  run("add", "משימה");
  const saved = JSON.parse(readFileSync(join(dir, "tasks.json"), "utf8"));
  assert.deepEqual(saved, [{ id: 1, text: "משימה", done: false }]);
  assert.match(run("list").stdout, /משימה/);
});

test("done marks the task as completed", () => {
  run("add", "א");
  run("done", "1");
  assert.match(run("list").stdout, /1\. \[x\] א/);
});

test("remove deletes the task from the list", () => {
  run("add", "א");
  run("add", "ב");
  run("remove", "1");
  const out = run("list").stdout;
  assert.doesNotMatch(out, /\] א/);
  assert.match(out, /2\. \[ \] ב/);
});

test("ids are not reused after remove", () => {
  run("add", "א");
  run("add", "ב");
  run("remove", "2");
  run("add", "ג");
  assert.match(run("list").stdout, /2\. \[ \] ג/);
});

test("done/remove on a missing id fails with a message", () => {
  const r = run("done", "7");
  assert.equal(r.status, 1);
  assert.match(r.stderr, /משימה 7 לא נמצאה/);
});

test("an unknown command shows help", () => {
  assert.match(run("foo").stdout, /שימוש:/);
  assert.match(run().stdout, /שימוש:/);
});
