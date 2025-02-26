"use client";

import React from "react";
import { Factory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { itemFactory } from "@/actions/factory/item/itemFactory";

// interface ProductProps {
//   id: number;
//   code: string;
//   name: string;
//   description: string;
//   image: string;
//   price: number;
// }

interface Props {
  factory: Factory;
}

export default function ItemPage({ factory }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await itemFactory({ params: Promise.resolve({ id }) });
    // const data: ResponseProps = await response.json();

    router.refresh();
  };

  return (
    <div className="border-2 border-black p-3 rounded-md">
      {/* <h2 className="mb-2">ID: {product.id}</h2> */}
      <h1 className="text-xl font-semibold">
        code: {factory.cnpj}
      </h1>
      <p>name: {factory.name}</p>
      <p>desc. {factory.city}</p>
      <p>price: {factory.state}</p>
      <div className="flex justify-end gap-3 mt-4 text-sm">
        <button
          className="font-semibold"
          onClick={() =>
            router.push(`/factory/update/${factory.id}`)
          }
        >
          Update
        </button>
        <button
          className="font-semibold text-red-500"
          onClick={() =>
            handleDelete(factory.id.toString())
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}
