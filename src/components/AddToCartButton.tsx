"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export function AddToCartButton({
  item,
}: {
  item: {
    productId: string;
    slug: string;
    name: string;
    priceCents: number;
    imageUrl: string | null;
  };
}) {
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addToCart(item, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
    >
      {added ? "Adicionado!" : "Adicionar ao carrinho"}
    </button>
  );
}

