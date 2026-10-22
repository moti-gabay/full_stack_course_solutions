import { getNews, getWeather } from "@/lib/data";
import { SourceCard } from "@/components/source-card";

// This page blocks on purpose (for the comparison), so we opt it out of the static-shell check
export const instant = false;

export default async function SerialPage() {
  const weather = await getWeather();
  const news = await getNews(); // starts only after weather finished: 2 + 4 = 6s

  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-3xl font-bold">await בטור</h1>
      <SourceCard result={weather} />
      <SourceCard result={news} />
    </main>
  );
}
