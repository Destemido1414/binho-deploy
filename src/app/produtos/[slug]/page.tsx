import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBRLFromCents } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export const runtime = "nodejs";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product || !product.isActive) return notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 text-sm text-zinc-600">
        <Link className="hover:underline" href="/produtos">
          Produtos
        </Link>{" "}
        <span className="text-zinc-400">/</span> {product.name}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-white">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Sem imagem
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <div className="text-2xl font-semibold">
            {formatBRLFromCents(product.priceCents)}
          </div>
          <div className="text-sm text-zinc-600">
            Pagamento via Pix, débito ou crédito (Mercado Pago).
          </div>

          <div className="pt-2">
            <AddToCartButton
              item={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
              }}
            />
          </div>

          {product.description ? (
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-semibold">Descrição</div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">
                {product.description}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border bg-white p-5 text-sm text-zinc-700">
            Não encontrou o que precisa? Peça um{" "}
            <Link className="font-medium underline" href="/orcamento">
              orçamento
            </Link>
            .
          </div>
        </div>
      </div>
    </main>
  );
}

