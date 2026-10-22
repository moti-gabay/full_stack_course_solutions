"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { wizardStep } from "./actions";
import { initialState, TEXT_FIELDS } from "./schemas";

const STEP_FIELDS = {
  1: ["title", "description"],
  2: ["ingredients", "prepMinutes"],
  3: [],
} as const;

function Buttons({ step }: { step: number }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-2">
      {step > 1 && (
        <button name="intent" value="back" formNoValidate disabled={pending} className="rounded border px-4 py-2">
          חזרה
        </button>
      )}
      <button name="intent" value="next" disabled={pending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {pending ? "שולח..." : step < 3 ? "המשך" : "סיום"}
      </button>
    </div>
  );
}

function Error({ messages }: { messages?: string[] }) {
  return messages ? <p className="text-sm text-red-600">{messages[0]}</p> : null;
}

export function Wizard() {
  const [state, formAction] = useActionState(wizardStep, initialState);
  const { step, values, errors } = state;
  const visible: readonly string[] = STEP_FIELDS[step];

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-sm text-zinc-500">שלב {step} מתוך 3</p>
      <input type="hidden" name="step" value={step} />

      {/* הערכים של שאר השלבים עוברים בשדות מוסתרים; השרת מאמת אותם שוב בכל שליחה */}
      {TEXT_FIELDS.filter((f) => !visible.includes(f)).map((f) => (
        <input key={f} type="hidden" name={f} value={values[f]} />
      ))}

      {step === 1 && (
        <>
          <label className="block">
            שם המתכון
            <input name="title" required minLength={3} defaultValue={values.title} className="block w-full rounded border px-3 py-2" />
            <Error messages={errors.title} />
          </label>
          <label className="block">
            תיאור
            <textarea name="description" required defaultValue={values.description} className="block w-full rounded border px-3 py-2" />
            <Error messages={errors.description} />
          </label>
        </>
      )}

      {step === 2 && (
        <>
          <label className="block">
            מצרכים (אחד בכל שורה)
            <textarea name="ingredients" required defaultValue={values.ingredients} className="block w-full rounded border px-3 py-2" />
            <Error messages={errors.ingredients} />
          </label>
          <label className="block">
            זמן הכנה בדקות
            <input name="prepMinutes" type="number" min={1} required defaultValue={values.prepMinutes} className="block w-full rounded border px-3 py-2" />
            <Error messages={errors.prepMinutes} />
          </label>
        </>
      )}

      {step === 3 && (
        <label className="block">
          תמונה (PNG, JPEG או WebP, עד 2MB)
          <input name="image" type="file" accept="image/png,image/jpeg,image/webp" required className="block w-full" />
          <Error messages={errors.image} />
        </label>
      )}

      {state.error && <p className="text-red-600">{state.error}</p>}
      <Buttons step={step} />
    </form>
  );
}
