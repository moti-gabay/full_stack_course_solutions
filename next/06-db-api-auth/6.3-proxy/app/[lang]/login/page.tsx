import { notFound } from "next/navigation";
import { dictionary, isLocale } from "@/lib/i18n";
import { login } from "../actions";

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionary[lang];

  return (
    <main className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">{t.login}</h1>
      <form action={login.bind(null, lang)}>
        <button className="rounded bg-black px-4 py-2 text-white">{t.loginButton}</button>
      </form>
    </main>
  );
}
