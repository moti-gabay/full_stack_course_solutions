import { notFound } from "next/navigation";
import { getRecipe, recipes } from "@/lib/recipes";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export default async function RecipePage({ params }: PageProps<"/recipes/[slug]">) {
  const { slug } = await params;
  const recipe = getRecipe(slug);

  if (!recipe) notFound();

  return (
    <article>
      <h1 className="text-2xl font-bold">{recipe.title}</h1>
      <p className="mt-1 text-gray-600">{recipe.minutes} דקות</p>
      <h2 className="mt-4 font-semibold">מצרכים</h2>
      <ul className="list-disc pr-6">
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
    </article>
  );
}
