import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";
import { logout } from "../auth-actions";
import { CreateRecipeForm, RecipeRow } from "./recipe-forms";

async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const recipes = await Recipe.find({ owner: session.user.id }).sort({ createdAt: -1 }).lean<{ _id: unknown; title: string }[]>();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p>שלום, {session.user.name}</p>
        <form action={logout}>
          <button className="rounded border px-3 py-1">התנתקות</button>
        </form>
      </div>
      <CreateRecipeForm />
      <ul className="space-y-2">
        {recipes.map((r) => (
          <RecipeRow key={String(r._id)} id={String(r._id)} title={r.title} />
        ))}
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">המתכונים שלי</h1>
      <Suspense fallback={<p>טוען...</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
