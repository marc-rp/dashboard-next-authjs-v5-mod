import { Decimal } from "@prisma/client/runtime/library";
import Product from "./Product"; // Adjust the import path as necessary
import { Customer } from "./Customer";

export interface Cart {
  id: string;
  customerId: string;
  customer?: Customer;
  total: number;
  cartItems: CartItems[];
}

export interface CartItems {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  price: number;
  quantity: number;
  discount?: string; // Adicione esta linha
}
