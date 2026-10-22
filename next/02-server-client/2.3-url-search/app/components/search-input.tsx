"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const DEBOUNCE_MS = 400;

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleChange(value: string) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set("q", value);
      else params.delete("q");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }, DEBOUNCE_MS);
  }

  return (
    <input
      type="search"
      defaultValue={searchParams.get("q") ?? ""}
      onChange={(event) => handleChange(event.target.value)}
      placeholder="חיפוש..."
      className="w-full rounded border p-2"
    />
  );
}
