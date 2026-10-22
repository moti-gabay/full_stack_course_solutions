"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "בית" },
  { href: "/recipes", label: "מתכונים" },
  { href: "/about", label: "אודות" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 border-b p-4">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "font-bold text-blue-600 underline" : "text-gray-600"}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
