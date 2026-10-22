import { Suspense } from "react";
import { getPosts } from "@/lib/posts";
import { deletePost } from "./actions";
import { DeleteButton } from "./delete-button";
import { LikeButton } from "./like-button";

async function PostList() {
  const posts = await getPosts();
  if (posts.length === 0) return <p className="text-zinc-500">אין פוסטים</p>;

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.id} className="flex items-center justify-between rounded border p-3">
          <span>{post.title}</span>
          <div className="flex gap-2">
            <LikeButton id={post.id} likes={post.likes} />
            <form action={deletePost.bind(null, post.id)}>
              <DeleteButton />
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-lg space-y-6 p-8">
      <h1 className="text-2xl font-bold">פוסטים</h1>
      <Suspense fallback={<p>טוען...</p>}>
        <PostList />
      </Suspense>
    </main>
  );
}
