import Link from "next/link";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex gap-4 bg-amber-100 p-4">
        <Link href="/" className="font-bold">
          המתכונייה
        </Link>
        <Link href="/about">אודות</Link>
        <Link href="/dashboard">לדשבורד</Link>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 p-6">{children}</main>
      <footer className="bg-amber-100 p-4 text-center text-sm">© המתכונייה</footer>
    </div>
  );
}
