import { prisma } from "@/lib/prisma";
import { updateQuoteStatusAction } from "./actions";

export const runtime = "nodejs";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orçamentos</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Pedidos de orçamento enviados no site.
        </p>
      </div>

      <div className="grid gap-3">
        {quotes.map((q) => (
          <div key={q.id} className="rounded-2xl border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{q.name}</div>
                <div className="mt-1 text-sm text-zinc-600">
                  {q.email ? q.email : null}
                  {q.email && q.phone ? " • " : null}
                  {q.phone ? q.phone : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={q.status} />
                <div className="text-xs text-zinc-500">
                  {q.createdAt.toLocaleString("pt-BR")}
                </div>
              </div>
            </div>

            <div className="mt-3 whitespace-pre-wrap text-sm text-zinc-800">
              {q.message}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <form
                action={updateQuoteStatusAction.bind(null, q.id, "IN_PROGRESS")}
              >
                <button className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50">
                  Em andamento
                </button>
              </form>
              <form action={updateQuoteStatusAction.bind(null, q.id, "DONE")}>
                <button className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50">
                  Concluído
                </button>
              </form>
              <form
                action={updateQuoteStatusAction.bind(null, q.id, "ARCHIVED")}
              >
                <button className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50">
                  Arquivar
                </button>
              </form>
            </div>
          </div>
        ))}
        {quotes.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
            Nenhum orçamento ainda.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "NEW"
      ? "bg-blue-50 text-blue-700"
      : status === "IN_PROGRESS"
        ? "bg-amber-50 text-amber-700"
        : status === "DONE"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-zinc-100 text-zinc-700";
  const label =
    status === "NEW"
      ? "Novo"
      : status === "IN_PROGRESS"
        ? "Em andamento"
        : status === "DONE"
          ? "Concluído"
          : "Arquivado";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

