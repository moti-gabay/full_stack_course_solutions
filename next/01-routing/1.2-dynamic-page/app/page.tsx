import Link from "next/link";
import { recipes } from "@/lib/recipes";

export default function HomePage() {
  return (
    <>
      <h1 className="text-2xl font-bold">מתכונים</h1>
      <ul className="mt-4 list-disc pr-6">
        {recipes.map((recipe) => (
          <li key={recipe.slug}>
            <Link href={`/recipes/${recipe.slug}`} className="text-blue-600 underline">
              {recipe.title}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/recipes/nope" className="text-gray-500 underline">
            מתכון שלא קיים
          </Link>
        </li>
      </ul>
    </>
  );
}
