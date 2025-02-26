"use server";

import RepositoryCart from "@/backend/cart/RepositoryCart";
import { Cart } from "@/core/model/Cart";
import Id from "@/core/utils/id";

export default async function SaveCartState(cart: Cart) {
  // Validar dados com Zod
  const newCart = {
    // ...cart,
    id: cart?.id ?? Id.new,
    customerId: cart.customerId, // Garante string vazia se undefined
    total: cart.total,
    cartItems: cart.cartItems?.map((item) => ({
      // ...item,
      id: item.id || Id.new, // Garante IDs para novos itens
      cartId: item.cartId,
      productId: item.product.id,
      product: item.product,
      quantity: item.quantity, // Conversão explícita
      price: Number(item.product.price),
      discount: item.discount,
    })),
  };

  return RepositoryCart.SaveCart(newCart as Cart);
}
