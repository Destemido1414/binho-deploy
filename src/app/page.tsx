import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const runtime = "nodejs";

export default async function Home() {
  return (
    <main>
      <section className="bg-gradient-to-b from-white to-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs text-zinc-700">
                Pix • Débito • Crédito (Mercado Pago)
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">
                Peças e acessórios para sua moto, com compra simples e segura.
              </h1>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Catálogo atualizado, orçamento rápido e checkout pelo Mercado Pago
                com Pix e cartões.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/produtos"
                  className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Ver produtos
                </Link>
                <Link
                  href="/orcamento"
                  className="rounded-xl border bg-white px-5 py-3 text-sm font-medium hover:bg-zinc-50"
                >
                  Pedir orçamento
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <Feature title="Entrega / retirada" desc="Organize como preferir." />
                <Feature title="Pagamento seguro" desc="Checkout Mercado Pago." />
                <Feature title="Orçamento rápido" desc="Envie sua lista de peças." />
                <Feature title="Painel admin" desc="Cadastre e edite produtos." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Destaques do catálogo
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Alguns produtos mais recentes.
            </p>
          </div>
          <Link href="/produtos" className="text-sm font-medium hover:underline">
            Ver todos
          </Link>
        </div>

        <FeaturedProducts />
      </section>
    </main>
  );
}

async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
    take: 6,
    select: { name: true, slug: true, priceCents: true, imageUrl: true },
  });

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
      {products.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
          Ainda não há produtos cadastrados. Acesse o painel em{" "}
          <Link className="font-medium underline" href="/admin">
            /admin
          </Link>{" "}
          para cadastrar.
        </div>
      ) : null}
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-zinc-50 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-zinc-600">{desc}</div>
    </div>
  );
}

