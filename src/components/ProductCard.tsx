import Image from "next/image";
import Link from "next/link";
import { formatBRLFromCents } from "@/lib/format";

export function ProductCard({
  product,
}: {
  product: {
    name: string;
    slug: string;
    priceCents: number;
    imageUrl: string | null;
  };
}) {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">
            Sem imagem
          </div>
        )}
      </div>
      <div className="mt-3 font-medium leading-snug">{product.name}</div>
      <div className="mt-1 text-sm text-zinc-600">
        {formatBRLFromCents(product.priceCents)}
      </div>
    </Link>
  );
}

