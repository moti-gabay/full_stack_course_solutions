import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // הופך נתיבים יחסיים (כמו תמונת ה-OG) לכתובות מלאות, ש-WhatsApp ופייסבוק דורשים
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Home Kitchen",
    default: "Home Kitchen",
  },
  description: "Simple home recipes with clear steps and prep times.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b p-4">
          <Link href="/" className="font-bold">
            Home Kitchen
          </Link>
        </header>
        <main className="mx-auto w-full max-w-3xl p-4">{children}</main>
      </body>
    </html>
  );
}
