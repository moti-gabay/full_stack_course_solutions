import AddToCartButton from "./components/add-to-cart-button";

const product = {
  name: "אוזניות אלחוטיות",
  price: 349,
  description: "אוזניות עם סינון רעשים, 30 שעות סוללה וטעינה מהירה.",
  features: ["סינון רעשים אקטיבי", "Bluetooth 5.3", "טעינת USB-C"],
};

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="mt-2 text-xl text-green-700">₪{product.price}</p>
      <p className="mt-4">{product.description}</p>
      <ul className="mt-4 list-disc pr-6">
        {product.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <div className="mt-6">
        <AddToCartButton />
      </div>
    </main>
  );
}
