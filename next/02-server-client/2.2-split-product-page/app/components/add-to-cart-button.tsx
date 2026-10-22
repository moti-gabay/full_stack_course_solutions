"use client";

import { useState } from "react";

export default function AddToCartButton() {
  const [quantity, setQuantity] = useState(0);

  return (
    <button onClick={() => setQuantity(quantity + 1)} className="rounded bg-blue-600 px-4 py-2 text-white">
      הוסף לסל {quantity > 0 && `(${quantity} בסל)`}
    </button>
  );
}
