"use client";
import useCartContext from "@/hooks/cart/useCartContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Cart() {
  const { quantityItems } = useCartContext();
  return (
    <Link
      href="/cart"
      className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full"
    >
      <div className="relative">
        <ShoppingCart className="h-4 w-4" />
        <span className="sr-only">Cart</span>
        <div className="absolute -top-3.5 -right-3.5 w-6 h-6 bg-red-500 rounded-full flex justify-center items-center text-xs">
          {quantityItems}
        </div>
      </div>
    </Link>
  );
}
