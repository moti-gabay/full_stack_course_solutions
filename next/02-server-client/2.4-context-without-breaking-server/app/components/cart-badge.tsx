"use client";

import { useCart } from "@/app/providers/cart-provider";

export default function CartBadge() {
  const { count } = useCart();
  return <span className="rounded-full bg-blue-600 px-2 text-sm text-white">{count}</span>;
}
