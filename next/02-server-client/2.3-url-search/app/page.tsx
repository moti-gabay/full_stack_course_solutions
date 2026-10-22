import { Suspense } from "react";
import SearchInput from "./components/search-input";
import { searchRecipes } from "@/lib/recipes";

async function Results({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  console.log(`[server] filtering recipes, q="${query}"`);

  const results = searchRecipes(query);

  if (results.length === 0) {
    return <p className="mt-4 text-gray-500">לא נמצאו מתכונים עבור &quot;{query}&quot;</p>;
  }

  return (
    <ul className="mt-4 list-disc pr-6">
      {results.map((recipe) => (
        <li key={recipe}>{recipe}</li>
      ))}
    </ul>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">חיפוש מתכונים</h1>
      <Suspense fallback={<input disabled placeholder="חיפוש..." className="w-full rounded border p-2" />}>
        <SearchInput />
      </Suspense>
      <Suspense fallback={<p className="mt-4 text-gray-500">מחפש...</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
