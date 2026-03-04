import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Binho Motos | Peças e orçamentos",
  description:
    "Loja profissional de peças para motos com orçamento online e pagamento via PIX, débito e crédito pelo Mercado Pago.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-950`}
      >
        <SiteHeader />
        <div className="min-h-[calc(100vh-120px)]">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}

