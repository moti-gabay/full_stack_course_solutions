import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRecipes } from "@/lib/recipes";

async function Recipe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = (await getRecipes()).find((r) => r.id === id);
  if (!recipe) notFound();

  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">{recipe.title}</h1>
      <Image src={`/uploads/${recipe.image}`} alt={recipe.title} width={600} height={400} unoptimized className="h-auto w-full rounded" />
      <p>{recipe.description}</p>
      <p>זמן הכנה: {recipe.prepMinutes} דקות</p>
      <ul className="list-disc ps-6">
        {recipe.ingredients.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </article>
  );
}

export default function RecipePage({ params }: PageProps<"/recipes/[id]">) {
  return (
    <main className="mx-auto max-w-xl p-8">
      <Suspense fallback={<p>טוען...</p>}>
        <Recipe params={params} />
      </Suspense>
    </main>
  );
}
