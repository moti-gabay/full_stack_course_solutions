import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "layouts מקוננים",
  description: "תרגיל 1.3: layouts מקוננים",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
