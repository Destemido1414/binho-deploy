import "server-only";

import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 chars"),
  DATABASE_URL: z.string().min(1),
  MERCADOPAGO_ACCESS_TOKEN: z.string().min(1),
  APP_URL: z.string().url(),
  MERCADOPAGO_TEST_ACCESS_TOKEN: z.string().optional(),
  MERCADOPAGO_PUBLIC_KEY: z.string().optional(),
  MERCADOPAGO_USER_ID: z.string().optional(),
});

export const env = envSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
  APP_URL: process.env.APP_URL,
  MERCADOPAGO_TEST_ACCESS_TOKEN: process.env.MERCADOPAGO_TEST_ACCESS_TOKEN,
  MERCADOPAGO_PUBLIC_KEY: process.env.MERCADOPAGO_PUBLIC_KEY,
  MERCADOPAGO_USER_ID: process.env.MERCADOPAGO_USER_ID,
});

