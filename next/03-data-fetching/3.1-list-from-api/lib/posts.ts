import { cacheLife } from "next/cache";

export type Post = { id: number; userId: number; title: string; body: string };

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("hours");

  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
  if (!res.ok) throw new Error(`Failed to load posts: ${res.status}`);
  return res.json();
}
