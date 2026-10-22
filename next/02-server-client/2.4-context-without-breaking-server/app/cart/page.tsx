import CartItems from "../components/cart-items";
import { products } from "@/lib/products";

export default function CartPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">הסל שלי</h1>
      <CartItems products={products} />
    </>
  );
}
