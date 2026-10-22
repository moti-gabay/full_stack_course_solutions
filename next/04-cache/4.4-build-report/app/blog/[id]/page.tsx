import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/api";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ id: String(p.id) }));
}

export default async function BlogPost({ params }: PageProps<"/blog/[id]">) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return (
    <main className="mx-auto max-w-xl p-8" dir="ltr">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <p>{post.body}</p>
    </main>
  );
}
