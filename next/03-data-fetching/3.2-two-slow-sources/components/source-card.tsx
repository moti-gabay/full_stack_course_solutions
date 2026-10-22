import type { SourceResult } from "@/lib/data";

export function SourceCard({ result }: { result: SourceResult }) {
  return (
    <div className="rounded border p-4">
      <h2 className="font-semibold">{result.name}</h2>
      <p className="text-sm text-zinc-600">
        חיכה {result.ms / 1000} שניות, הסתיים ב-{result.doneAt}
      </p>
    </div>
  );
}

export function SourceSkeleton() {
  return <div className="h-[74px] animate-pulse rounded bg-zinc-200" />;
}
