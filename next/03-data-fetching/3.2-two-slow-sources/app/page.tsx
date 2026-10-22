import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-3xl font-bold">שני מקורות איטיים</h1>
      <p>אותם שני מקורות (2 ו-4 שניות), בשלוש דרכים:</p>
      <ul className="list-disc space-y-1 pr-6">
        <li><Link className="underline" href="/serial">await בטור</Link></li>
        <li><Link className="underline" href="/parallel">Promise.all</Link></li>
        <li><Link className="underline" href="/streaming">streaming עם Suspense</Link></li>
      </ul>
    </main>
  );
}
