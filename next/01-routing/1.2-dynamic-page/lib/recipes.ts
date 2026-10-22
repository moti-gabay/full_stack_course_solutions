export type Recipe = {
  slug: string;
  title: string;
  minutes: number;
  ingredients: string[];
};

export const recipes: Recipe[] = [
  { slug: "shakshuka", title: "שקשוקה", minutes: 25, ingredients: ["עגבניות", "ביצים", "פלפל", "שום"] },
  { slug: "pasta", title: "פסטה ברוטב עגבניות", minutes: 20, ingredients: ["פסטה", "עגבניות", "בזיליקום"] },
  { slug: "chocolate-cake", title: "עוגת שוקולד", minutes: 50, ingredients: ["קמח", "קקאו", "סוכר", "ביצים"] },
];

export function getRecipe(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug);
}
