import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

export const DIFFICULTIES = ["easy", "medium", "hard"];

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, trim: true },
    slug: { type: String, unique: true },
    ingredients: [String],
    difficulty: { type: String, enum: DIFFICULTIES },
    prepMinutes: { type: Number, min: 1 },
    tags: [String],
    // kept up to date by the Review model on every new review
    averageRating: { type: Number, default: null },
    reviewsCount: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// the slug always comes from the title: on create...
recipeSchema.pre("validate", function () {
  if (this.title && this.isModified("title")) this.slug = slugify(this.title);
});

// ...and on PATCH, which goes through findOneAndUpdate and skips document hooks
recipeSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (typeof update.title === "string") update.slug = slugify(update.title);
});

// soft delete: every find* and countDocuments ignores deleted recipes
function hideDeleted() {
  this.where({ deletedAt: null });
}
recipeSchema.pre(/^find/, hideDeleted);
recipeSchema.pre("countDocuments", hideDeleted);
recipeSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { deletedAt: null } });
});

export const Recipe = mongoose.model("Recipe", recipeSchema);
