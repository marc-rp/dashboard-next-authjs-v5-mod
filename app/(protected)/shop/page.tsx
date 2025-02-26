"use client";
import CardProduct from "@/components/product/CardProduct";
import ListProduct from "@/components/product/ListProduct";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CartContext from "@/contexts/CartContext";
import useCartContext from "@/hooks/cart/useCartContext";
import useProducts from "@/hooks/product/useProducts";
import { ShoppingBag } from "lucide-react";
import { useContext } from "react";

export default function Page() {
  const { add } = useCartContext();
  const { product, products, save, remove, updateProduct } = useProducts();
  return (
    <main className="sm:ml-14 p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Produtos</h1>
      <section className="grid grid-cols-1 lg:grid-cols-4 px-14 gap-4">
        {products?.map((product) => (
          <CardProduct key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
