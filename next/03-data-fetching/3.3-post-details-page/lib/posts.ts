import { cacheLife } from "next/cache";

export type Post = { id: number; userId: number; title: string; body: string };

const API_URL = process.env.POSTS_API_URL ?? "https://jsonplaceholder.typicode.com";

// Returns null when the post doesn't exist, throws when the API itself fails
export async function getPost(id: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");

  const res = await fetch(`${API_URL}/posts/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Posts API error: ${res.status}`);
  return res.json();
}
