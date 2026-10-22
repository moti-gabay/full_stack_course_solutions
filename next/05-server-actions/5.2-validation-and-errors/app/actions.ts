"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים"),
  email: z.email("כתובת אימייל לא תקינה"),
  age: z.coerce
    .number("גיל חייב להיות מספר")
    .int("גיל חייב להיות מספר שלם")
    .min(18, "ההרשמה מגיל 18")
    .max(120, "גיל לא סביר"),
});

type Fields = z.input<typeof schema>;

export type FormState = {
  values: Record<keyof Fields, string>;
  errors: Partial<Record<keyof Fields, string[]>>;
  message?: string;
};

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    age: String(formData.get("age") ?? ""),
  };

  // השהיה מלאכותית כדי לראות את "שומר..." על הכפתור
  await new Promise((r) => setTimeout(r, 1000));

  const result = schema.safeParse(values);
  if (!result.success) {
    // מחזירים גם את הערכים, כדי שהטופס יציג את מה שהמשתמש הקליד
    return { values, errors: z.flattenError(result.error).fieldErrors };
  }

  // כאן הייתה שמירה למסד
  return {
    values: { name: "", email: "", age: "" },
    errors: {},
    message: `ההרשמה של ${result.data.name} נשמרה`,
  };
}
