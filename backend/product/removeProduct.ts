"use server";

import RepositoryProduct from "./RepositoryProduct";

export default async function removeProduct(id: string) {
  return RepositoryProduct.remove(id);
}
