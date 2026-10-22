import mongoose, { Schema, type InferSchemaType } from "mongoose";

// אותה סכמה כמו בתרגיל Node 4.3
const recipeSchema = new Schema(
  {
    title: { type: String, required: [true, "title is required"], minlength: [3, "title must be at least 3 characters"], trim: true },
    ingredients: { type: [String], default: [] },
    difficulty: { type: String, enum: { values: ["easy", "medium", "hard"], message: "difficulty must be easy, medium or hard" }, default: "easy" },
    prepMinutes: { type: Number, min: [1, "prepMinutes must be at least 1"] },
  },
  { timestamps: true },
);

export type RecipeDoc = InferSchemaType<typeof recipeSchema>;

// בטעינה מחדש ב-dev המודל כבר רשום; model() פעם שנייה היה זורק OverwriteModelError
export const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
