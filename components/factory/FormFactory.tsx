"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FactorySchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Factory } from "@/core/model/Factory";
import SaveFactoryState from "@/backend/factory/saveFactory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormFactoryProps {
  factory: Partial<Factory>;
  onChange: (factory: Partial<Factory>) => void;
  save: () => void;
  cancel: () => void;
  remove: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function FormFactory(props: FormFactoryProps) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FactorySchema>>({
    resolver: zodResolver(FactorySchema),
    defaultValues: {
      id: props.factory?.id ?? "",
      cnpj: props.factory?.cnpj ?? "",
      name: props.factory?.name ?? "",
      address: props.factory?.address ?? "",
      city: props.factory?.city ?? "",
      state: props.factory?.state ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FactorySchema>) => {
    // props.onError(""); // Resetando erro
    props.onSuccess(""); // Resetando sucesso

    startTransition(() => {
      SaveFactoryState(values).then((data) => {
        if (data?.success) {
          props.onSuccess(data?.success);
          props.save();
        } else {
          // props.onError(data.error ?? "");
          setError(data?.error);
        }
      });
    });
  };

  const onRemove = async () => {
    startTransition(() => {
      props.remove();
    });
  };

  return (
    <div className="flex justify-center items-center">
      {/* <Card className="w-[600px] sm:ml-14"> */}
      <Card className="w-full">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            ⚙️ Salvar Fábrica
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder=""
                          type="tex"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder=""
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder=""
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder=""
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormSuccess message={success} />
              <FormError message={error} />
              <div className="flex justify-between">
                <div className="flex gap-5">
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="px-4 py-2"
                  >
                    Salvar
                  </Button>
                  <Button
                    disabled={isPending}
                    onClick={props.cancel}
                    className="bg-zinc-500 px-4 py-2"
                  >
                    Cancelar
                  </Button>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={isPending}
                      className="bg-red-500 px-4 py-2"
                    >
                      Excluir
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Excluir</DialogTitle>
                      <DialogDescription>
                        {`Você tem certeza que deseja deletar a fábrica ${props.factory.name}`}
                        ?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button className="bg-zinc-500" onClick={props.cancel}>
                        Cancelar
                      </Button>
                      <Button className="bg-red-500" onClick={onRemove}>
                        Excluir
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
