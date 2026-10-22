import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    year: Number,
    // a reference: only the author's _id is stored, populate() brings the document
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true, index: true },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
