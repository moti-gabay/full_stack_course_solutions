import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import request from "supertest";
import app from "../app.js";

for (const path of ["/", "/about", "/time"]) {
  test(`GET ${path} returns JSON`, async () => {
    const res = await request(app).get(path);
    assert.equal(res.status, 200);
    assert.match(res.headers["content-type"], /application\/json/);
  });
}

test("/time returns a valid ISO date", async () => {
  const res = await request(app).get("/time");
  assert.ok(!Number.isNaN(Date.parse(res.body.time)));
});

test("the port comes from the .env file", async (t) => {
  const envFile = join(mkdtempSync(join(tmpdir(), "env-")), ".env");
  writeFileSync(envFile, "PORT=4123\n");
  const server = spawn(process.execPath, [`--env-file=${envFile}`, "server.js"]);
  t.after(() => server.kill());

  await new Promise((resolve) => server.stdout.once("data", resolve));
  const res = await fetch("http://localhost:4123/time");
  assert.equal(res.status, 200);
});
