import { prismadb } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

// GET: Obtém um product pelo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  console.log("🛠 ID recebido na API:", params?.id);

  if (!params?.id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  const product = await prismadb.product.findUnique({
    where: { id: params.id },
  });
  if (!product)
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 },
    );
  return NextResponse.json(product);
}

// PUT: Atualiza um product pelo ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { code, name, description, image, price } = await req.json();
    const product = await prismadb.product.update({
      where: { id: params.id },
      data: { code, name, description, image, price },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 },
    );
  }
}

// DELETE: Remove um product pelo ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prismadb.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar produto" },
      { status: 500 },
    );
  }
}
