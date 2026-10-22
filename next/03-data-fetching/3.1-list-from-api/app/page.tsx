import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">פוסטים</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="rounded border p-4">
            <h2 className="font-semibold" dir="ltr">
              {post.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600" dir="ltr">
              {post.body}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
