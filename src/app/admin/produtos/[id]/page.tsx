import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteProductAction, updateProductAction } from "../actions";
import { formatBRLFromCents } from "@/lib/format";

export const runtime = "nodejs";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound();

  const update = updateProductAction.bind(null, product.id);
  const del = deleteProductAction.bind(null, product.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Editar produto</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {product.slug} • {formatBRLFromCents(product.priceCents)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/produtos"
            className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50"
          >
            Voltar
          </Link>
          <form action={del}>
            <button className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">
              Excluir
            </button>
          </form>
        </div>
      </div>

      <form action={update} className="space-y-4 rounded-2xl border bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome">
            <input
              name="name"
              required
              defaultValue={product.name}
              className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
            />
          </Field>
          <Field label="Imagem (URL)">
            <input
              name="imageUrl"
              defaultValue={product.imageUrl ?? ""}
              className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
              placeholder="https://..."
            />
          </Field>
          <Field label="Preço (R$)">
            <input
              name="price"
              required
              defaultValue={(product.priceCents / 100).toFixed(2).replace(".", ",")}
              className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
            />
          </Field>
          <Field label="Estoque">
            <input
              name="stock"
              required
              defaultValue={String(product.stock)}
              className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
            />
          </Field>
        </div>

        <Field label="Descrição (opcional)">
          <textarea
            name="description"
            rows={6}
            defaultValue={product.description ?? ""}
            className="w-full rounded-xl border px-3 py-2 outline-none focus:border-zinc-900"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={product.isActive}
            className="h-4 w-4"
          />
          <span>Ativo no site</span>
        </label>

        <div className="flex items-center justify-end">
          <button className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{label}</div>
      {children}
    </div>
  );
}

