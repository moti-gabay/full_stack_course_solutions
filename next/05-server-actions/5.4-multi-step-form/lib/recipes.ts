import "server-only";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  prepMinutes: number;
  image: string;
  owner: string;
};

const file = path.join(process.cwd(), "data", "recipes.json");
export const uploadsDir = path.join(process.cwd(), "uploads");

export async function getRecipes(): Promise<Recipe[]> {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return [];
  }
}

export async function addRecipe(recipe: Recipe) {
  const recipes = await getRecipes();
  recipes.push(recipe);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(recipes, null, 2));
}

export async function saveImage(image: File) {
  const ext = image.type.split("/")[1];
  const name = `${crypto.randomUUID()}.${ext}`;
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, name), Buffer.from(await image.arrayBuffer()));
  return name;
}
