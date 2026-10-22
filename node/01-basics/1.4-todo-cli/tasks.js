import { readFile, writeFile } from "node:fs/promises";

const FILE = "tasks.json";

export async function loadTasks() {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export async function saveTasks(tasks) {
  await writeFile(FILE, JSON.stringify(tasks, null, 2));
}
