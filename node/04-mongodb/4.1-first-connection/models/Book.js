import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: Number,
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
