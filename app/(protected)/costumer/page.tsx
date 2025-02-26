"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import FormFactory from "@/components/factory/FormFactory";
import ListFactory from "@/components/factory/ListFactory";
import useFactories from "@/hooks/factory/useFactories";
import { PlusIcon } from "lucide-react";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useEffect, useState } from "react";
import { Factory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import useCustomers from "@/hooks/customer/useCustomer";
import ListCustomer from "@/components/customer/ListCustomer";
import FormCustomer from "@/components/customer/FormCustomer";

const Page = () => {
  const {
    customer,
    customers,
    save,
    remove,
    error,
    setError,
    groupRemove,
    updatedCustomer,
  } = useCustomers();

  // const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // Limpa a mensagem de sucesso após 5 segundos
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

  // Limpa a mensagem de sucesso após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <main className="sm:ml-14 p-4">
      <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* <div className="flex justify-center items-start p-14"> */}
        <CardContent>
          <div className="space-y-4">
            {customer ? (
              <FormCustomer
                customer={customer}
                error={error || ""}
                onChange={updatedCustomer}
                save={save}
                cancel={() => updatedCustomer(null)}
                remove={remove}
                onSuccess={setSuccess} // Passando a função onSuccess
                onError={setError} // Passando a função onError
              />
            ) : (
              <div className="space-y-4">
                <div className="w-full flex justify-end pr-4">
                  <Button
                    className="flex items-center gap-2px-4 py-2 rounded-md"
                    onClick={() => updatedCustomer({})}
                  >
                    <PlusIcon />
                    <span>Cliente</span>
                  </Button>
                </div>
                <ListCustomer
                  customers={customers}
                  onClick={updatedCustomer}
                  success={success}
                  remove={remove}
                  groupRemove={groupRemove}
                />
              </div>
            )}
          </div>
        </CardContent>
        {/* </div> */}
      </section>
    </main>
  );
};

export default Page;
