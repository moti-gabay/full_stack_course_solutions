import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Nav from "./components/nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ספר מתכונים",
  description: "תרגיל 1.1: דפים וניווט",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="mx-auto w-full max-w-3xl p-6">{children}</main>
      </body>
    </html>
  );
}
