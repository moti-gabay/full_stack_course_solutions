"use client";

import { useActionState } from "react";
import { createRecipe, deleteRecipe, updateRecipe, type ActionResult } from "./actions";

function Result({ state }: { state: ActionResult }) {
  if (state.error) return <span className="text-sm text-red-600">{state.error}</span>;
  if (state.ok) return <span className="text-sm text-green-700">{state.ok}</span>;
  return null;
}

export function CreateRecipeForm() {
  const [state, action, pending] = useActionState(createRecipe, {});
  return (
    <form action={action} className="flex items-center gap-2">
      <input name="title" placeholder="מתכון חדש" className="flex-1 rounded border px-3 py-2" />
      <button disabled={pending} className="rounded bg-black px-4 py-2 text-white">הוספה</button>
      <Result state={state} />
    </form>
  );
}

export function RecipeRow({ id, title }: { id: string; title: string }) {
  const [updateState, update] = useActionState(updateRecipe, {});
  const [deleteState, remove] = useActionState(deleteRecipe, {});
  return (
    <li className="flex items-center gap-2 rounded border p-2">
      <form action={update} className="flex flex-1 items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <input name="title" defaultValue={title} className="flex-1 rounded border px-2 py-1" />
        <button className="rounded border px-3 py-1">שמירה</button>
        <Result state={updateState} />
      </form>
      <form action={remove}>
        <input type="hidden" name="id" value={id} />
        <button className="rounded border border-red-600 px-3 py-1 text-red-600">מחיקה</button>
        <Result state={deleteState} />
      </form>
    </li>
  );
}
