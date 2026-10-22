import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-md space-y-4 p-8">
      <h1 className="text-2xl font-bold">ספר המתכונים שלי</h1>
      <p>
        <Link href="/dashboard" className="underline">לדשבורד</Link> (דורש <Link href="/login" className="underline">התחברות</Link>)
      </p>
    </main>
  );
}
