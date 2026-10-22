"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register, type FormState } from "./actions";

const initialState: FormState = { values: { name: "", email: "", age: "" }, errors: {} };

function SubmitButton() {
  // useFormStatus קורא את המצב של ה-<form> שעוטף את הקומפוננטה
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
      {pending ? "שומר..." : "שמור"}
    </button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return <p className="text-sm text-red-600">{errors[0]}</p>;
}

export function RegisterForm() {
  const [state, formAction] = useActionState(register, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        שם
        <input name="name" required defaultValue={state.values.name} className="block w-full rounded border px-3 py-2" />
        <FieldError errors={state.errors.name} />
      </label>

      <label className="block">
        אימייל
        <input name="email" type="email" required defaultValue={state.values.email} className="block w-full rounded border px-3 py-2" />
        <FieldError errors={state.errors.email} />
      </label>

      <label className="block">
        גיל
        <input name="age" type="number" required defaultValue={state.values.age} className="block w-full rounded border px-3 py-2" />
        <FieldError errors={state.errors.age} />
      </label>

      <SubmitButton />
      {state.message && <p className="text-green-700">{state.message}</p>}
    </form>
  );
}
