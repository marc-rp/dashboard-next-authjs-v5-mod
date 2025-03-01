"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Plus, X } from "lucide-react";

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
      discounts:
        props.factory?.discounts?.map((discount) => ({
          id: "",
          value: discount,
        })) ?? [],
    },
  });

  // Sempre que props.factory mudar, atualize os valores do form
  useEffect(() => {
    if (props.factory) {
      // Mapeia os descontos para o formato { id, value }
      const discountFields =
        props.factory.discounts?.map((discount, index) => ({
          id: `temp-${index}`, // IDs temporários para estabilidade
          value: discount,
        })) || [];

      form.reset({
        id: props.factory.id ?? "",
        cnpj: props.factory.cnpj ?? "",
        name: props.factory.name ?? "",
        address: props.factory.address ?? "",
        city: props.factory.city ?? "",
        state: props.factory.state ?? "",
        discounts: discountFields,
      });
    }
  }, [props.factory, form]);

  // Correção: Adicionar tipagem explícita ao useFieldArray
  const { fields, append, remove } = useFieldArray<
    z.infer<typeof FactorySchema>
  >({
    control: form.control,
    name: "discounts", // Ensure this matches the schema
  });
  const onSubmit = async (values: z.infer<typeof FactorySchema>) => {
    props.onSuccess(""); // Resetando sucesso

    // Transform discounts to string array
    const transformedValues = {
      ...values,
      discounts: values.discounts?.map((discount) => discount.value) ?? [],
    };

    startTransition(() => {
      SaveFactoryState(values as Partial<Factory>).then((data) => {
        if (data?.success) {
          props.onSuccess(data?.success);
          props.save();
        } else {
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
                          type="text"
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
                <FormField
                  control={form.control}
                  name="discounts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descontos</FormLabel>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Input
                              type="text"
                              {...form.register(`discounts.${index}.value`)}
                              disabled={isPending}
                              placeholder="Ex.: 30%-20%-10%"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ id: "", value: "" })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Desconto
                      </Button>
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
