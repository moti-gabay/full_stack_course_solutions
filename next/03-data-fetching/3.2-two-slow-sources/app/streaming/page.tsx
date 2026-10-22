import { Suspense } from "react";
import { getNews, getWeather } from "@/lib/data";
import { SourceCard, SourceSkeleton } from "@/components/source-card";

async function Weather() {
  return <SourceCard result={await getWeather()} />;
}

async function News() {
  return <SourceCard result={await getNews()} />;
}

export default function StreamingPage() {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-3xl font-bold">streaming עם Suspense</h1>
      <Suspense fallback={<SourceSkeleton />}>
        <Weather />
      </Suspense>
      <Suspense fallback={<SourceSkeleton />}>
        <News />
      </Suspense>
    </main>
  );
}
