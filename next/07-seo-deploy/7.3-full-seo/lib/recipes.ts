export type Recipe = {
  slug: string;
  title: string;
  description: string;
  minutes: number;
  ingredients: string[];
};

export const recipes: Recipe[] = [
  {
    slug: "shakshuka",
    title: "Shakshuka",
    description: "Eggs poached in a spicy tomato and pepper sauce. A one-pan breakfast ready in 25 minutes.",
    minutes: 25,
    ingredients: ["4 eggs", "5 tomatoes", "1 red pepper", "2 garlic cloves", "Paprika and cumin"],
  },
  {
    slug: "tomato-pasta",
    title: "Tomato Pasta",
    description: "Spaghetti in a quick garlic and basil tomato sauce. Simple weeknight dinner for four.",
    minutes: 20,
    ingredients: ["400g spaghetti", "1 can crushed tomatoes", "3 garlic cloves", "Fresh basil", "Olive oil"],
  },
  {
    slug: "chocolate-cake",
    title: "Chocolate Cake",
    description: "A moist one-bowl chocolate cake with a rich cocoa flavor. No mixer needed.",
    minutes: 50,
    ingredients: ["2 cups flour", "1 cup sugar", "3/4 cup cocoa", "2 eggs", "1 cup milk"],
  },
];

export function getRecipe(slug: string) {
  return recipes.find((r) => r.slug === slug);
}
