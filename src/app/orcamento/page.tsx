"use client";

import Link from "next/link";
import { useState } from "react";

export default function OrcamentoPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/quote", { method: "POST", body: fd });
    const data = (await res.json().catch(() => ({}))) as { error?: string };

    if (!res.ok) {
      setStatus("error");
      setError(data.error || "Falha ao enviar");
      return;
    }

    setStatus("done");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Orçamento</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Envie o modelo da moto e as peças que você precisa. Retornamos com valores
        e prazos.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[2fr,1.2fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border bg-white p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Seu nome">
              <input
                name="name"
                required
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="Seu nome"
              />
            </Field>
            <Field label="Telefone / WhatsApp (opcional)">
              <input
                name="phone"
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="(xx) xxxxx-xxxx"
              />
            </Field>
            <Field label="E-mail (opcional)">
              <input
                name="email"
                type="email"
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="voce@exemplo.com"
              />
            </Field>
          </div>

          <Field label="Mensagem">
            <textarea
              name="message"
              rows={6}
              required
              className="w-full rounded-xl border px-3 py-2 outline-none focus:border-zinc-900"
              placeholder="Ex.: Honda CG 160 Fan 2024 — preciso de pastilha de freio dianteira + relação + óleo..."
            />
          </Field>

          {status === "done" ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Enviado com sucesso! Vamos retornar em breve.
            </div>
          ) : null}
          {status === "error" && error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            disabled={status === "loading"}
            className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {status === "loading" ? "Enviando..." : "Enviar orçamento"}
          </button>
        </form>

        <aside className="space-y-3 rounded-2xl border bg-white p-5 text-sm text-zinc-700">
          <div className="text-sm font-semibold text-zinc-900">
            Dúvidas ou suporte imediato
          </div>
          <p>
            Fale diretamente com a loja pelo WhatsApp para tirar dúvidas rápidas
            sobre peças, disponibilidade e prazos.
          </p>
          <Link
            href="https://wa.me/5513996149427"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <span>Chamar no WhatsApp</span>
            <span className="font-mono text-xs">+55 13 99614-9427</span>
          </Link>
          <div className="pt-2 text-xs text-zinc-500">
            Endereço: Rua 8, nº 84 – Jardim Vicente de Carvalho 2, Bertioga – São
            Paulo.
          </div>
        </aside>
      </div>
    </main>
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

