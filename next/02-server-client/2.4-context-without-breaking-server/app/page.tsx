import AddToCartButton from "./components/add-to-cart-button";
import { products } from "@/lib/products";

export default function ProductsPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">מוצרים</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <article key={product.id} className="rounded border p-4">
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-sm opacity-75">{product.description}</p>
            <p className="my-2">₪{product.price}</p>
            <AddToCartButton id={product.id} />
          </article>
        ))}
      </div>
    </>
  );
}
