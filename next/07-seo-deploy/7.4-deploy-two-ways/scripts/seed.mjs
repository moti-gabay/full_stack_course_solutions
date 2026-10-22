import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URI);
const recipes = mongoose.connection.collection("recipes");
await recipes.deleteMany({});
const now = new Date();
await recipes.insertMany([
  { title: "שקשוקה", prepMinutes: 25, createdAt: now, updatedAt: now },
  { title: "פסטה ברוטב עגבניות", prepMinutes: 20, createdAt: now, updatedAt: now },
  { title: "עוגת שוקולד", prepMinutes: 50, createdAt: now, updatedAt: now },
]);
console.log("Seeded", await recipes.countDocuments(), "recipes");
await mongoose.disconnect();
