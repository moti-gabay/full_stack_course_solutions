import "server-only";
import { connection } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "./db";
import { Recipe, type RecipeDoc } from "@/models/Recipe";

export type RecipeView = {
  id: string;
  title: string;
  ingredients: string[];
  difficulty: string;
  prepMinutes?: number;
};

// מסמך Mongoose לא עובר לקומפוננטת לקוח; ממירים לאובייקט פשוט עם id כמחרוזת
function toView(doc: RecipeDoc & { _id: unknown }): RecipeView {
  return {
    id: String(doc._id),
    title: doc.title,
    ingredients: doc.ingredients,
    difficulty: doc.difficulty ?? "easy",
    prepMinutes: doc.prepMinutes ?? undefined,
  };
}

export async function getRecipes() {
  // הנתונים משתנים כל הזמן: עוצרים את ה-prerender לפני הגישה למסד, כך שה-build לא צריך מסד
  await connection();
  await connectDB();
  const docs = await Recipe.find().sort({ createdAt: -1 }).lean<(RecipeDoc & { _id: unknown })[]>();
  return docs.map(toView);
}

export async function getRecipe(id: string) {
  await connection();
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const doc = await Recipe.findById(id).lean<RecipeDoc & { _id: unknown }>();
  return doc ? toView(doc) : null;
}
