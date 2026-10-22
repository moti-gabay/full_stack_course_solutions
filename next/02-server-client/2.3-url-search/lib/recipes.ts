export const recipes = [
  "שקשוקה",
  "פסטה ברוטב עגבניות",
  "פסטה ברוטב שמנת",
  "סלט ישראלי",
  "סלט קינואה",
  "מרק עדשים",
  "מרק עוף",
  "עוגת שוקולד",
  "עוגת גבינה",
  "פיצה מרגריטה",
  "חומוס",
  "שניצל",
];

export function searchRecipes(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return recipes;
  return recipes.filter((recipe) => recipe.toLowerCase().includes(normalized));
}
