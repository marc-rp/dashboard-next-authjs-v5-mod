"use client";

import { Card, CardContent } from "@/components/ui/card";
import FormProduct from "@/components/product/FormProduct";
import ListProduct from "@/components/product/ListProduct";
import useProducts from "@/hooks/product/useProducts";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const Page = () => {
  const {
    product,
    products,
    save,
    remove,
    error,
    setError,
    groupRemove,
    updateProduct,
  } = useProducts();

  const [success, setSuccess] = useState<string | undefined>("");

  // Limpa a mensagem de sucesso após 2 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Sempre que ocorrer um erro de "Nenhuma alteração detectada", limpa a mensagem de sucesso.
  useEffect(() => {
    if (error) {
      setSuccess(undefined);
    }
  }, [error]);

  // Limpa a mensagem de erro após 2 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <main className="sm:ml-16 mt-4 mr-4 p-4">
      <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* <Card>
          <CardContent> */}
        <div className="w-full">
          {product ? (
            <FormProduct
              product={product}
              error={error || ""}
              onChange={updateProduct}
              save={save}
              cancel={() => updateProduct(null)}
              remove={remove}
              onSuccess={setSuccess} // Passando a função onSuccess
              onError={setError} // Passando a função onError
            />
          ) : (
            <div className="space-y-4 ">
              <div className="w-full flex justify-end pr-4">
                <Button
                  className="flex items-center gap-2px-4 py-2 rounded-md"
                  onClick={() => updateProduct({})}
                >
                  <PlusIcon />
                  <span>Novo Produto</span>
                </Button>
              </div>
              <ListProduct
                products={products}
                onClick={updateProduct}
                success={success}
                remove={remove}
                groupRemove={groupRemove}
              />
            </div>
          )}
        </div>
        {/* </CardContent> */}

        {/* </Card> */}
      </section>
    </main>
  );
};

export default Page;
