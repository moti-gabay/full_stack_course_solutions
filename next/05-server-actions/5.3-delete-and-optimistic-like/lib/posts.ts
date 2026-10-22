import "server-only";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type Post = { id: string; title: string; likes: number };

const file = path.join(process.cwd(), "data", "posts.json");

const seed: Post[] = [
  { id: "1", title: "שקשוקה בעשר דקות", likes: 3 },
  { id: "2", title: "פסטה ברוטב עגבניות", likes: 5 },
  { id: "3", title: "עוגת שוקולד בלי קמח", likes: 8 },
];

export async function getPosts(): Promise<Post[]> {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return seed;
  }
}

export async function savePosts(posts: Post[]) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(posts, null, 2));
}
