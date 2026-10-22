"use client";

import { useActionState } from "react";
import { loginWithPassword } from "../auth-actions";

export function PasswordForm() {
  const [error, action, pending] = useActionState(loginWithPassword, "");
  return (
    <form action={action} className="space-y-3">
      <input name="email" type="email" placeholder="אימייל" required className="block w-full rounded border px-3 py-2" />
      <input name="password" type="password" placeholder="סיסמה" required className="block w-full rounded border px-3 py-2" />
      {error && <p className="text-red-600">{error}</p>}
      <button disabled={pending} className="rounded bg-black px-4 py-2 text-white">התחברות עם סיסמה</button>
    </form>
  );
}
