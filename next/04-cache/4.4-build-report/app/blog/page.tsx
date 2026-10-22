import Link from "next/link";
import { getPosts } from "@/lib/api";

export default async function Blog() {
  const posts = await getPosts();
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-3xl font-bold">בלוג</h1>
      <ul className="list-disc space-y-1 pr-6" dir="ltr">
        {posts.map((p) => (
          <li key={p.id}>
            <Link className="underline" href={`/blog/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
