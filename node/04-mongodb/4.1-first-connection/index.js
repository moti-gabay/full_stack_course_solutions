import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Book } from "./models/Book.js";

try {
  await connectDB();

  await Book.insertMany([
    { title: "1984", author: "George Orwell", year: 1949 },
    { title: "Dune", author: "Frank Herbert", year: 1965 },
    { title: "Clean Code", author: "Robert C. Martin", year: 2008 },
  ]);

  const books = await Book.find();
  console.log(`יש ${books.length} ספרים באוסף books:`);
  for (const book of books) console.log(`- ${book.title} (${book.author}, ${book.year})`);
} catch (err) {
  console.error("שגיאה:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
