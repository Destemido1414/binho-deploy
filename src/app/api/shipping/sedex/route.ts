import { NextResponse } from "next/server";
import { z } from "zod";
import { calcularPrecoPrazo } from "correios-brasil";

export const runtime = "nodejs";

const schema = z.object({
  destinationCep: z.string().min(8).max(9),
  totalWeightKg: z.number().positive(),
});

const ORIGIN_CEP = "11250-426";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const nVlPeso = parsed.data.totalWeightKg.toFixed(2);

  const args = {
    sCepOrigem: ORIGIN_CEP.replace(/\D/g, ""),
    sCepDestino: parsed.data.destinationCep.replace(/\D/g, ""),
    nVlPeso,
    nCdFormato: "1",
    nVlComprimento: "20",
    nVlAltura: "20",
    nVlLargura: "20",
    nCdServico: ["04014"], // SEDEX
    nVlDiametro: "0",
  };

  try {
    const response = (await calcularPrecoPrazo(args)) as Array<{
      Valor: string;
      PrazoEntrega: string;
      Erro: string;
      MsgErro: string;
    }>;

    const sedex = response[0];

    if (!sedex || sedex.Erro !== "0") {
      return NextResponse.json(
        {
          error:
            sedex && sedex.MsgErro
              ? sedex.MsgErro
              : "Não foi possível calcular o frete SEDEX.",
        },
        { status: 502 },
      );
    }

    const valorBRL = Number(
      sedex.Valor.replace(".", "").replace(",", "."),
    );

    if (!Number.isFinite(valorBRL)) {
      return NextResponse.json(
        { error: "Valor de frete inválido retornado pelos Correios." },
        { status: 502 },
      );
    }

    const shippingCents = Math.round(valorBRL * 100);

    return NextResponse.json({
      ok: true,
      service: "SEDEX",
      shippingCents,
      prazoEntregaDias: Number(sedex.PrazoEntrega) || null,
    });
  } catch (err) {
    console.error("Erro ao calcular frete SEDEX", err);
    return NextResponse.json(
      { error: "Falha ao calcular frete SEDEX." },
      { status: 500 },
    );
  }
}

