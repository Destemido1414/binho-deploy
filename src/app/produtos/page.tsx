import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const runtime = "nodejs";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    select: { name: true, slug: true, priceCents: true, imageUrl: true },
    take: 100,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Produtos</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Pesquise e escolha suas peças.
          </p>
        </div>

        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            className="h-11 w-72 max-w-full rounded-xl border bg-white px-3 outline-none focus:border-zinc-900"
            placeholder="Buscar por nome..."
          />
          <button className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800">
            Buscar
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {products.length === 0 ? (
        <div className="mt-6 rounded-2xl border bg-white p-6 text-sm text-zinc-600">
          Nenhum produto encontrado. Se você precisa de algo específico, peça um{" "}
          <Link className="font-medium underline" href="/orcamento">
            orçamento
          </Link>
          .
        </div>
      ) : null}
    </main>
  );
}

