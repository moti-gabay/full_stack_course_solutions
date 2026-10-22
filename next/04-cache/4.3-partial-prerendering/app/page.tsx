import Link from "next/link";
import { getAllProducts } from "@/lib/products";

export default async function Home() {
  const products = await getAllProducts();
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-3xl font-bold">מוצרים</h1>
      <ul className="list-disc space-y-1 pr-6">
        {products.map((p) => (
          <li key={p.id}>
            <Link className="underline" href={`/products/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
