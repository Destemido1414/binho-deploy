export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600">
        <div className="font-medium text-zinc-900">Binho Motos</div>
        <div className="mt-1">
          Peças e acessórios • Pagamento via Pix, débito e crédito (Mercado Pago)
  
        </div>
        <div className="mt-3">
📍 Endereço: Rua 8 nº 84 – Bairro Jardim Vicente de Carvalho 2
<br/>
Bertioga – São Paulo
</div>

<div className="mt-2">
📞 WhatsApp:
<a
href="https://wa.me/5513996149427"
target="_blank"
className="ml-1 text-green-600 font-medium"
>
+55 13 99614-9427
</a>
</div>
        <div className="mt-3 text-xs text-zinc-500">
          © {new Date().getFullYear()} Binho Motos • Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

