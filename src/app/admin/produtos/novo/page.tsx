import Link from "next/link";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Novo produto</h1>
          <p className="mt-1 text-sm text-zinc-600">Cadastre um produto no site.</p>
        </div>
        <Link
          href="/admin/produtos"
          className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50"
        >
          Voltar
        </Link>
      </div>

      <ProductForm action={createProductAction} submitLabel="Cadastrar" />
    </div>
  );
}

function ProductForm({
  action,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome">
          <input
            name="name"
            required
            className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
            placeholder="Ex.: Pastilha de freio dianteira"
          />
        </Field>
        <Field label="Imagem (URL)">
          <input
            name="imageUrl"
            className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
            placeholder="https://..."
          />
        </Field>
        <Field label="Preço (R$)">
          <input
            name="price"
            required
            className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
            placeholder="199,90"
          />
        </Field>
        <Field label="Estoque">
          <input
            name="stock"
            required
            className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
            placeholder="10"
          />
        </Field>
      </div>

      <Field label="Descrição (opcional)">
        <textarea
          name="description"
          rows={5}
          className="w-full rounded-xl border px-3 py-2 outline-none focus:border-zinc-900"
          placeholder="Detalhes do produto, compatibilidade, etc."
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input name="isActive" type="checkbox" defaultChecked className="h-4 w-4" />
        <span>Ativo no site</span>
      </label>

      <div className="flex items-center justify-end">
        <button className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800">
          {submitLabel}
        </button>
      </div>
    </form>
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

