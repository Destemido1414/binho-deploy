import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const form = await req.formData();
  const parsed = schema.safeParse({
    name: String(form.get("name") ?? "").trim(),
    phone: String(form.get("phone") ?? "").trim() || undefined,
    email: String(form.get("email") ?? "").trim(),
    message: String(form.get("message") ?? "").trim(),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  await prisma.quoteRequest.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      email: parsed.data.email || null,
      message: parsed.data.message,
    },
  });

  return NextResponse.json({ ok: true });
}

