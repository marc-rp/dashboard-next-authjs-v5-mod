"use server";
import { prismadb } from "@/lib/prismadb";

export const itemProduct = async (params: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params.params).id;

  await prismadb.product.delete({
    where: { id: id },
  });

  return { success: "Product Deleted!" };
};
