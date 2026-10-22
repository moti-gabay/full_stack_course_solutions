import { cacheLife } from "next/cache";

export type Product = { id: string; name: string; price: number; description: string };

const PRODUCTS: Product[] = [
  { id: "1", name: "אוזניות אלחוטיות", price: 349, description: "ביטול רעשים אקטיבי, 30 שעות סוללה." },
  { id: "2", name: "מקלדת מכנית", price: 459, description: "מתגים שקטים, תאורה אחורית ו-USB-C." },
  { id: "3", name: "עכבר ארגונומי", price: 199, description: "אחיזה אנכית שמפחיתה עומס על פרק כף היד." },
  { id: "4", name: "מסך 27 אינץ'", price: 1290, description: "רזולוציית 4K, ‏IPS, ‏60Hz." },
];

export async function getProduct(id: string) {
  "use cache";
  cacheLife("days");
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function getAllProducts() {
  "use cache";
  cacheLife("days");
  return PRODUCTS;
}
