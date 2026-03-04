import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function AdminDashboard() {
  const [products, quotes, pendingOrders] = await Promise.all([
    prisma.product.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Visão rápida do seu site.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card title="Produtos" value={products} href="/admin/produtos" />
        <Card title="Orçamentos (novos)" value={quotes} href="/admin/orcamentos" />
        <Card
          title="Pedidos (pendentes)"
          value={pendingOrders}
          href="/admin/pedidos"
        />
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <h2 className="font-semibold">Ações rápidas</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/produtos/novo"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Cadastrar produto
          </Link>
          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Ver site
          </Link>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  href,
}: {
  title: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow"
    >
      <div className="text-sm text-zinc-600">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </Link>
  );
}


