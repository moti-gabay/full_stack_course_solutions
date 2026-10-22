import { Suspense } from "react";
import Link from "next/link";
import { getUser } from "@/lib/session";
import { Wizard } from "./wizard";

async function Gate() {
  const user = await getUser();
  if (!user) {
    return (
      <p>
        צריך <Link href="/login" className="underline">להתחבר</Link> כדי להוסיף מתכון.
      </p>
    );
  }
  return <Wizard />;
}

export default function NewRecipePage() {
  return (
    <main className="mx-auto max-w-md space-y-6 p-8">
      <h1 className="text-2xl font-bold">מתכון חדש</h1>
      <Suspense fallback={<p>טוען...</p>}>
        <Gate />
      </Suspense>
    </main>
  );
}
