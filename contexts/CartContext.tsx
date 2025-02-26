"use client";
import { createContext, useState } from "react";
import { CartItems } from "@/core/model/Cart";
import Product from "@/core/model/Product";
import useLocalStorage from "@/hooks/cart/useLocalStorage";

interface CartContextProps {
  cartItems: CartItems[];
  quantityItems: number;
  add: (product: Product) => void;
  sub: (product: Product) => void;
  update: (product: Product, quantity: number, discount: string) => void;
  // updateDiscount: (
  //   product: Product,
  //   quantity: number,
  //   discount: string,
  // ) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextProps>({} as CartContextProps);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const { set, get } = useLocalStorage();

  // Opcional: carregar o carrinho do localStorage na montagem
  // useEffect(() => {
  //   const storedCart = get("cart");
  //   if (storedCart) {
  //     setCartItems(storedCart);
  //   }
  // }, [get]);

  const changeItems = (newItems: CartItems[]) => {
    setCartItems(newItems);
    set("cart", newItems);
  };

  const add = (product: Product) => {
    const index = cartItems.findIndex((i) => i.product.id === product.id);
    if (index === -1) {
      changeItems([
        ...cartItems,
        {
          id: crypto.randomUUID(),
          cartId: "",
          productId: "",
          product,
          quantity: 1,
          price: Number(product.price),
          discount: "", // novo campo para desconto
        },
      ]);
    } else {
      const newItems = [...cartItems];
      newItems[index].quantity++;
      changeItems(newItems);
    }
  };

  const sub = (product: Product) => {
    const newItems = cartItems
      .map((item) => {
        if (item.product.id === product.id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    changeItems(newItems);
  };

  const update = (product: Product, quantity: number, discount: string) => {
    const newItems = cartItems
      .map((item) => {
        if (item.product.id === product.id) {
          return { ...item, quantity, discount };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    changeItems(newItems);
  };

  // const updateDiscount = (
  //   product: Product,
  //   quantity: number,
  //   discount: string,
  // ) => {
  //   const newItems = cartItems.map((item) => {
  //     if (item.product.id === product.id) {
  //       return { ...item, quantity, discount };
  //     }
  //     return item;
  //   });
  //   changeItems(newItems);
  // };

  const clear = () => {
    changeItems([]);
  };

  const quantityItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        quantityItems,
        add,
        sub,
        update,
        // updateDiscount,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
