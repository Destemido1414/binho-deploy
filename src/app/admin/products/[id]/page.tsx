 import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";
import ProductForm from "../product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-8 text-neutral-50">
      <main className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <h1 className="text-xl font-semibold">Editar produto</h1>
          <p className="text-sm text-neutral-400">
            Atualize as informações da peça selecionada.
          </p>
        </header>
        <ProductForm product={product} />
      </main>
    </div>
  );
}

