"use client";

export default function PostError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">לא הצלחנו לטעון את הפוסט</h1>
      <p>יש בעיה בחיבור לשרת הפוסטים. נסו שוב בעוד רגע.</p>
      <button className="rounded bg-black px-4 py-2 text-white" onClick={() => retry()}>
        נסו שוב
      </button>
    </main>
  );
}
