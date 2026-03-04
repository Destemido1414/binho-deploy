"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slug";

function parsePriceToCents(input: string) {
  const normalized = input
    .trim()
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  const num = Number(normalized);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.round(num * 100);
}

const baseSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  price: z.string().min(1),
  stock: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.string().optional(),
});

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const data = baseSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
    isActive: formData.get("isActive"),
  });

  const priceCents = parsePriceToCents(data.price);
  const stock = Number(String(data.stock).replace(/[^\d-]/g, ""));
  if (priceCents == null || !Number.isFinite(stock) || stock < 0) {
    throw new Error("Invalid price or stock");
  }

  const baseSlug = slugify(data.name);
  const slug = baseSlug ? `${baseSlug}-${Date.now().toString(36)}` : Date.now().toString(36);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      priceCents,
      stock,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect(`/admin/produtos/${product.id}`);
}

export async function updateProductAction(productId: string, formData: FormData) {
  await requireAdmin();

  const data = baseSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
    isActive: formData.get("isActive"),
  });

  const priceCents = parsePriceToCents(data.price);
  const stock = Number(String(data.stock).replace(/[^\d-]/g, ""));
  if (priceCents == null || !Number.isFinite(stock) || stock < 0) {
    throw new Error("Invalid price or stock");
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      description: data.description || null,
      priceCents,
      stock,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive === "on",
    },
  });

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect(`/admin/produtos/${productId}`);
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect("/admin/produtos");
}

