import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { connectDB } from "./config/db.js";
import { Recipe, DIFFICULTIES } from "./models/Recipe.js";
import { slugify } from "./utils/slugify.js";

const COUNT = 100;
const TAGS = ["vegan", "quick", "dessert", "italian", "spicy", "breakfast", "healthy", "kids"];

// titles must be unique by slug, otherwise the unique index rejects the insert
function uniqueTitles(count) {
  const titles = new Map();
  while (titles.size < count) {
    const title = `${faker.food.adjective()} ${faker.food.dish()}`;
    titles.set(slugify(title), title);
  }
  return [...titles.values()];
}

try {
  await connectDB();
  await Recipe.deleteMany({});
  await Recipe.init(); // make sure the unique index exists before inserting

  const recipes = uniqueTitles(COUNT).map((title) => ({
    title,
    ingredients: faker.helpers.multiple(() => faker.food.ingredient(), { count: { min: 3, max: 8 } }),
    difficulty: faker.helpers.arrayElement(DIFFICULTIES),
    prepMinutes: faker.number.int({ min: 5, max: 180 }),
    tags: faker.helpers.arrayElements(TAGS, { min: 1, max: 3 }),
  }));

  await Recipe.create(recipes); // create (not insertMany) runs the slug hook for every recipe
  console.log(`נוספו ${await Recipe.countDocuments()} מתכונים`);
} catch (err) {
  console.error("seed נכשל:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
