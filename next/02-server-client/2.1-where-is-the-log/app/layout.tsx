import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "איפה הלוג?",
  description: "תרגיל 2.1: איפה הלוג?",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
