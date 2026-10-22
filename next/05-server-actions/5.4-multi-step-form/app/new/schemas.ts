import { z } from "zod";

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

// סכמה לכל שלב. בשלב N השרת מריץ את כל הסכמות 1..N
export const stepSchemas: z.ZodObject[] = [
  z.object({
    title: z.string().trim().min(3, "כותרת של לפחות 3 תווים"),
    description: z.string().trim().min(10, "תיאור של לפחות 10 תווים"),
  }),
  z.object({
    ingredients: z.string().trim().min(1, "צריך לפחות מצרך אחד"),
    prepMinutes: z.coerce.number("זמן הכנה חייב להיות מספר").int().min(1, "זמן הכנה של לפחות דקה"),
  }),
  z.object({
    image: z
      .instanceof(File, { message: "צריך לבחור תמונה" })
      .refine((f) => f.size > 0, "צריך לבחור תמונה")
      .refine((f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type), "רק PNG, JPEG או WebP")
      .refine((f) => f.size <= MAX_IMAGE_BYTES, "עד 2MB"),
  }),
];

export const TEXT_FIELDS = ["title", "description", "ingredients", "prepMinutes"] as const;
export type Values = Record<(typeof TEXT_FIELDS)[number], string>;

export type WizardState = {
  step: 1 | 2 | 3;
  values: Values;
  errors: Record<string, string[] | undefined>;
  error?: string;
};

export const initialState: WizardState = {
  step: 1,
  values: { title: "", description: "", ingredients: "", prepMinutes: "" },
  errors: {},
};
