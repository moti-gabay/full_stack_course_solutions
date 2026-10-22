"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { createLocalStorageStore } from "@/lib/local-storage-store";

type Cart = Record<string, number>;

type CartContextValue = {
  cart: Cart;
  count: number;
  add: (id: string) => void;
  remove: (id: string) => void;
};

const cartStore = createLocalStorageStore<Cart>("cart", {});
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  function add(id: string) {
    cartStore.set({ ...cart, [id]: (cart[id] ?? 0) + 1 });
  }

  function remove(id: string) {
    const next = { ...cart };
    delete next[id];
    cartStore.set(next);
  }

  return <CartContext value={{ cart, count, add, remove }}>{children}</CartContext>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
