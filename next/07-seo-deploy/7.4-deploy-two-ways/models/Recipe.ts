import { Schema, model, models, type InferSchemaType } from "mongoose";

const recipeSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    prepMinutes: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

export type RecipeDoc = InferSchemaType<typeof recipeSchema>;

// models.Recipe: בפיתוח הקובץ נטען שוב אחרי כל שמירה, ו-model() פעמיים זורק שגיאה
export const Recipe = models.Recipe || model("Recipe", recipeSchema);
