export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600">
        <div className="font-medium text-zinc-900">Binho Motos</div>
        <div className="mt-1">
          Peças e acessórios • Pagamento via Pix, débito e crédito (Mercado Pago)
        </div>
        <div className="mt-3 text-xs text-zinc-500">
          © {new Date().getFullYear()} Binho Motos • Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

