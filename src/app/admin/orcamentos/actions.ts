"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { QuoteStatus } from "@prisma/client";

export async function updateQuoteStatusAction(id: string, status: QuoteStatus) {
  await requireAdmin();
  await prisma.quoteRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orcamentos");
}

