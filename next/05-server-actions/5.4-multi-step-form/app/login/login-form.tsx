"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [error, formAction, pending] = useActionState(login, "");
  return (
    <form action={formAction} className="space-y-4">
      <input name="username" placeholder="שם משתמש (dana)" required className="block w-full rounded border px-3 py-2" />
      <input name="password" type="password" placeholder="סיסמה (1234)" required className="block w-full rounded border px-3 py-2" />
      {error && <p className="text-red-600">{error}</p>}
      <button disabled={pending} className="rounded bg-black px-4 py-2 text-white">התחברות</button>
    </form>
  );
}
