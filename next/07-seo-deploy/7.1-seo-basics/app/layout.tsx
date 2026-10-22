import type { Metadata } from "next";
import Link from "next/link";
import { Rubik } from "next/font/google";
import "./globals.css";

// next/font מארח את הפונט מקומית ומייצר fallback מותאם (size-adjust),
// כך שהטקסט לא קופץ כשהפונט האמיתי נטען.
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | המטבח של דנה",
    default: "המטבח של דנה",
  },
  description: "מתכונים ביתיים פשוטים לכל יום, עם הוראות ברורות וזמני הכנה.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <nav className="flex gap-4 border-b p-4">
          <Link href="/">בית</Link>
          <Link href="/recipes">מתכונים</Link>
          <Link href="/about">אודות</Link>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
