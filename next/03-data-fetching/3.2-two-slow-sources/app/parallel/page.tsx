import { getNews, getWeather } from "@/lib/data";
import { SourceCard } from "@/components/source-card";

// This page blocks on purpose (for the comparison), so we opt it out of the static-shell check
export const instant = false;

export default async function ParallelPage() {
  // Both start together, the page waits for the slower one: max(2, 4) = 4s
  const [weather, news] = await Promise.all([getWeather(), getNews()]);

  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-3xl font-bold">Promise.all</h1>
      <SourceCard result={weather} />
      <SourceCard result={news} />
    </main>
  );
}
