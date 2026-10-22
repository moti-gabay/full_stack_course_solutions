import mongoose from "mongoose";
import { Recipe } from "./Recipe.js";

const reviewSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true, index: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: { validator: Number.isInteger, message: "rating חייב להיות מספר שלם" },
    },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// recalculate the recipe's average from all of its reviews, right after a new review is saved
reviewSchema.post("save", async function () {
  const [stats] = await Review.aggregate([
    { $match: { recipe: this.recipe } },
    { $group: { _id: "$recipe", average: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await Recipe.findByIdAndUpdate(this.recipe, {
    averageRating: Math.round(stats.average * 10) / 10,
    reviewsCount: stats.count,
  });
});

export const Review = mongoose.model("Review", reviewSchema);
