"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";
import useFactories from "@/hooks/factory/useFactories";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Customer } from "@/core/model/Customer";
import { CustomerSchema } from "@/schemas";
import SaveCustomerState from "@/backend/customer/saveCustomer";

interface FormCustomerProps {
  error?: string;
  customer: Partial<Customer>;
  onChange: (customer: Partial<Customer>) => void;
  save: (values: z.infer<typeof CustomerSchema>) => Promise<void>;
  cancel: () => void;
  remove: (id: string) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function FormCustomer(props: FormCustomerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      id: props.customer?.id ?? "",
      cnpj: props.customer?.cnpj ?? "",
      name: props.customer?.name ?? "",
      address: props.customer?.address ?? "",
      city: props.customer?.city ?? "",
      state: props.customer?.state ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CustomerSchema>) => {
    props.onError("");
    props.onSuccess("");
    props.onChange(values);

    startTransition(async () => {
      props
        .save(values)
        .then(() => {
          props.onSuccess("Cliente salvo com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao salvar cliente:", error);
          props.onError("Erro ao salvar cliente.");
        });
    });
  };

  const onRemove = async () => {
    startTransition(() => {
      if (props.customer.id) {
        props.remove(props.customer.id); // Passa o id do produto para exclusão
      } else {
        console.error("ID do cliente não encontrado!");
      }
    });
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[600px] sm:ml-14">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            ⚙️ Salvar Cliente
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
              <FormError message={props.error || ""} />
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
                        {`Você tem certeza que deseja deletar o cliente ${props.customer.name}`}
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
