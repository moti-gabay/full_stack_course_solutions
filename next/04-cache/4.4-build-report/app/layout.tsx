import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "תרגיל 4.4 · דוח build",
  description: "נתיבים סטטיים, חלקיים ודינמיים",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="flex gap-4 border-b p-4">
          <Link href="/">בית</Link>
          <Link href="/about">אודות</Link>
          <Link href="/blog">בלוג</Link>
          <Link href="/team">צוות</Link>
          <Link href="/account">החשבון שלי</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
