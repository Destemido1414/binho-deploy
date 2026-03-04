import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { mpPreference } from "@/lib/mercadopago";
import type { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";

export const runtime = "nodejs";

const schema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    cep: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    state: z.string().optional().or(z.literal("")),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1),
  shippingCents: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  const byId = new Map(products.map((p) => [p.id, p]));
  const resolved = parsed.data.items
    .map((i) => {
      const p = byId.get(i.productId);
      if (!p) return null;
      return { p, quantity: i.quantity };
    })
    .filter(Boolean) as Array<{ p: (typeof products)[number]; quantity: number }>;

  if (resolved.length !== parsed.data.items.length) {
    return NextResponse.json(
      { error: "Um ou mais produtos não estão disponíveis" },
      { status: 400 },
    );
  }

  const productsTotalCents = resolved.reduce(
    (sum, { p, quantity }) => sum + p.priceCents * quantity,
    0,
  );
  const shippingCents = parsed.data.shippingCents ?? 0;
  const totalCents = productsTotalCents + shippingCents;

  const order = await prisma.order.create({
    data: {
      status: "PENDING_PAYMENT",
      customerName: parsed.data.customer.name,
      customerEmail: parsed.data.customer.email || null,
      customerPhone: parsed.data.customer.phone || null,
      totalCents,
      customerCep: parsed.data.customer.cep || null,
      customerAddress: parsed.data.customer.address || null,
      customerCity: parsed.data.customer.city || null,
      customerState: parsed.data.customer.state || null,
      paymentProvider: "mercadopago",
      items: {
        create: resolved.map(({ p, quantity }) => ({
          productId: p.id,
          name: p.name,
          unitPriceCents: p.priceCents,
          quantity,
          lineTotalCents: p.priceCents * quantity,
        })),
      },
    },
  });

  const mpItems: PreferenceResponse["items"] = resolved.map(
    ({ p, quantity }) => ({
      id: p.id,
      title: p.name,
      quantity,
      unit_price: p.priceCents / 100,
      currency_id: "BRL",
    }),
  );

  if (shippingCents > 0) {
    mpItems.push({
      id: "shipping-sedex",
      title: "Frete SEDEX",
      quantity: 1,
      unit_price: shippingCents / 100,
      currency_id: "BRL",
    });
  }

  const pref: PreferenceResponse = await mpPreference().create({
    body: {
      external_reference: order.id,
      items: mpItems,
      payer: {
        name: parsed.data.customer.name,
        email: parsed.data.customer.email || undefined,
      },
      back_urls: {
        success: `${env.APP_URL}/pedido/${order.id}?r=success`,
        pending: `${env.APP_URL}/pedido/${order.id}?r=pending`,
        failure: `${env.APP_URL}/pedido/${order.id}?r=failure`,
      },
      auto_return: "approved",
      notification_url: `${env.APP_URL}/api/mercadopago/webhook`,
    },
  });

  const preferenceId = pref.id;
  const initPoint = pref.init_point ?? pref.sandbox_init_point;

  if (!initPoint) {
    return NextResponse.json(
      { error: "Falha ao iniciar pagamento" },
      { status: 502 },
    );
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { mpPreferenceId: preferenceId ?? null },
  });

  return NextResponse.json({ ok: true, orderId: order.id, initPoint });
}

