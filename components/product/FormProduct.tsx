"use client";

import * as z from "zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema } from "@/schemas";
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
import Product from "@/core/model/Product";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { CldImage, CldUploadWidget } from "next-cloudinary";

interface FormProductProps {
  error?: string;
  product: Partial<Product>;
  onChange: (product: Partial<Product>) => void;
  save: (values: z.infer<typeof ProductSchema>) => Promise<void>;
  cancel: () => void;
  remove: (id: string) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function FormProduct(props: FormProductProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    props.product.image ? props.product.image.toString() : null,
  );

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      id: props.product.id ?? "",
      code: props.product.code ?? "",
      name: props.product.name ?? "",
      description: props.product.description ?? "",
      image: props.product.image ?? "",
      price: props.product.price ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    props.onError("");
    props.onSuccess("");
    props.onChange(values);

    startTransition(async () => {
      props
        .save(values)
        .then(() => {
          props.onSuccess("Produto salvo com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao salvar produto:", error);
          props.onError("Erro ao salvar produto.");
        });
    });
  };

  const onRemove = async () => {
    startTransition(() => {
      if (props.product.id) {
        props.remove(props.product.id);
      } else {
        console.error("ID do produto não encontrado!");
      }
    });
  };

  useEffect(() => {
    form.reset(props.product);
  }, [props.product, form]);

  return (
    <div className="flex justify-center items-center">
      {/* <Card className="w-[600px] sm:ml-14"> */}
      <Card className="w-full">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            ⚙️ Salvar Produto
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
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
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem do Produto</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <CldUploadWidget
                            uploadPreset="product-image-preset"
                            options={{
                              text: {
                                select: {
                                  action: "select",
                                  text: "Selecionar Imagem",
                                },
                                upload: {
                                  action: "upload",
                                  text: "Carregar Imagem",
                                },
                                remove: {
                                  action: "remove",
                                  text: "Remover Imagem",
                                },
                              },
                              language: "pt-BR",
                              sources: [
                                "local",
                                "url",
                                "dropbox",
                                "google_drive",
                              ],
                              multiple: false,
                              cropping: true,
                              clientAllowedFormats: ["jpg", "png", "webp"],
                              thumbnailTransformation: [
                                {
                                  format: "webp",
                                  quality: "2",
                                  fetch_format: "webp",
                                },
                              ],
                            }}
                            onSuccess={(result: any) => {
                              if (result?.info?.secure_url) {
                                field.onChange(result.info.secure_url);
                              }
                            }}
                          >
                            {({ open }) => (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => open()}
                                disabled={isPending}
                              >
                                Upload da Imagem
                              </Button>
                            )}
                          </CldUploadWidget>

                          {field.value && (
                            <div className="relative group">
                              <CldImage
                                width="200"
                                height="200"
                                src={field.value}
                                alt="Preview"
                                className="rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => field.onChange("")}
                              >
                                Remover
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder=""
                          type="number"
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={isPending}
                      className="bg-red-500 px-4 py-2"
                    >
                      Excluir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                          Tem certeza que deseja excluir o produto{" "}
                          {props.product.name}?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          disabled={isPending}
                          onClick={() => {
                            props.cancel;
                            setIsDialogOpen(false);
                          }}
                        >
                          Cancelar
                        </Button>
                      </DialogFooter>
                    </div>
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
