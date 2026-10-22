import Link from "next/link";
import { cookies } from "next/headers";
import { getAllProducts } from "@/lib/products";

export async function RecentlyViewed({ currentId }: { currentId: string }) {
  const recent = (await cookies()).get("recent")?.value.split(",") ?? [];
  const products = await getAllProducts();
  const viewed = recent
    .filter((id) => id !== currentId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  if (viewed.length === 0) return <p className="text-sm text-zinc-500">עוד לא צפית במוצרים אחרים.</p>;

  return (
    <ul className="list-disc pr-6">
      {viewed.map((p) => (
        <li key={p.id}>
          <Link className="underline" href={`/products/${p.id}`}>{p.name}</Link>
        </li>
      ))}
    </ul>
  );
}
