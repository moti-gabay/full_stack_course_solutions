import { getNews } from "@/lib/news";
import { refreshNews } from "./actions";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">חדשות</h1>
      <p id="fetched-at" className="text-sm text-zinc-500">
        נמשך ב-{news.fetchedAt}
      </p>
      <ul className="list-disc space-y-1 pr-6">
        {news.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <section className="rounded border border-dashed p-4">
        <h2 className="mb-2 font-semibold">admin</h2>
        <form action={refreshNews}>
          <button className="rounded bg-black px-4 py-2 text-white">רענן חדשות עכשיו</button>
        </form>
      </section>
    </main>
  );
}
