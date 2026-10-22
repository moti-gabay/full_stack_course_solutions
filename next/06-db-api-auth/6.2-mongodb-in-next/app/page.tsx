import { Suspense } from "react";
import Link from "next/link";
import { getRecipes } from "@/lib/recipes";
import { createRecipe, deleteRecipe } from "./actions";
import { RecipeForm } from "./recipe-form";

async function RecipeList() {
  const recipes = await getRecipes();
  if (recipes.length === 0) return <p className="text-zinc-500">אין מתכונים עדיין</p>;

  return (
    <ul className="space-y-2">
      {recipes.map((r) => (
        <li key={r.id} className="flex items-center justify-between rounded border p-3">
          <div>
            <p className="font-semibold">{r.title}</p>
            <p className="text-sm text-zinc-500">
              {r.difficulty}
              {r.prepMinutes && ` · ${r.prepMinutes} דקות`}
              {r.ingredients.length > 0 && ` · ${r.ingredients.join(", ")}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/recipes/${r.id}/edit`} className="rounded border px-3 py-1">עריכה</Link>
            <form action={deleteRecipe.bind(null, r.id)}>
              <button className="rounded border border-red-600 px-3 py-1 text-red-600">מחיקה</button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">מתכונים</h1>
      <RecipeForm action={createRecipe} submitLabel="הוספה" />
      <Suspense fallback={<p>טוען מתכונים...</p>}>
        <RecipeList />
      </Suspense>
    </main>
  );
}
