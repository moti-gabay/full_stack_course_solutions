"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser } from "@/lib/session";
import { addRecipe, saveImage } from "@/lib/recipes";
import { stepSchemas, TEXT_FIELDS, type Values, type WizardState } from "./schemas";

export async function wizardStep(prev: WizardState, formData: FormData): Promise<WizardState> {
  // בדיקת ההרשאה בתוך ה-action עצמו: כל אחד יכול לשלוח POST ישירות, בלי לעבור בדף
  const user = await getUser();
  if (!user) return { ...prev, error: "נדרשת התחברות" };

  const values = Object.fromEntries(
    TEXT_FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Values;

  const step = Number(formData.get("step"));
  if (step !== 1 && step !== 2 && step !== 3) return { ...prev, error: "שלב לא תקין" };

  if (formData.get("intent") === "back") {
    return { step: Math.max(1, step - 1) as WizardState["step"], values, errors: {} };
  }

  // לא סומכים על הלקוח שהשלבים הקודמים כבר עברו: מאמתים את כל השלבים עד השלב הנוכחי
  const input = { ...values, image: formData.get("image") };
  for (let i = 0; i < step; i++) {
    const result = stepSchemas[i].safeParse(input);
    if (!result.success) {
      return { step: (i + 1) as WizardState["step"], values, errors: z.flattenError(result.error).fieldErrors };
    }
  }

  if (step < 3) return { step: (step + 1) as WizardState["step"], values, errors: {} };

  const image = await saveImage(input.image as File);
  const id = crypto.randomUUID();
  await addRecipe({
    id,
    title: values.title.trim(),
    description: values.description.trim(),
    ingredients: values.ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
    prepMinutes: Number(values.prepMinutes),
    image,
    owner: user,
  });

  redirect(`/recipes/${id}`);
}
