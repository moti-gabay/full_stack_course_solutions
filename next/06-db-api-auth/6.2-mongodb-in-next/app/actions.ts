"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Error as MongooseError, isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";

export type FormState = {
  values: { title: string; ingredients: string; difficulty: string; prepMinutes: string };
  errors: Record<string, string>;
  message?: string;
};

function readForm(formData: FormData): FormState["values"] {
  return {
    title: String(formData.get("title") ?? ""),
    ingredients: String(formData.get("ingredients") ?? ""),
    difficulty: String(formData.get("difficulty") ?? "easy"),
    prepMinutes: String(formData.get("prepMinutes") ?? ""),
  };
}

function toDoc(values: FormState["values"]) {
  return {
    title: values.title,
    ingredients: values.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
    difficulty: values.difficulty,
    prepMinutes: values.prepMinutes === "" ? undefined : Number(values.prepMinutes),
  };
}

// הוולידציה היא של המודל עצמו: ValidationError הופך לשגיאה ליד כל שדה
function validationErrors(err: unknown) {
  if (err instanceof MongooseError.ValidationError) {
    return Object.fromEntries(Object.entries(err.errors).map(([field, e]) => [field, e.message]));
  }
  if (err instanceof MongooseError.CastError) return { [err.path]: `${err.path} is not valid` };
  throw err;
}

export async function createRecipe(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = readForm(formData);
  await connectDB();
  try {
    await Recipe.create(toDoc(values));
  } catch (err) {
    return { values, errors: validationErrors(err) };
  }
  revalidatePath("/");
  return { values: { title: "", ingredients: "", difficulty: "easy", prepMinutes: "" }, errors: {}, message: "המתכון נוסף" };
}

export async function updateRecipe(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const values = readForm(formData);
  if (!isValidObjectId(id)) return { values, errors: {}, message: "מזהה לא תקין" };

  await connectDB();
  try {
    // runValidators: בלי זה, update לא מריץ את הוולידציה של הסכמה
    const updated = await Recipe.findByIdAndUpdate(id, toDoc(values), { runValidators: true });
    if (!updated) return { values, errors: {}, message: "המתכון לא נמצא" };
  } catch (err) {
    return { values, errors: validationErrors(err) };
  }
  revalidatePath("/");
  redirect("/");
}

export async function deleteRecipe(id: string) {
  if (!isValidObjectId(id)) return;
  await connectDB();
  await Recipe.findByIdAndDelete(id);
  revalidatePath("/");
}
