import { notFound } from "next/navigation";
import { dictionary, isLocale } from "@/lib/i18n";
import { logout } from "../actions";

export default async function DashboardPage({ params }: PageProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionary[lang];

  return (
    <main className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">{t.dashboard}</h1>
      <p>{t.dashboardText}</p>
      <form action={logout.bind(null, lang)}>
        <button className="rounded border px-4 py-2">{t.logout}</button>
      </form>
    </main>
  );
}
