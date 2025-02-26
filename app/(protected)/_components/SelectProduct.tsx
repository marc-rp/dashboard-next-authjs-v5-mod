"use client";

type Product = {
  id: string;
  name: string;
};

import AsyncSelect from "react-select/async";

export const SelectProduct = () => {
  const loadOptions = async (query: string) => {
    const response = await fetch(`/api/product?name=${query}`).then(
      (response) => response.json()
    );

    const options = response.map((product: Product) => ({
      label: product.name,
      value: product.id,
    }));

    return options;
  };
  return <AsyncSelect loadOptions={loadOptions} />;
};
