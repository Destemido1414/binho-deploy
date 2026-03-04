import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRLFromCents } from "@/lib/format";

export const runtime = "nodejs";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Últimos pedidos e status de pagamento.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="grid grid-cols-12 gap-3 border-b bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600">
          <div className="col-span-4">Pedido</div>
          <div className="col-span-3">Cliente</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-3 text-right">Status</div>
        </div>
        <div className="divide-y">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/pedido/${o.id}`}
              className="grid grid-cols-12 gap-3 px-4 py-3 text-sm hover:bg-zinc-50"
            >
              <div className="col-span-4">
                <div className="font-medium">{o.id}</div>
                <div className="text-xs text-zinc-500">
                  {o.createdAt.toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="col-span-3 text-zinc-700">
                {o.customerName}
              </div>
              <div className="col-span-2">{formatBRLFromCents(o.totalCents)}</div>
              <div className="col-span-3 text-right">
                <Status status={o.status} />
              </div>
            </Link>
          ))}
          {orders.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-zinc-600">
              Nenhum pedido ainda.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const cls =
    status === "PAID"
      ? "bg-emerald-50 text-emerald-700"
      : status === "CANCELLED"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";
  const label =
    status === "PAID" ? "Pago" : status === "CANCELLED" ? "Cancelado" : "Pendente";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

