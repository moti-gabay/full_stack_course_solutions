import mongoose from "mongoose";

export const DIFFICULTIES = ["easy", "medium", "hard"];

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, trim: true },
    ingredients: [String],
    difficulty: { type: String, enum: DIFFICULTIES },
    prepMinutes: { type: Number, min: 1 },
  },
  { timestamps: true }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);
