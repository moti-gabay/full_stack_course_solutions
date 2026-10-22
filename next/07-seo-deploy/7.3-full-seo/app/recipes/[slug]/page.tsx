import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecipe, recipes } from "@/lib/recipes";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

// אותם נתונים שהדף משתמש בהם: כותרת ותיאור לכל מתכון
export async function generateMetadata({
  params,
}: PageProps<"/recipes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};

  return {
    title: recipe.title,
    description: recipe.description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: "article",
      url: `/recipes/${recipe.slug}`,
    },
  };
}

export default async function RecipePage({ params }: PageProps<"/recipes/[slug]">) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <p className="mt-2">{recipe.description}</p>
      <p className="mt-2">Prep time: {recipe.minutes} minutes</p>
      <h2 className="mt-4 text-xl font-semibold">Ingredients</h2>
      <ul className="list-disc ps-6">
        {recipe.ingredients.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
