import { prismadb } from "@/lib/prismadb";

export const getProducts = async () => {
  try {
    const products = await prismadb.product.findMany();

    // const data = JSON.parse(JSON.stringify(products));
    return products;
  } catch {
    return null;
  }
};

export const getProductByCode = async (code: string) => {
  try {
    const product = await prismadb.product.findUnique({
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
      where: { id },
    });

    return product;
  } catch {
    return null;
  }
};
