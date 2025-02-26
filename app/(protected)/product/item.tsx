"use client";

import React from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { itemProduct } from "@/actions/product/item/itemProduct";

// interface ProductProps {
//   id: number;
//   code: string;
//   name: string;
//   description: string;
//   image: string;
//   price: number;
// }

interface Props {
  product: Product;
}

export default function ItemPage({ product }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await itemProduct({ params: Promise.resolve({ id }) });
    // const data: ResponseProps = await response.json();

    router.refresh();
  };

  return (
    <div className="border-2 border-black p-3 rounded-md">
      {/* <h2 className="mb-2">ID: {product.id}</h2> */}
      <h1 className="text-xl font-semibold">code: {product.code}</h1>
      <p>name: {product.name}</p>
      <p>desc. {product.description}</p>
      <p>price: {product.price.toString()}</p>
      <div className="flex justify-end gap-3 mt-4 text-sm">
        <button
          className="font-semibold"
          onClick={() => router.push(`/product/update/${product.id}`)}
        >
          Update
        </button>
        <button
          className="font-semibold text-red-500"
          onClick={() => handleDelete(product.id.toString())}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
