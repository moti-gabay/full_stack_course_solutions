import { connection } from "next/server";
import { recipes, type Recipe } from "@/lib/recipes";

export async function GET() {
  // בלי זה, עם cacheComponents, ה-GET נבנה כקובץ סטטי ב-build ולא יראה מתכונים חדשים
  await connection();
  return Response.json(recipes);
}

export async function POST(request: Request) {
  let body: Partial<Recipe>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "גוף הבקשה חייב להיות JSON" }, { status: 400 });
  }

  const { title, ingredients = [], prepMinutes } = body;
  if (typeof title !== "string" || title.trim().length < 3) {
    return Response.json({ error: "title הוא שדה חובה (לפחות 3 תווים)" }, { status: 400 });
  }
  if (typeof prepMinutes !== "number" || prepMinutes < 1) {
    return Response.json({ error: "prepMinutes חייב להיות מספר, לפחות 1" }, { status: 400 });
  }
  if (!Array.isArray(ingredients)) {
    return Response.json({ error: "ingredients חייב להיות מערך" }, { status: 400 });
  }

  const recipe: Recipe = {
    id: Math.max(0, ...recipes.map((r) => r.id)) + 1,
    title: title.trim(),
    ingredients,
    prepMinutes,
  };
  recipes.push(recipe);
  return Response.json(recipe, { status: 201 });
}
