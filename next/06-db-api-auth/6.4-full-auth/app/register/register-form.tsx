"use client";

import { useActionState } from "react";
import { register } from "../auth-actions";

export function RegisterForm() {
  const [error, action, pending] = useActionState(register, "");
  return (
    <form action={action} className="space-y-3">
      <input name="name" placeholder="שם" required className="block w-full rounded border px-3 py-2" />
      <input name="email" type="email" placeholder="אימייל" required className="block w-full rounded border px-3 py-2" />
      <input name="password" type="password" placeholder="סיסמה (לפחות 8 תווים)" required minLength={8} className="block w-full rounded border px-3 py-2" />
      {error && <p className="text-red-600">{error}</p>}
      <button disabled={pending} className="rounded bg-black px-4 py-2 text-white">הרשמה</button>
    </form>
  );
}
