"use client";

import CartEmpty from "@/components/cart/CartEmpty";
import CartItembox from "@/components/cart/CartItemBox";
import CartTotal from "@/components/cart/CartTotal";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/cart/useCart";
import useCartContext from "@/hooks/cart/useCartContext";
import useCustomers from "@/hooks/customer/useCustomer";

export default function Page() {
  const { customers, save } = useCustomers();
  const { cart } = useCart();
  const { cartItems, add, sub, update, clear } = useCartContext();

  return (
    <main className="sm:ml-14 p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Produtos</h1>
      {cartItems.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          <section className="flex flex-col px-14 gap-4">
            {cartItems?.map((item) => (
              <CartItembox
                key={item.product.id}
                item={item}
                add={(item) => add(item.product)}
                sub={(item) => sub(item.product)}
                update={(item, quantity) => update(item.product, quantity)} // Adicionado
              />
            ))}
            <CartTotal
              cartItems={cartItems}
              cart={cart}
              customers={customers}
              onSuccess={(message) => console.log(message)}
              onError={(message) => console.error(message)}
              save={save}
            />
            <div className="flex justify-end">
              <Button onClick={() => clear()}>Limpar Carrinho</Button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
