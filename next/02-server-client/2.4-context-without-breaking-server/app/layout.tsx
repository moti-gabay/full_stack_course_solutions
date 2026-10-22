import type { Metadata } from "next";
import Header from "./components/header";
import { CartProvider } from "./providers/cart-provider";
import { ThemeProvider } from "./providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "החנות",
  description: "תרגיל 2.4: Context בלי לשבור את השרת",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full bg-white text-black dark:bg-zinc-900 dark:text-zinc-100">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="mx-auto max-w-3xl p-6">{children}</main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
