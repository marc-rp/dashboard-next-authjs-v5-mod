"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FactorySchema } from "@/schemas";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { updateFactory } from "@/actions/factory/updateFactory";
import { validate } from "uuid";

const UpdateFactoryPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FactorySchema>>({
    resolver: zodResolver(FactorySchema),
    defaultValues: {
      cnpj: "",
      name: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const { setValue } = form;

  useEffect(() => {
    const fetchFactoryData = async () => {
      try {
        const response = await fetch(`/api/factory/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch factory data.");
        }

        const { factory } = await response.json();

        // Preenche os valores do formulário com os dados do produto
        setValue("cnpj", factory.cnpj);
        setValue("name", factory.name);
        setValue("address", factory.address);
        setValue("city", factory.city);
        setValue("state", factory.state);
      } catch (error) {
        console.error(error);
        setError("Failed to load product data.");
      }
    };

    fetchFactoryData();
  }, [id, setValue]);

  const onSubmit = (values: z.infer<typeof FactorySchema>) => {
    startTransition(() => {
      updateFactory(values, {
        params: Promise.resolve({ id }),
      })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            form.reset();
            setSuccess(data.success);
            router.refresh();
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="flex justify-center items-center p-14">
      <Card className="w-[600px] sm:ml-14 p-4">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            ⚙️ Update Factory
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="" disabled={isPending} />
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
                        <Input {...field} placeholder="" disabled={isPending} />
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
                        <Input {...field} placeholder="" disabled={isPending} />
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
                        <Input {...field} placeholder="" disabled={isPending} />
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
                        <Input {...field} placeholder="" disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default UpdateFactoryPage;
