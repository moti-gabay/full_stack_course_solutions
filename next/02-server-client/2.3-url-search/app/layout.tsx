import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "חיפוש מתכונים",
  description: "תרגיל 2.3: חיפוש דרך ה-URL",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
