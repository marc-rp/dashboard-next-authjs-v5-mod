"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import FormFactory from "@/components/factory/FormFactory";
import ListFactory from "@/components/factory/ListFactory";
import useFactories from "@/hooks/factory/useFactories";
import { PlusIcon } from "lucide-react";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState } from "react";
import { Factory } from "@prisma/client";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { factory, factories, save, remove, groupRemove, updateFactory } =
    useFactories();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // Remove a mensagem de sucesso após 5 segundos
  if (success) {
    setTimeout(() => {
      setSuccess(undefined);
    }, 10000);
  }

  return (
    <main className="sm:ml-16 mt-4 mr-4 p-4">
      <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* <div className="flex justify-center items-start p-14"> */}
        {/* <CardContent> */}
        <div className="w-full">
          {factory ? (
            <FormFactory
              factory={factory}
              onChange={updateFactory}
              save={save}
              cancel={() => updateFactory(null)}
              remove={remove}
              onSuccess={setSuccess} // Passando a função onSuccess
              onError={setError} // Passando a função onError
            />
          ) : (
            <div className="space-y-4">
              <div className="w-full flex justify-end pr-4">
                <Button
                  className="flex items-center gap-2px-4 py-2 rounded-md"
                  onClick={() => updateFactory({})}
                >
                  <PlusIcon />
                  <span>Fornecedor</span>
                </Button>
              </div>
              <ListFactory
                factories={factories}
                onClick={updateFactory}
                success={success}
                remove={remove}
                groupRemove={groupRemove}
              />
            </div>
          )}
        </div>
        {/* </CardContent> */}
        {/* </div> */}
      </section>
    </main>
  );
};

export default Page;
