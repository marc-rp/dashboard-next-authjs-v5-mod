import Backend from "@/backend/product";
import Product from "@/core/model/Product";
import { useEffect, useRef, useState } from "react";

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Partial<Product> | null>(null);
  // useRef para armazenar o valor atualizado de forma síncrona
  const productRef = useRef<Partial<Product> | null>(null);
  // Armazena o produto original para comparação
  const [originalProduct, setOriginalProduct] =
    useState<Partial<Product> | null>(null);

  useEffect(() => {
    Backend.products.getAll().then(setProducts);
  }, []);

  const updateProduct = (product: Partial<Product> | null) => {
    productRef.current = product;
    setProduct(product);
    // Armazena uma cópia do produto original (caso exista) para comparação
    setOriginalProduct(product ? { ...product } : null);
  };

  async function save() {
    const currentProduct = productRef.current;
    if (!currentProduct) {
      console.error("Product is null or undefined");
      return;
    }

    // Compara os objetos convertendo-os para JSON
    if (
      originalProduct &&
      JSON.stringify(currentProduct) === JSON.stringify(originalProduct)
    ) {
      console.log("Nenhuma alteração detectada. Envio cancelado.");
      return;
    }

    try {
      await Backend.products.save(currentProduct);
      const updatedProducts = await Backend.products.getAll();
      setProducts(updatedProducts);
      setProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }

  async function remove(id: string) {
    await Backend.products.remove(id);
    const updatedProducts = await Backend.products.getAll();
    setProducts(updatedProducts);
    // Se o produto atualmente selecionado for o que foi removido, limpa o estado
    if (productRef.current?.id === id) {
      productRef.current = null;
    }
  }

  // Função para remover vários produtos de uma vez
  async function groupRemove(ids: string[]) {
    await Backend.products.removeMany(ids);
    const updatedProducts = await Backend.products.getAll();
    setProducts(updatedProducts);
    // Se o produto atualmente selecionado estiver entre os removidos, limpe-o
    if (productRef.current && ids.includes(productRef.current.id as string)) {
      productRef.current = null;
      setProduct(null);
    }
  }

  // async function remove() {
  //   if (!product || !product.id) return;
  //   await Backend.products.remove(product.id);
  //   const products = await Backend.products.getAll();
  //   setProducts(products);
  //   setProduct(null);
  // }

  return {
    products,
    product,
    save,
    remove,
    groupRemove,
    cancel: () => setProduct(null),
    updateProduct,
  };
}
