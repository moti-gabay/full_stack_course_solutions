export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export const products: Product[] = [
  { id: "headphones", name: "אוזניות אלחוטיות", price: 349, description: "סינון רעשים, 30 שעות סוללה." },
  { id: "keyboard", name: "מקלדת מכנית", price: 459, description: "מתגים שקטים, תאורה אחורית." },
  { id: "mouse", name: "עכבר ארגונומי", price: 189, description: "אלחוטי, נטען ב-USB-C." },
  { id: "monitor", name: "מסך 27 אינץ'", price: 1290, description: "רזולוציית 4K, ‏HDR." },
];
