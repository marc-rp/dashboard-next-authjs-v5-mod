import Backend from "@/backend/product";
import Product from "@/core/model/Product";
import { useEffect, useState } from "react";

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Partial<Product> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Backend.products.getAll().then(setProducts);
  }, []);

  async function save(productData: Partial<Product>) {
    setError(null); // Reseta erro antes de tentar salvar

    if (!productData) {
      setError("Produto inválido.");
      return;
    }

    // Verifica se o código do produto já existe
    // Considera que o campo de código é 'codigo'. Se for outro, atualize aqui.
    if (productData.code) {
      const duplicate = products.find(
        (p) => p.code === productData.code && p.id !== product?.id,
      );
      if (duplicate) {
        setError("Código do produto já existe. Envio cancelado.");
        return;
      }
    }

    // Compara os objetos convertendo-os para JSON
    // if (product && JSON.stringify(productData) === JSON.stringify(product)) {
    if (JSON.stringify(productData) === JSON.stringify(product)) {
      setError("Nenhuma alteração detectada. Envio cancelado.");
      return;
    }

    try {
      await Backend.products.save(productData);
      const updatedProducts = await Backend.products.getAll();
      setProducts(updatedProducts);
      setProduct(null);
      setError(null);
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Erro ao salvar produto.");
    }
  }

  async function remove(id: string) {
    try {
      await Backend.products.remove(id);
      const updatedProducts = await Backend.products.getAll();
      setProducts(updatedProducts);
      setProduct(null);
      setError(null);
    } catch (error) {
      setError("Erro ao excluir o produto.");
    }
  }

  // Função para remover vários produtos de uma vez
  async function groupRemove(ids: string[]) {
    await Backend.products.removeMany(ids);
    const updatedProducts = await Backend.products.getAll();
    setProducts(updatedProducts);
    // Se o produto atualmente selecionado estiver entre os removidos, limpe-o
    if (product && ids.includes(product.id as string)) {
      setProduct(null);
    }
  }

  return {
    products,
    product,
    error,
    setError,
    save,
    remove,
    groupRemove,
    cancel: () => setProduct(null),
    updateProduct: (product: Partial<Product> | null) => setProduct(product),
  };
}
