import { prismadb } from "@/lib/prismadb";
import Image from "next/image";
import { notFound } from "next/navigation";

// Define o tempo de revalidação (em segundos) para o ISR (Incremental Static Regeneration)
export const revalidate = 60;

async function getProduct(id: string) {
  try {
    return await prismadb.product.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw error;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [{ url: product.image }] : [],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="mt-2 text-gray-600">{product.description}</p>

      {product.image && (
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={400}
          className="mt-4 w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md"
        />
      )}

      <p className="mt-4 text-xl font-semibold">
        Preço: R$ {Number(product.price).toFixed(2)}
      </p>
    </div>
  );
}
