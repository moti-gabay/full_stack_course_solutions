import Link from "next/link";
import { recipes } from "@/lib/recipes";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold">Recipes</h1>
      <ul className="mt-4 space-y-3">
        {recipes.map((recipe) => (
          <li key={recipe.slug}>
            <Link href={`/recipes/${recipe.slug}`} className="text-lg underline">
              {recipe.title}
            </Link>
            <p>{recipe.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
