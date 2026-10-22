import { Suspense } from "react";
import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import { Recipe, type RecipeDoc } from "@/models/Recipe";

async function RecipeList() {
  // הנתונים נקראים בזמן הבקשה ולא ב-build: כך ה-build לא צריך גישה למסד,
  // והדף תמיד מציג את מה שיש ב-Atlas עכשיו.
  await connection();
  await connectDB();
  const recipes = await Recipe.find().sort({ createdAt: -1 }).lean<(RecipeDoc & { _id: string })[]>();

  if (recipes.length === 0) return <p>אין עדיין מתכונים. הריצו npm run seed.</p>;

  return (
    <ul className="mt-4 space-y-2">
      {recipes.map((recipe) => (
        <li key={String(recipe._id)} className="rounded border p-3">
          {recipe.title} · {recipe.prepMinutes} דקות
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold">מתכונים מהמסד</h1>
      <Suspense fallback={<p className="mt-4">טוען מתכונים...</p>}>
        <RecipeList />
      </Suspense>
    </main>
  );
}
