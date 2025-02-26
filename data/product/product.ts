import { prismadb } from "@/lib/prismadb";
import { Product } from "@prisma/client";

export const getProducts = async () => {
  try {
    const products = await prismadb.product.findMany();

    const data = JSON.parse(JSON.stringify(products));
    return data;
  } catch {
    return null;
  }
};

export const getProductByCode = async (code: string) => {
  try {
    const product = await prismadb.product.findFirst({
      where: { code },
    });

    return product;
  } catch {
    return null;
  }
};

export const getProductByName = async (name: string) => {
  try {
    const product = await prismadb.product.findMany({
      where: {
        name: {
          contains: name ?? "",
        },
      },
    });

    return product;
  } catch {
    return null;
  }
};

export const getProductById = async (id: string) => {
  try {
    const product = await prismadb.product.findUnique({
      where: { id: id },
    });

    return product;
  } catch {
    return null;
  }
};
