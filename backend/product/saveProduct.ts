"use server";

import Product from "@/core/model/Product";
import Id from "@/core/utils/id";
import RepositoryProduct from "./RepositoryProduct";

export default async function SaveProductState(product: Partial<Product>) {
  const newProduct = {
    ...product,
    id: product.id ?? Id.new,
  };

  return RepositoryProduct.SaveProduct(newProduct as Product);
}
