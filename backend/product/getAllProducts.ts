"use server";

import RepositoryProduct from "@/backend/product/RepositoryProduct";

export default async function getAllProducts() {
  return RepositoryProduct.getAllProducts();
}
