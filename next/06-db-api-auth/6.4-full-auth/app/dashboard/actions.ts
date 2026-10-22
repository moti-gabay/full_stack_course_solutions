"use server";

import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";

export type ActionResult = { error?: string; ok?: string };

// כל action מתחיל כאן: מי המשתמש לפי ה-session, ולא לפי מה שהלקוח שלח
async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  return session.user.id;
}

export async function createRecipe(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3) return { error: "שם של לפחות 3 תווים" };

  // owner נקבע מה-session. גם אם הלקוח ישלח owner בטופס, מתעלמים ממנו
  await Recipe.create({ title, owner: userId });
  revalidatePath("/dashboard");
  return { ok: "נוסף" };
}

export async function updateRecipe(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!isValidObjectId(id)) return { error: "מזהה לא תקין" };
  if (title.length < 3) return { error: "שם של לפחות 3 תווים" };

  // בדיקת הבעלות היא חלק מהשאילתה: מעדכנים רק מסמך עם ה-id הזה *וגם* owner של המשתמש המחובר
  const updated = await Recipe.findOneAndUpdate({ _id: id, owner: userId }, { title }, { runValidators: true });
  if (!updated) {
    console.warn(`[forbidden] user ${userId} tried to update recipe ${id}`);
    return { error: "אין לך הרשאה לערוך את המתכון הזה" };
  }
  revalidatePath("/dashboard");
  return { ok: "נשמר" };
}

export async function deleteRecipe(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();
  const id = String(formData.get("id"));
  if (!isValidObjectId(id)) return { error: "מזהה לא תקין" };

  const deleted = await Recipe.findOneAndDelete({ _id: id, owner: userId });
  if (!deleted) {
    console.warn(`[forbidden] user ${userId} tried to delete recipe ${id}`);
    return { error: "אין לך הרשאה למחוק את המתכון הזה" };
  }
  revalidatePath("/dashboard");
  return { ok: "נמחק" };
}
