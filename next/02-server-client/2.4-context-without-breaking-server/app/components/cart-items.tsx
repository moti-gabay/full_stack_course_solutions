"use client";

import { useCart } from "@/app/providers/cart-provider";
import type { Product } from "@/lib/products";

export default function CartItems({ products }: { products: Product[] }) {
  const { cart, remove } = useCart();
  const items = products.filter((product) => cart[product.id]);

  if (items.length === 0) return <p>הסל ריק.</p>;

  const total = items.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  return (
    <>
      <ul className="space-y-2">
        {items.map((product) => (
          <li key={product.id} className="flex items-center justify-between rounded border p-2">
            <span>
              {product.name} × {cart[product.id]}
            </span>
            <button onClick={() => remove(product.id)} className="text-red-600">
              הסר
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-bold">סה&quot;כ: ₪{total}</p>
    </>
  );
}
