import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { connection } from "next/server";

const formatTime = (d: Date) => d.toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem" });

async function CachedTime() {
  "use cache";
  cacheLife("hours");
  return <p id="cached">נוצר ב-{formatTime(new Date())}</p>;
}

async function LiveTime() {
  await connection(); // render on every request
  return <p id="live">נוצר ב-{formatTime(new Date())}</p>;
}

export default function Home() {
  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">לראות את ה-cache</h1>
      <section className="rounded border p-4">
        <h2 className="font-semibold">עם &quot;use cache&quot;</h2>
        <CachedTime />
      </section>
      <section className="rounded border p-4">
        <h2 className="font-semibold">בלי cache</h2>
        <Suspense fallback={<p>טוען...</p>}>
          <LiveTime />
        </Suspense>
      </section>
    </main>
  );
}
