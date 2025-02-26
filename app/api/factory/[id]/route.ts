import { prismadb } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  params: { params: Promise<{ id: string }> },
) => {
  const id = (await params.params).id;

  const factory = await prismadb.factory.findUnique({
    where: {
      id: id,
    },
  });

  return NextResponse.json({ factory });
};
