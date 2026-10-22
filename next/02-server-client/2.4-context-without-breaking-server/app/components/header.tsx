import Link from "next/link";
import CartBadge from "./cart-badge";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  return (
    <header className="flex items-center gap-4 border-b p-4">
      <Link href="/" className="font-bold">
        החנות
      </Link>
      <Link href="/cart" className="flex items-center gap-1">
        סל <CartBadge />
      </Link>
      <div className="mr-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
