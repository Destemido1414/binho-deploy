import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mercadopago";
import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export const runtime = "nodejs";

type WebhookBody = {
  data?: { id?: string | number };
  data_id?: string | number;
  id?: string | number;
  resource?: string;
};

function pickPaymentId(req: Request, body: WebhookBody | null) {
  const url = new URL(req.url);
  const qp =
    url.searchParams.get("data.id") ||
    url.searchParams.get("id") ||
    url.searchParams.get("data_id");

  const bp =
    body?.data?.id ??
    body?.data_id ??
    body?.id ??
    (typeof body?.resource === "string"
      ? body.resource.split("/").pop()
      : undefined);

  const raw = qp ?? bp;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as WebhookBody | null;
  const paymentId = pickPaymentId(req, body);
  if (!paymentId) return NextResponse.json({ ok: true });

  const payment: PaymentResponse = await mpPayment().get({ id: paymentId });
  const orderId = payment.external_reference;
  const status = payment.status;

  if (!orderId || !status) return NextResponse.json({ ok: true });

  if (status === "approved") {
    await prisma.order.updateMany({
      where: { id: orderId, status: { not: "PAID" } },
      data: { status: "PAID", paymentId: String(paymentId) },
    });
  } else if (status === "cancelled" || status === "rejected") {
    await prisma.order.updateMany({
      where: { id: orderId, status: { not: "PAID" } },
      data: { status: "CANCELLED", paymentId: String(paymentId) },
    });
  }

  return NextResponse.json({ ok: true });
}

