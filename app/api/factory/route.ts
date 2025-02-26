import { prismadb } from "@/lib/prismadb";
import { FactorySchema } from "@/schemas";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Action to read
export async function GET() {
  const factories = await prismadb.factory.findMany({});

  return NextResponse.json({
    factories,
  });
}

// Action to create
export const POST = async (request: NextRequest) => {
  try {
    const { cnpj, name, address, city, state } = await request.json();
    // In a production setting you'd want to validate the incoming data here

    const factory = await prismadb.factory.create({
      data: {
        cnpj: cnpj,
        name: name,
        address: address,
        city: city,
        state: state,
      },
    });
    return NextResponse.json(factory);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error creating product." },
      { status: 500 },
    );
  }
};

// Action to delete
export const DELETE = async (request: NextRequest) => {
  const url = new URL(request.url).searchParams;
  const id = url.get("id") || "";

  const factory = await prismadb.factory.delete({
    where: {
      id: id,
    },
  });

  if (!factory) {
    return NextResponse.json(
      {
        message: "Error",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({});
};

// Action to update or edit
export const PUT = async (
  request: NextRequest,
  values: z.infer<typeof FactorySchema>,
) => {
  const { cnpj, name, address, city, state, id } = await request.json();

  const factory = await prismadb.factory.update({
    where: {
      id: id,
    },

    data: {
      ...values,
    },
  });

  return NextResponse.json({
    factory,
  });
};
