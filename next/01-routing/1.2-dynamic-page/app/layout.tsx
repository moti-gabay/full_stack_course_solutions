import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מתכונים",
  description: "תרגיל 1.2: דף דינמי",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full">
        <main className="mx-auto max-w-3xl p-6">{children}</main>
      </body>
    </html>
  );
}
