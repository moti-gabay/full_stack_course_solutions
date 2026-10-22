"use server";

import { revalidatePath } from "next/cache";
import { getPosts, savePosts } from "@/lib/posts";

export async function deletePost(id: string) {
  const posts = await getPosts();
  await savePosts(posts.filter((p) => p.id !== id));
  revalidatePath("/");
}

export async function likePost(id: string): Promise<{ ok: boolean }> {
  // השהיה מלאכותית: רואים שהלייק מתעדכן מיד, עוד לפני שהשרת ענה
  await new Promise((r) => setTimeout(r, 1500));

  // לבדיקת חזרה אחורה: SIMULATE_LIKE_FAILURE=1 npm run dev
  if (process.env.SIMULATE_LIKE_FAILURE === "1") return { ok: false };

  const posts = await getPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) return { ok: false };

  post.likes++;
  await savePosts(posts);
  revalidatePath("/");
  return { ok: true };
}
