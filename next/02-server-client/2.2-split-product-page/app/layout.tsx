import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "אוזניות אלחוטיות",
  description: "תרגיל 2.2: לפרק דף מוצר",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
