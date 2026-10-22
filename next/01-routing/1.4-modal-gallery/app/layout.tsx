import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "גלריה",
  description: "תרגיל 1.4: גלריה עם modal",
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full">
        {children}
        {modal}
      </body>
    </html>
  );
}
