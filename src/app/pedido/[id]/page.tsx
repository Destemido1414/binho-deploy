import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBRLFromCents } from "@/lib/format";

export const runtime = "nodejs";

export default async function PedidoPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Promise<{ r?: string }>;
}) {
  const sp = await searchParams;
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return notFound();

  const statusLabel =
    order.status === "PAID"
      ? "Pago"
      : order.status === "CANCELLED"
        ? "Cancelado"
        : "Pendente";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pedido</h1>
          <p className="mt-1 text-sm text-zinc-600">
            ID: <span className="font-mono">{order.id}</span>
          </p>
        </div>
        <span
          className={[
            "inline-flex rounded-full px-3 py-1 text-sm font-medium",
            order.status === "PAID"
              ? "bg-emerald-50 text-emerald-700"
              : order.status === "CANCELLED"
                ? "bg-red-50 text-red-700"
                : "bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          {statusLabel}
        </span>
      </div>

      {sp.r ? (
        <div className="mt-5 rounded-2xl border bg-white p-5 text-sm text-zinc-700">
          Resultado do checkout: <span className="font-medium">{sp.r}</span>. Se
          você concluiu o pagamento, o status pode levar alguns segundos para
          atualizar.
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border bg-white">
        <div className="border-b px-5 py-4 text-sm font-semibold">Itens</div>
        <div className="divide-y">
          {order.items.map((i) => (
            <div key={i.id} className="flex items-center justify-between px-5 py-4 text-sm">
              <div className="min-w-0">
                <div className="truncate font-medium">{i.name}</div>
                <div className="mt-1 text-xs text-zinc-600">
                  {i.quantity} × {formatBRLFromCents(i.unitPriceCents)}
                </div>
              </div>
              <div className="font-semibold">
                {formatBRLFromCents(i.lineTotalCents)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t px-5 py-4 text-sm">
          <span className="text-zinc-600">Total</span>
          <span className="text-lg font-semibold">
            {formatBRLFromCents(order.totalCents)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/produtos"
          className="rounded-xl border bg-white px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Voltar para produtos
        </Link>
        <Link
          href="/orcamento"
          className="rounded-xl border bg-white px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Pedir orçamento
        </Link>
      </div>
    </main>
  );
}

