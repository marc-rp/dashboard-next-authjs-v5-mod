"use server";

import RepositoryProduct from "@/backend/product/RepositoryProduct";

export default async function removeProducts(ids: string[]) {
  return RepositoryProduct.removeMany(ids);
}
