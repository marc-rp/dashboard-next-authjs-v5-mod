import { getProducts } from "@/data/product/product";

// interface ProductProps {
//   id: number;
//   code: string;
//   name: string;
//   description: string;
//   image: string;
//   price: number;
// }

// interface ResponseProps {
//   products: ProductProps[];
// }

const fetchProducts = async () => {
  // Because this is server components, we have to define the URL with http
  // const response = await fetch("http://localhost:3000/api/product", {
  //   next: { revalidate: 0 },
  // });
  // // Define the output to json, because if only res, it will return by any type
  // // const data: ResponseProps = await response.json();
  // // console.log(data);
  // const data = await response.json();
  // return data;
};

const listProduct = async () => {
  const products = await getProducts();
  return products;
};
export default listProduct;
