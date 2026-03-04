import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight text-zinc-900">
          Binho Motos
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-700">
          <Link className="hover:text-zinc-900" href="/produtos">
            Produtos
          </Link>
          <Link className="hover:text-zinc-900" href="/orcamento">
            Orçamento
          </Link>
          <Link className="hover:text-zinc-900" href="/carrinho">
            Carrinho
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

