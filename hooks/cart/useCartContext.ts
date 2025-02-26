"use client";
import CartContext from "@/contexts/CartContext";
import { useContext } from "react";

const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
export default useCartContext;
