"use client";

import { useCart } from "@/app/providers/cart-provider";

export default function AddToCartButton({ id }: { id: string }) {
  const { cart, add } = useCart();
  const quantity = cart[id] ?? 0;

  return (
    <button onClick={() => add(id)} className="rounded bg-blue-600 px-3 py-1 text-white">
      הוסף לסל {quantity > 0 && `(${quantity})`}
    </button>
  );
}
