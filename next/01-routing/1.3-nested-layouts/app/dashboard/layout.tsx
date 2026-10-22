import Link from "next/link";

const links = [
  { href: "/dashboard", label: "סקירה" },
  { href: "/dashboard/settings", label: "הגדרות" },
  { href: "/dashboard/slow", label: "דף איטי" },
  { href: "/dashboard/broken", label: "דף עם שגיאה" },
  { href: "/", label: "חזרה לאתר" },
] as const;

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-48 bg-slate-800 p-4 text-white">
        <h2 className="mb-4 font-bold">דשבורד</h2>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
