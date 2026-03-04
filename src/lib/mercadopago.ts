import "server-only";

import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { env } from "@/lib/env";

export function mpClient() {
  return new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
}

export function mpPreference() {
  return new Preference(mpClient());
}

export function mpPayment() {
  return new Payment(mpClient());
}

