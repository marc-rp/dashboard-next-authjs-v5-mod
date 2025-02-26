import { prismadb } from "@/lib/prismadb";

import { NextRequest, NextResponse } from "next/server";

// GET: Lista todos os produtos
export async function GET() {
  const products = await prismadb.product.findMany();
  return NextResponse.json(products);
}

// POST: Cria um novo produto
export async function POST(req: Request) {
  try {
    const { code, name, description, image, price } = await req.json();
    const user = await prismadb.product.create({
      data: { code, name, description, image, price },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 },
    );
  }
}
