import Link from "next/link";
import { loginWithGitHub } from "../auth-actions";
import { PasswordForm } from "./password-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-sm space-y-6 p-8">
      <h1 className="text-2xl font-bold">התחברות</h1>
      <form action={loginWithGitHub}>
        <button className="w-full rounded border px-4 py-2">התחברות עם GitHub</button>
      </form>
      <hr />
      <PasswordForm />
      <p className="text-sm">
        אין לכם משתמש? <Link href="/register" className="underline">הרשמה</Link>
      </p>
    </main>
  );
}
