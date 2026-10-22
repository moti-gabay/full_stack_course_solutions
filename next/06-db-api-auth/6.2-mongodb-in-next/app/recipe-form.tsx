"use client";

import { useActionState } from "react";
import type { FormState } from "./actions";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initialValues?: FormState["values"];
  submitLabel: string;
};

const empty: FormState["values"] = { title: "", ingredients: "", difficulty: "easy", prepMinutes: "" };

export function RecipeForm({ action, initialValues = empty, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, { values: initialValues, errors: {} });
  const { values, errors } = state;

  return (
    <form action={formAction} className="space-y-3 rounded border p-4">
      <label className="block">
        שם המתכון
        <input name="title" defaultValue={values.title} className="block w-full rounded border px-3 py-2" />
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
      </label>
      <label className="block">
        מצרכים (מופרדים בפסיק)
        <input name="ingredients" defaultValue={values.ingredients} className="block w-full rounded border px-3 py-2" />
      </label>
      <div className="flex gap-3">
        <label className="block flex-1">
          רמת קושי
          {/* key: select לא מתעדכן לפי defaultValue חדש, אז מרנדרים אותו מחדש */}
          <select key={values.difficulty} name="difficulty" defaultValue={values.difficulty} className="block w-full rounded border px-3 py-2">
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          {errors.difficulty && <p className="text-sm text-red-600">{errors.difficulty}</p>}
        </label>
        <label className="block flex-1">
          זמן הכנה (דקות)
          <input name="prepMinutes" type="number" defaultValue={values.prepMinutes} className="block w-full rounded border px-3 py-2" />
          {errors.prepMinutes && <p className="text-sm text-red-600">{errors.prepMinutes}</p>}
        </label>
      </div>
      <button disabled={pending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? "שומר..." : submitLabel}
      </button>
      {state.message && <p className="text-sm">{state.message}</p>}
    </form>
  );
}
