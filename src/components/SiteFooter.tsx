import Link from "next/link";

const WHATSAPP_NUMBER = "+5513996149427";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

export function SiteFooter() {
  return (
    <footer className="border-t bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="font-semibold text-zinc-800">Moto Peças Binho</div>
          <div>
            Rua 8, nº 84 – Jardim Vicente de Carvalho 2
          </div>
          <div>Bertioga – São Paulo</div>
        </div>

        <div className="space-y-1 text-sm">
          <div className="font-medium text-zinc-800">Suporte e vendas</div>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <span>WhatsApp</span>
            <span className="font-mono text-xs">+55 13 99614-9427</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

