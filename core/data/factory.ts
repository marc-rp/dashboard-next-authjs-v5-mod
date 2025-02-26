import { prismadb } from "@/lib/prismadb";

export const getFactories = async () => {
  try {
    const factories = await prismadb.factory.findMany();

    // const data = JSON.parse(JSON.stringify(products));
    return factories;
  } catch {
    return null;
  }
};

export const getFactoryByCnpj = async (cnpj: string) => {
  try {
    const factory = await prismadb.factory.findUnique({
      where: { cnpj },
    });

    return factory;
  } catch {
    return null;
  }
};

export const getFactoryByName = async (name: string) => {
  try {
    const factory = await prismadb.factory.findMany({
      where: {
        name: {
          contains: name ?? "",
        },
      },
    });

    return factory;
  } catch {
    return null;
  }
};

export const getFactoryById = async (id: string) => {
  try {
    const factory = await prismadb.factory.findUnique({
      where: { id: id },
    });

    return factory;
  } catch {
    return null;
  }
};
