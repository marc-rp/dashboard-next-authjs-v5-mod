"use server";

import RepositoryCart from "@/backend/cart/RepositoryCart";

export default async function getAllCarts() {
  return RepositoryCart.getAllCarts();
}
