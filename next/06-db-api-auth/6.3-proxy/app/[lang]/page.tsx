import { notFound } from "next/navigation";
import { dictionary, isLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{dictionary[lang].welcome}</h1>
    </main>
  );
}
