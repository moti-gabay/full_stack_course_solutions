import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/posts";

export async function generateMetadata({
  params,
}: PageProps<"/posts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "פוסט לא נמצא" };
  return { title: post.title, description: post.body.slice(0, 150) };
}

export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl p-8" dir="ltr">
      <p className="text-sm text-zinc-500">Post #{post.id}</p>
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <p className="whitespace-pre-line">{post.body}</p>
    </main>
  );
}
