"use client";
import ListProduct from "@/components/product/ListProduct";
import useProducts from "@/hooks/product/useProducts";
import { PlusIcon } from "lucide-react";

export default function Page() {
  const { product, products, save, updateProduct, remove, groupRemove } =
    useProducts();
  return (
    <div>
      <div className="flex justify-end">
        <button
          className="bg-blue-500 px-4 py-2 rounded-md"
          onClick={() => updateProduct({})}
        >
          <PlusIcon />
          <span>New Product</span>
        </button>
      </div>

      <ListProduct
        products={products}
        onClick={updateProduct}
        remove={remove}
        groupRemove={groupRemove}
      />
    </div>
  );
}
