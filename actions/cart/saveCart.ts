"use server";

import { CartSchema } from "@/schemas";
import { prismadb } from "@/lib/prismadb";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

export const saveCart = async (values: z.infer<typeof CartSchema>) => {
  const validatedFields = CartSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid cart data!" };
  }

  const { id, customerId, total, cartItems } = validatedFields.data;

  try {
    await prismadb.$transaction(async (tx) => {
      // Salva o carrinho
      const cart = await tx.cart.upsert({
        where: { id },
        update: { total: new Decimal(total), customerId },
        create: {
          id,
          customerId,
          total: new Decimal(total),
        },
      });

      // Remove itens antigos
      await tx.cartItems.deleteMany({
        where: { cartId: id },
      });

      // 3. Validar e criar novos itens
      for (const item of cartItems) {
        // Verificar se o produto existe
        const productExists = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!productExists) {
          throw new Error(`Produto ${item.productId} não encontrado`);
        }

        // Criar item do carrinho
        await tx.cartItems.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
            price: new Decimal(item.price), // Usar o preço do item validado
          },
        });
      }
    });

    return { success: "Cart saved successfully!" };
  } catch (error) {
    console.error("Erro detalhado:", error);
    return { error: "Failed to save cart!" };
  }
};
