import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-3xl font-bold">פוסטים</h1>
      <ul className="list-disc space-y-1 pr-6">
        <li><Link className="underline" href="/posts/1">פוסט 1</Link></li>
        <li><Link className="underline" href="/posts/2">פוסט 2</Link></li>
        <li><Link className="underline" href="/posts/99999">פוסט 99999 (לא קיים)</Link></li>
      </ul>
    </main>
  );
}
