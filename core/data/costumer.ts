import { prismadb } from "@/lib/prismadb";

export const getCustomers = async () => {
  try {
    const customers = await prismadb.customer.findMany();

    // const data = JSON.parse(JSON.stringify(products));
    return customers;
  } catch {
    return null;
  }
};

export const getCustomerByCnpj = async (cnpj: string) => {
  try {
    const customer = await prismadb.customer.findUnique({
      where: { cnpj },
    });

    return customer;
  } catch {
    return null;
  }
};

export const getCustomerByName = async (name: string) => {
  try {
    const customer = await prismadb.customer.findMany({
      where: {
        name: {
          contains: name ?? "",
        },
      },
    });

    return customer;
  } catch {
    return null;
  }
};

export const getCustomerById = async (id: string) => {
  try {
    const customer = await prismadb.customer.findUnique({
      where: { id: id },
    });

    return customer;
  } catch {
    return null;
  }
};
