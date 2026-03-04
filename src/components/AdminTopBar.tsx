"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/orcamentos", label: "Orçamentos" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export function AdminTopBar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/admin" className="font-semibold tracking-tight">
          Admin • Binho Motos
        </Link>
        <nav className="hidden gap-4 md:flex">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={[
                "text-sm",
                pathname === i.href ? "font-semibold text-zinc-900" : "text-zinc-600 hover:text-zinc-900",
              ].join(" ")}
            >
              {i.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50"
        >
          Sair
        </button>
      </div>
    </header>
  );
}

