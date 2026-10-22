import Link from "next/link";

export default function PostNotFound() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">404 · הפוסט לא נמצא</h1>
      <Link className="underline" href="/">חזרה לרשימה</Link>
    </main>
  );
}
