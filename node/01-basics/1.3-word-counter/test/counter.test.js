import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { analyze } from "../analyze.js";

const counter = resolve("counter.js");

test("counts lines and words of a short hand-counted text", () => {
  const r = analyze("one two\nthree\n");
  assert.equal(r.lines, 2);
  assert.equal(r.words, 3);
});

test("empty text has 0 lines and 0 words", () => {
  assert.deepEqual(analyze(""), { lines: 0, words: 0, topWords: [] });
});

test("finds the 5 most common words, case-insensitive", () => {
  const r = analyze("b A a c a d e f B");
  assert.equal(r.topWords.length, 5);
  assert.deepEqual(r.topWords.slice(0, 2), [
    { word: "a", count: 3 },
    { word: "b", count: 2 },
  ]);
});

test("writes report.json for the sample file", () => {
  const dir = mkdtempSync(join(tmpdir(), "wc-"));
  const file = join(dir, "text.txt");
  writeFileSync(file, readFileSync("sample.txt"));
  execFileSync(process.execPath, [counter, file], { cwd: dir });

  const report = JSON.parse(readFileSync(join(dir, "report.json"), "utf8"));
  assert.equal(report.lines, 3);
  assert.equal(report.words, 25);
  assert.deepEqual(report.topWords[0], { word: "the", count: 4 });
  assert.equal(report.topWords.length, 5);
});

test("a missing file prints a clear error without a stack trace", () => {
  const r = spawnSync(process.execPath, [counter, "nope.txt"], {
    cwd: tmpdir(),
    encoding: "utf8",
  });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /הקובץ "nope.txt" לא נמצא/);
  assert.doesNotMatch(r.stderr, /at .*\(/); // no stack frames
});
