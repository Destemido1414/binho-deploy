"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = useMemo(() => sp.get("next") || "/admin", [sp]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", { method: "POST", body: fd });
    const data = (await res.json().catch(() => ({}))) as { error?: string };

    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Falha ao entrar");
      return;
    }

    router.replace(next);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <div className="w-full rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Painel do Administrador</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Entre com seu e-mail e senha.
          </p>

          <form className="mt-6 space-y-3" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium">E-mail</label>
              <input
                name="email"
                type="email"
                required
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="admin@exemplo.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Senha</label>
              <input
                name="password"
                type="password"
                required
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="h-11 w-full rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

