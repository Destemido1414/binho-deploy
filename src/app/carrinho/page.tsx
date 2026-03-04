"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CartItem, clearCart, readCart, setQuantity } from "@/lib/cart";
import { formatBRLFromCents } from "@/lib/format";

type Customer = {
  name: string;
  email: string;
  phone: string;
  cep: string;
  address: string;
  city: string;
  state: string;
};

export default function CarrinhoPage() {
  const [items, setItems] = useState<CartItem[]>(() => readCart());
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingCents, setShippingCents] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [items],
  );

  const grandTotalCents = useMemo(
    () => totalCents + (shippingCents ?? 0),
    [totalCents, shippingCents],
  );

  async function calculateShipping() {
    setError(null);
    if (!customer.cep.trim()) {
      setError("Informe o CEP para calcular o frete.");
      return;
    }
    if (items.length === 0) return;

    setShippingLoading(true);
    setShippingCents(null);

    // peso simples: 1kg por item
    const totalWeightKg = items.reduce(
      (sum, i) => sum + i.quantity * 1,
      0,
    );

    const res = await fetch("/api/shipping/sedex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationCep: customer.cep.trim(),
        totalWeightKg,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      shippingCents?: number;
      error?: string;
    };

    setShippingLoading(false);

    if (!res.ok || !data.ok || typeof data.shippingCents !== "number") {
      setError(data.error || "Não foi possível calcular o frete.");
      return;
    }

    setShippingCents(data.shippingCents);
  }

  async function checkout() {
    setError(null);
    if (!customer.name.trim()) {
      setError("Informe seu nome para continuar.");
      return;
    }
    if (!customer.cep.trim()) {
      setError("Informe o CEP para continuar.");
      return;
    }
     if (shippingCents == null) {
       setError("Calcule o frete SEDEX antes de continuar.");
       return;
     }
    if (items.length === 0) return;

    setLoading(true);
    const res = await fetch("/api/checkout/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          cep: customer.cep.trim(),
          address: customer.address.trim(),
          city: customer.city.trim(),
          state: customer.state.trim(),
        },
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingCents,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      initPoint?: string;
    };
    setLoading(false);

    if (!res.ok || !data.initPoint) {
      setError(data.error || "Falha ao iniciar pagamento.");
      return;
    }

    // limpa carrinho local e redireciona para checkout Mercado Pago
    clearCart();
    window.location.href = data.initPoint;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Carrinho</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Revise seus itens e finalize com Mercado Pago.
          </p>
        </div>
        <Link href="/produtos" className="text-sm font-medium hover:underline">
          Continuar comprando
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <div className="rounded-2xl border bg-white">
          <div className="border-b px-5 py-4 text-sm font-semibold">Itens</div>
          <div className="divide-y">
            {items.map((i) => (
              <div key={i.productId} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{i.name}</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    {formatBRLFromCents(i.priceCents)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-9 w-9 rounded-xl border hover:bg-zinc-50"
                    onClick={() => {
                      const next = setQuantity(i.productId, i.quantity - 1);
                      setItems(next);
                    }}
                  >
                    -
                  </button>
                  <div className="w-10 text-center text-sm">{i.quantity}</div>
                  <button
                    className="h-9 w-9 rounded-xl border hover:bg-zinc-50"
                    onClick={() => {
                      const next = setQuantity(i.productId, i.quantity + 1);
                      setItems(next);
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="w-28 text-right text-sm font-semibold">
                  {formatBRLFromCents(i.priceCents * i.quantity)}
                </div>
              </div>
            ))}

            {items.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-zinc-600">
                Seu carrinho está vazio.
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5">
            <div className="text-sm font-semibold">Seus dados</div>
            <div className="mt-3 grid gap-3">
              <input
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="Nome completo"
                value={customer.name}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
              />
              <input
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="E-mail (opcional)"
                value={customer.email}
                onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
              />
              <input
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="Telefone (opcional)"
                value={customer.phone}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
              />
              <input
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="CEP"
                value={customer.cep}
                onChange={(e) => setCustomer((c) => ({ ...c, cep: e.target.value }))}
              />
              <input
                className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                placeholder="Endereço (rua, número, complemento)"
                value={customer.address}
                onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                  placeholder="Cidade"
                  value={customer.city}
                  onChange={(e) => setCustomer((c) => ({ ...c, city: e.target.value }))}
                />
                <input
                  className="h-11 w-full rounded-xl border px-3 outline-none focus:border-zinc-900"
                  placeholder="UF"
                  value={customer.state}
                  onChange={(e) => setCustomer((c) => ({ ...c, state: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-medium">
                  {formatBRLFromCents(totalCents)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Frete (SEDEX)</span>
                <div className="text-right">
                  {shippingLoading ? (
                    <span>Calculando...</span>
                  ) : shippingCents != null ? (
                    <span className="font-medium">
                      {formatBRLFromCents(shippingCents)}
                    </span>
                  ) : (
                    <span className="text-zinc-500">Informe o CEP</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={calculateShipping}
                disabled={shippingLoading || items.length === 0}
                className="mt-1 h-9 w-full rounded-xl border text-xs font-medium hover:bg-zinc-50 disabled:opacity-60"
              >
                {shippingLoading ? "Calculando..." : "Calcular frete SEDEX"}
              </button>
              <div className="mt-2 flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-zinc-800">Total com frete</span>
                <span className="text-lg font-semibold">
                  {formatBRLFromCents(grandTotalCents)}
                </span>
              </div>
            </div>
            <button
              disabled={loading || items.length === 0}
              onClick={checkout}
              className="mt-4 h-11 w-full rounded-xl bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Iniciando..." : "Pagar com Mercado Pago"}
            </button>
            <div className="mt-2 text-xs text-zinc-500">
              Você poderá escolher Pix, débito ou crédito no checkout.
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
