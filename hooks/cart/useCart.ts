import Backend from "@/backend/cart";
import { Cart } from "@/core/model/Cart";
import { useEffect, useState } from "react";

export default function useCart() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    Backend.carts.getAll().then(setCarts);
  }, []);

  async function save() {
    if (!carts) {
      console.error("Cart is null or undefined");
      return;
    }
    try {
      // await Backend.carts.save(cartData);
      const updatedCarts = await Backend.carts.getAll();
      setCarts(updatedCarts);
      setCart(null);
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }

  async function remove() {
    if (!cart || !cart.id) return;
    await Backend.carts.remove(cart.id);
    const carts = await Backend.carts.getAll();
    setCarts(carts);
    setCart(null);
  }

  return {
    carts,
    cart,
    save,
    remove,
    cancel: () => setCart(null),
    updateCart: (cart: Cart | null) => setCart(cart),
  };
}
