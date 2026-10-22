import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/products";
import { RecentlyViewed } from "@/components/recently-viewed";
import { TrackView } from "@/components/track-view";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-xl space-y-6 p-8">
      <section>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2">{product.description}</p>
        <p className="mt-2 text-xl font-semibold">₪{product.price}</p>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-2 font-semibold">צפית לאחרונה</h2>
        <Suspense fallback={<p className="text-sm text-zinc-500">טוען את המוצרים שצפית בהם...</p>}>
          <RecentlyViewed currentId={id} />
        </Suspense>
      </section>

      <TrackView id={id} />
    </main>
  );
}
