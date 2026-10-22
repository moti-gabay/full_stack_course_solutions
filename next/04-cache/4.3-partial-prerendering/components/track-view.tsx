"use client";

import { useEffect } from "react";

// Remembers the product in a "recent" cookie (newest first, up to 4)
export function TrackView({ id }: { id: string }) {
  useEffect(() => {
    const current = document.cookie.match(/(?:^|; )recent=([^;]*)/)?.[1];
    const ids = current ? decodeURIComponent(current).split(",") : [];
    const next = [id, ...ids.filter((x) => x !== id)].slice(0, 4);
    document.cookie = `recent=${encodeURIComponent(next.join(","))}; path=/; max-age=${60 * 60 * 24 * 30}`;
  }, [id]);

  return null;
}
