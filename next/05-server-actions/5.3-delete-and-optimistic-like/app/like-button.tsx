"use client";

import { useOptimistic, useState } from "react";
import { likePost } from "./actions";

export function LikeButton({ id, likes }: { id: string; likes: number }) {
  // הערך האופטימי חוזר ל-likes (מהשרת) כשה-action מסתיים
  const [optimisticLikes, addLike] = useOptimistic(likes, (current, delta: number) => current + delta);
  const [error, setError] = useState("");

  async function action() {
    setError("");
    addLike(1);
    const { ok } = await likePost(id);
    if (!ok) setError("הלייק לא נשמר");
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <button className="rounded border px-3 py-1">❤ {optimisticLikes}</button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </form>
  );
}
