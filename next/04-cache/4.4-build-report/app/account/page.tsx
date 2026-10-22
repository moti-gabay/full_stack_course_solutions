import { Suspense } from "react";
import { cookies } from "next/headers";

async function Greeting() {
  const name = (await cookies()).get("name")?.value;
  return <p>{name ? `שלום ${name}` : "לא מחובר"}</p>;
}

export default function Account() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-3xl font-bold">החשבון שלי</h1>
      <Suspense fallback={<p>טוען...</p>}>
        <Greeting />
      </Suspense>
    </main>
  );
}
