import { prismadb } from "@/lib/prismadb";
import { Customer } from "@/core/model/Customer"; // Para garantir que o modelo Costumer seja acessível.
import { Decimal } from "@prisma/client/runtime/library";
import { Cart, CartItems } from "@/core/model/Cart";
import {} from "@prisma/client";
import { z } from "zod";
import { CartSchema } from "@/schemas";
import { getCartById } from "@/core/data/cart";
import { CartResponse } from "@/components/cart/CartTotal";

export default class RepositoryCart {
  // Método para salvar um pedido
  static async SaveCart(
    cart: z.infer<typeof CartSchema>,
  ): Promise<CartResponse> {
    const validatedFields = CartSchema.safeParse(cart);

    if (!validatedFields.success) {
      console.log("Erro de validação:", validatedFields.error);
      return { error: "Invalid cart data!" };
    }

    const { id, customerId, cartItems } = validatedFields.data;

    console.log("Cart Items:", cartItems);

    // Recalcula o total baseado nos itens
    const total = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    try {
      const existingCart = await prismadb.cart.findUnique({
        where: { id },
        include: { cartItems: true },
      });

      if (existingCart) {
        // Atualiza o carrinho com o novo total
        await prismadb.cart.update({
          where: { id },
          data: {
            customerId,
            total,
            cartItems: {
              upsert: cartItems.map((item) => ({
                where: { id: item.id },
                update: {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  discount: item.discount || null,
                },
                create: {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  discount: item.discount || null,
                },
              })),
            },
          },
        });
      } else {
        await prismadb.cart.create({
          data: {
            id,
            customerId,
            total,
            cartItems: {
              create: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount || null,
              })),
            },
          },
        });
      }

      return { success: "Carrinho salvo com sucesso!" };
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
      return { error: "Erro ao salvar carrinho!" };
    }
  }
  private static compareItems(existingItems: any[], newItems: any[]): boolean {
    if (existingItems.length !== newItems.length) return false;

    return existingItems.every((existingItem) =>
      newItems.some(
        (newItem) =>
          existingItem.productId === newItem.productId &&
          existingItem.quantity === newItem.quantity &&
          existingItem.price === newItem.price,
      ),
    );
  }

  // Método para buscar todos os pedidos
  static async getAllCarts(): Promise<Cart[]> {
    const carts = await prismadb.cart.findMany();
    //   include: {
    //     cartItems: true, // Inclui os itens do carrinho
    //     // customer: true
    //   },
    // });

    return carts.map(this.convertCart);
  }

  static async getCartById(id: string): Promise<Cart | null> {
    const cart = await prismadb.cart.findUnique({ where: { id } });
    return cart ? this.convertCart(cart) : null;
  }

  static async remove(id: string): Promise<void> {
    await prismadb.cart.delete({
      where: { id },
    });
  }

  private static convertCart(cart: any): Cart {
    return {
      ...cart,
      total: Number(cart.total),
      customerId: cart.customer?.id || "",
      cartItems: cart.cartItems?.map((item: any) => ({
        ...item,
        price: Number(item.price),
      })),
    };
  }
}
