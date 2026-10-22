import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getRecipe } from "@/lib/recipes";
import { updateRecipe } from "@/app/actions";
import { RecipeForm } from "@/app/recipe-form";

async function EditForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  return (
    <RecipeForm
      action={updateRecipe.bind(null, id)}
      submitLabel="שמירה"
      initialValues={{
        title: recipe.title,
        ingredients: recipe.ingredients.join(", "),
        difficulty: recipe.difficulty,
        prepMinutes: recipe.prepMinutes?.toString() ?? "",
      }}
    />
  );
}

export default function EditPage({ params }: PageProps<"/recipes/[id]/edit">) {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">עריכת מתכון</h1>
      <Suspense fallback={<p>טוען...</p>}>
        <EditForm params={params} />
      </Suspense>
    </main>
  );
}
