import { prismadb } from "@/lib/prismadb";
import { Cart } from "../model/Cart";

export const getCarts = async () => {
  try {
    const carts = await prismadb.cart.findMany();

    // const data = JSON.parse(JSON.stringify(products));
    return carts;
  } catch {
    return null;
  }
};

export const getCartById = async (id: string) => {
  try {
    const cart = await prismadb.cart.findUnique({
      where: { id: id },
      include: {
        cartItems: true,
      },
    });

    return cart;
  } catch {
    return null;
  }
};
