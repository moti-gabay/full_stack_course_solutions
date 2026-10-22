import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <p className="text-7xl font-black text-slate-300">404</p>
      <h1 className="text-2xl font-bold">הדף לא נמצא</h1>
      <Link href="/" className="rounded bg-slate-800 px-4 py-2 text-white">
        חזרה לדף הבית
      </Link>
    </div>
  );
}
