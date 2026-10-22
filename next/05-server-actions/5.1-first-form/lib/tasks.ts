import "server-only";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type Task = { id: string; title: string };

const file = path.join(process.cwd(), "data", "tasks.json");

export async function getTasks(): Promise<Task[]> {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return []; // הקובץ עוד לא נוצר
  }
}

export async function addTask(title: string) {
  const tasks = await getTasks();
  tasks.push({ id: crypto.randomUUID(), title });
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(tasks, null, 2));
}
