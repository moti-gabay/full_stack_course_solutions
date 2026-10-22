import { cacheLife } from "next/cache";

const API = "https://jsonplaceholder.typicode.com";

export type Post = { id: number; title: string; body: string };
export type User = { id: number; name: string; email: string };

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${API}/posts?_limit=5`);
  if (!res.ok) throw new Error(`posts: ${res.status}`);
  return res.json();
}

export async function getPost(id: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${API}/posts/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`post: ${res.status}`);
  return res.json();
}

// The team list changes rarely. Without "use cache" it was fetched on every request (see README)
export async function getTeam(): Promise<User[]> {
  "use cache";
  cacheLife("days");
  const res = await fetch(`${API}/users`);
  if (!res.ok) throw new Error(`users: ${res.status}`);
  return res.json();
}
